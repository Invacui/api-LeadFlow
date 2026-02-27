import { Router } from 'express';
import authRouter from '@/routes/Auth.router';


// Create main router instance
const routes = Router();

/**
 * @description Main application routes
 * All route modules are mounted here
 */

/**
 * @route /auth
 *
 * @description User authentication and management routes
 */
routes.use('/auth', authRouter);

/**
 * @route /users
 *
 * @description User management routes (if separate from auth)
 */
// routes.use('/users', userRouter); // Uncomment and implement userRouter if needed

/**
 * @route /health
 *
 * @description Health check route to verify server status
 */
routes.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Log route registration
/* logger.info('[router] Main routes registered successfully', {
  fileName: __filename,
  methodName: 'routes',
  variables: {
    routes: [
      'GET /health - Health check',
      'POST /auth/ - Create user',
      'GET /auth/ - Get all users (protected)',
      'GET /auth/:userId - Get user by ID (protected)',
      'PUT /auth/:userId - Update user (protected)',
      'DELETE /auth/:userId - Delete user (protected)',
    ],
  },
});
 */
export default routes;
