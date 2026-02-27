import { Router } from 'express';
import { UserAuthController } from '@/controllers/Auth.controller';
import { isLoggedIn } from '@/middleware/IsLoggedIn';


// Initialize the UserAuthController
const userAuthController = new UserAuthController();

// Create router instance
const authRouter = Router();

/**
 * @description Auth routes for user management
 * All routes are prefixed with /auth
 */

// Create a new user (Public route)
authRouter.post('/', userAuthController.createUser);

// Get all users (Protected route)
authRouter.get('/', isLoggedIn, userAuthController.getAllUsers);

// Get a user by attrb (Protected route)
authRouter.get('/:accessType/:userId', isLoggedIn, userAuthController.getUserByAttrb);

// Update a user (Protected route)
authRouter.patch('/:userId', isLoggedIn, userAuthController.updateUser);

// Delete a user (Protected route) //@TODO: Soft delete implementation
authRouter.delete('/:userId', isLoggedIn, userAuthController.deleteUser);

// Log route registration
logger.info('Auth routes registered successfully', {
  fileName: module.filename,
  methodName: 'authRouter',
  variables: {
    routes: [
      'POST /auth/ - Create user',
      'GET /auth/ - Get all users (protected)',
      'GET /auth/:userId - Get user by ID (protected)',
      'PATCH /auth/:userId - Update user (protected)',
      'DELETE /auth/:userId - Delete user (protected)',
    ],
  },
});

export default authRouter;
