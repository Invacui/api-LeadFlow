import { Industry, LeadStatus } from '@prisma/client';

export interface CreateLeadRequestByLink {
  listName: string;
  industry: Industry;
  description?: string;
  fileUrl: string;
}

export interface CreateLeadRequestByUpload {
  listName: string;
  industry: Industry;
  description?: string;
}

export interface LeadRequestResponse {
  id: string;
  listName: string;
  industry: Industry;
  description?: string | null;
  status: LeadStatus;
  totalCount: number;
  dupCount: number;
  fileKey?: string | null;
  cleanFileKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadRecord {
  id: string;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  metadata?: any;
  createdAt: Date;
}
