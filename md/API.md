# LeadFlow API Documentation

This document describes the HTTP API for the LeadFlow backend. All public routes are prefixed with `/api/v1`.

## Base URL

- Development: `http://localhost:3001` (or your configured port)
- Production: `https://your-api-domain.com`

All endpoints below are relative to the base URL. Example: `POST /api/v1/auth/login` means `POST {BASE_URL}/api/v1/auth/login`.

## Authentication

Most endpoints require a valid JWT access token. Send it in the `Authorization` header:

```
Authorization: Bearer <access-token>
```

Token refresh uses a refresh token (e.g. in body or httpOnly cookie depending on client setup). See Auth section.

## Response format

### Success

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

- `data`: Response payload. Omitted for some success responses.
- `meta`: Optional. Used for pagination: `total`, `page`, `limit`.

### Error

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### Validation error (422)

When request validation fails (Joi), the response is:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["Field message 1", "Field message 2"]
}
```

## HTTP status codes

| Code | Meaning |
|------|--------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (business rule or invalid input) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (e.g. not admin) |
| 404 | Not Found |
| 409 | Conflict (e.g. email already registered) |
| 422 | Unprocessable Entity (validation failed) |
| 500 | Internal Server Error |

---

## Health

### GET /api/v1/health

Public. Returns server status.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.456
  }
}
```

---

## Auth

Base path: `/api/v1/auth`. All auth routes use rate limiting; login and forgot-password use stricter limits.

### POST /api/v1/auth/signup

Create a new account. Body (all required): `email`, `name`, `password`, `corporationName`. Validation: email format; name length; password length; corporation name length.

**Response (201):** `{ success: true, data: { tokens: { accessToken, refreshToken }, user: MeResponse } }`

**Errors:** 400 (validation), 409 (email already registered).

### POST /api/v1/auth/login

Body: `email`, `password`.

**Response (200):** `{ success: true, data: { tokens: { accessToken, refreshToken }, user: MeResponse } }`

**Errors:** 401 (invalid credentials).

### POST /api/v1/auth/refresh

Body: `refreshToken`. Returns new access token.

**Response (200):** `{ success: true, data: { accessToken } }`

**Errors:** 401 (invalid or expired refresh token).

### POST /api/v1/auth/logout

Requires authentication. Invalidates refresh token for the current user.

**Response (200):** `{ success: true, data: { message: "Logged out successfully" } }`

### GET /api/v1/auth/me

Requires authentication. Returns current user profile (id, email, name, role, isVerified, tokenBalance, corporationId, createdAt, updatedAt).

**Response (200):** `{ success: true, data: MeResponse }`

**Errors:** 404 (user not found).

### POST /api/v1/auth/verify-email/:token

Public. Verifies email using the token from the verification link.

**Response (200):** `{ success: true, data: { message: "Email verified successfully" } }`

**Errors:** 400 (invalid or expired token).

### POST /api/v1/auth/resend-verification

Body: `email`. Sends a new verification email if the account exists and is not verified.

**Response (200):** `{ success: true, data: { message: "Verification email sent if account exists" } }`

### POST /api/v1/auth/forgot-password

Body: `email`. Sends a password reset email if the account exists. Does not reveal whether the email exists.

**Response (200):** `{ success: true, data: { message: "Reset email sent if account exists" } }`

### POST /api/v1/auth/reset-password

Body: `token`, `password`. Resets password using the token from the reset email.

**Response (200):** `{ success: true, data: { message: "Password reset successfully" } }`

**Errors:** 400 (invalid or expired token).

---

## Leads

Base path: `/api/v1/leads`. All endpoints require authentication and are rate-limited.

### GET /api/v1/leads

List lead requests for the current user. Query: `page`, `limit` (or equivalent for pagination).

**Response (200):** `{ success: true, data: LeadRequest[], meta: { total, page, limit } }`

### POST /api/v1/leads/upload

Create a lead request via file upload. Content-Type: `multipart/form-data`. Body must include list metadata (e.g. listName, industry, description) and the file. File is stored and processed asynchronously.

**Response (201):** `{ success: true, data: LeadRequest }`

**Errors:** 400 (e.g. no file, validation).

### POST /api/v1/leads/link

Create a lead request via URL. Body: `listName`, `industry`, `description` (optional), `fileUrl` (required, valid URI). Validates against allowed industries.

**Response (201):** `{ success: true, data: LeadRequest }`

**Errors:** 400 (validation).

### GET /api/v1/leads/:id

Get a single lead request by id (must belong to current user).

**Response (200):** `{ success: true, data: LeadRequest }`

**Errors:** 404.

### GET /api/v1/leads/:id/file

Get a signed URL to download the original file for the lead request.

**Response (200):** `{ success: true, data: { url } }`

**Errors:** 404.

### GET /api/v1/leads/:id/leads

List parsed leads for the lead request. Query: pagination params.

**Response (200):** `{ success: true, data: Lead[], meta: { total, page, limit } }`

**Errors:** 404.

### DELETE /api/v1/leads/:id

Soft-delete the lead request (must belong to current user).

**Response (200):** `{ success: true, data: { message: "Lead request deleted" } }`

**Errors:** 404.

---

## Templates

Base path: `/api/v1/templates`. All endpoints require authentication.

### GET /api/v1/templates

List templates for the current user. Query: pagination.

**Response (200):** `{ success: true, data: Template[], meta }`

### POST /api/v1/templates

Create a template. Body: `productName`, `description`, `targetAudience` (optional), `tone` (optional), `cta` (optional). Validation: min/max lengths; tone from allowed set.

**Response (201):** `{ success: true, data: Template }`

**Errors:** 400 (validation).

### GET /api/v1/templates/:id

Get a template by id (must belong to current user).

**Response (200):** `{ success: true, data: Template }`

**Errors:** 404.

### PATCH /api/v1/templates/:id

Update a template. Only templates in DRAFT status can be updated. Body: same fields as create, all optional.

**Response (200):** `{ success: true, data: Template }`

**Errors:** 400 (e.g. not DRAFT), 404.

### DELETE /api/v1/templates/:id

Delete a template (must belong to current user).

**Response (200):** `{ success: true, data: { message: "Template deleted" } }`

**Errors:** 404.

### POST /api/v1/templates/:id/preview

Generate and store a sample preview (email + WhatsApp) for the template. Returns the generated content.

**Response (200):** `{ success: true, data: { emailSubject, emailBody, whatsApp } }`

**Errors:** 400, 404.

### POST /api/v1/templates/:id/launch

Launch a campaign from the template. Body: `name` (campaign name), `leadListIds` (array of lead request ids, min one). Template is set to ACTIVE and a campaign is created.

**Response (201):** `{ success: true, data: Campaign }`

**Errors:** 400 (validation), 404.

---

## Campaigns

Base path: `/api/v1/campaigns`. All endpoints require authentication.

### GET /api/v1/campaigns

List campaigns for the current user. Query: pagination.

**Response (200):** `{ success: true, data: Campaign[], meta }`

### GET /api/v1/campaigns/:id

Get a campaign by id (must belong to current user).

**Response (200):** `{ success: true, data: Campaign }`

**Errors:** 404.

### PATCH /api/v1/campaigns/:id/pause

Pause a running campaign. Only RUNNING campaigns can be paused.

**Response (200):** `{ success: true, data: Campaign }`

**Errors:** 400 (not running), 404.

### PATCH /api/v1/campaigns/:id/resume

Resume a paused campaign. Only PAUSED campaigns can be resumed.

**Response (200):** `{ success: true, data: Campaign }`

**Errors:** 400 (not paused), 404.

### GET /api/v1/campaigns/:id/logs

Get engagement logs for the campaign. Query: pagination.

**Response (200):** `{ success: true, data: EngagementLog[], meta }`

**Errors:** 404.

### GET /api/v1/campaigns/:id/hot-leads

Get hot-lead conversations for the campaign. Query: pagination.

**Response (200):** `{ success: true, data: Conversation[], meta }`

**Errors:** 404.

---

## Conversations

Base path: `/api/v1/conversations`. All endpoints require authentication.

### GET /api/v1/conversations

List conversations for the current user. Query: pagination.

**Response (200):** `{ success: true, data: Conversation[], meta }`

### GET /api/v1/conversations/:id

Get a conversation by id including lead and messages (must belong to current user).

**Response (200):** `{ success: true, data: Conversation }`

**Errors:** 404.

### POST /api/v1/conversations/:id/reply

Send a reply. Body: `content` (string, 1–4000 chars), `channel` (`EMAIL` or `WHATSAPP`). Message is sent via the chosen channel and stored as an outbound message.

**Response (201):** `{ success: true, data: Message }`

**Errors:** 400 (validation or no contact for channel), 404.

---

## Webhooks

Base path: `/api/v1/webhooks`. Used by external providers (Resend, WhatsApp). Rate limiting applies; no JWT required for incoming webhook calls.

### POST /api/v1/webhooks/email-reply

Inbound email reply webhook (e.g. Resend). Optional HMAC verification via header when configured. Body format is provider-specific.

**Response (200):** `{ success: true, data: { received: true } }`

### POST /api/v1/webhooks/wa-reply

Inbound WhatsApp reply webhook. Body format is provider-specific (e.g. Meta webhook payload).

**Response (200):** `{ success: true, data: { received: true } }`

### GET /api/v1/webhooks/wa-verify

WhatsApp webhook subscription verification. Query: `hub.mode`, `hub.verify_token`, `hub.challenge`. Returns the challenge when token matches.

**Response (200):** Plain text challenge, or 403 if verification fails.

### POST /api/v1/webhooks/wa-verify

Acknowledges WhatsApp webhook delivery.

**Response (200):** `{ success: true, data: { received: true } }`

---

## Admin

Base path: `/api/v1/admin`. All endpoints require authentication and the `ADMIN` role. Rate limiting applies.

### GET /api/v1/admin/users

List all users (non-deleted). Query: pagination.

**Response (200):** `{ success: true, data: User[], meta }`

### GET /api/v1/admin/users/:id

Get a user by id.

**Response (200):** `{ success: true, data: User }`

**Errors:** 404.

### PATCH /api/v1/admin/users/:id/tokens

Update a user's token balance. Body: `tokenBalance` (number, non-negative integer).

**Response (200):** `{ success: true, data: User }`

**Errors:** 400 (validation), 404.

### PATCH /api/v1/admin/users/:id/suspend

Suspend or unsuspend a user. Body: `suspend` (boolean).

**Response (200):** `{ success: true, data: User }`

**Errors:** 400, 404.

### DELETE /api/v1/admin/users/:id

Soft-delete a user.

**Response (200):** `{ success: true, data: { message: "User deleted" } }`

**Errors:** 404.

### GET /api/v1/admin/lead-requests

List all lead requests. Query: pagination.

**Response (200):** `{ success: true, data: LeadRequest[], meta }`

### GET /api/v1/admin/campaigns

List all campaigns. Query: pagination.

**Response (200):** `{ success: true, data: Campaign[], meta }`

### GET /api/v1/admin/stats

Aggregate platform statistics (e.g. total users, lead requests, campaigns, leads).

**Response (200):** `{ success: true, data: { totalUsers, totalLeadRequests, totalCampaigns, totalLeads } }`

---

## Internal endpoints

These routes are for server-to-server callbacks (e.g. lead parsing service). They require header `x-service-key` to match `INTERNAL_SERVICE_KEY`. Not for use by the frontend.

### POST /api/v1/internal/leads/parsed

Body: `leadRequestId`, `leads` (array), `totalCount`, `dupCount`. Updates the lead request status to DONE and stores parsed leads.

**Response (200):** `{ success: true, data: { updated: true } }`

### POST /api/v1/internal/leads/failed

Body: `leadRequestId`. Sets the lead request status to FAILED.

**Response (200):** `{ success: true, data: { updated: true } }`

---

## Rate limiting

Auth endpoints use rate limiters (signup, login, refresh, etc.). Stricter limits apply to login and forgot-password. API routes under `/api/v1/leads`, `/api/v1/templates`, etc. use a general API rate limiter. Webhooks use a dedicated webhook rate limiter. Exceeding limits returns 429 (or the configured behaviour).

## CORS

CORS is configured per environment. Allowed origins and methods are set via application config; in production, restrict origins appropriately.
