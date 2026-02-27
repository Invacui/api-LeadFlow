import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ControllerMethod } from '@/types';
import { authService } from '@/services/Auth.service';
import { CreateUserApiRequestValidator, UpdateUserApiRequestValidator } from '@/validators/Auth.validator';
import { validateRequest } from '@/utils/AuthValidator.utils';
import ErrorHandler from '@/utils/ErrorHandler.utils';
import { CreateUserRequest } from '@/interfaces/Auth.dto';

/**
 * @class UserAuthController
 * @description CONTROLLER class for handling user authentication
 */
export class UserAuthController {
  /**
   * @method createUser
   * @description CONTROLLER for creating a new user
   * @param {AuthenticatedRequest} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  createUser: ControllerMethod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info('[CONTROLLER] Processing request to create a new user', {
        fileName: __filename,
        methodName: this.createUser.name,
        variables: { body: req.body },
      });

      // Validate the request body
      const { error, value } = validateRequest(
        CreateUserApiRequestValidator,
        req.body as CreateUserRequest
      );

      if (error) {
        logger.warn('[CONTROLLER] Validation error in create user request', {
          fileName: __filename,
          methodName: this.createUser.name,
          variables: { errors: error, body: req.body },
        });

        // Create validation error response to send to client
        const validationErrorResponse =
          ErrorHandler.createValidationErrorResponse(error, {
            req,
            additionalInfo: {
              fileName: __filename,
              methodName: this.createUser.name,
            },
          });

        res.status(400).json(validationErrorResponse);
        return;
      }

      // Create user using service
      const result = await authService.createUser(value);

      logger.info('[CONTROLLER] User created successfully', {
        fileName: __filename,
        methodName: this.createUser.name,
        variables: { userId: result.user.id, email: result.user.email },
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result,
      });
    } catch (error) {
      const errorResponse = ErrorHandler.handleError(
        error,
        {
          req,
          additionalInfo: {
            fileName: __filename,
            methodName: this.createUser.name,
            body: req.body,
          },
        },
        'Error creating user'
      );

      res.status(500).json(errorResponse);
    }
  };

  /**
   * @method getUserByAttrb
   * @description CONTROLLER for getting a user by ID
   * @param {AuthenticatedRequest} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  getUserByAttrb: ControllerMethod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, accessType } = req.params;

      logger.info('[CONTROLLER] Processing request to get user by attrb', {
        fileName: __filename,
        methodName: this.getUserByAttrb.name,
        variables: { userId, type: accessType },
      });

      if (
        accessType !== 'id' &&
        accessType !== 'email' &&
        accessType !== 'phone'
      ) {
        throw new Error(
          'Invalid access type. Must be "id", "email", or "phone".'
        );
      }
      const user = await authService.getUserByAttrb({ accessType, id: userId });

      if (!user) {
        logger.warn('[CONTROLLER] User not found', {
          fileName: __filename,
          methodName: this.getUserByAttrb.name,
          variables: { userId },
        });

        const notFoundResponse = ErrorHandler.createNotFoundErrorResponse(
          'User',
          {
            req,
            additionalInfo: {
              fileName: __filename,
              methodName: this.getUserByAttrb.name,
              userId,
            },
          }
        );

        res.status(404).json(notFoundResponse);
        return;
      }

      logger.info('[CONTROLLER] User retrieved successfully', {
        fileName: __filename,
        methodName: this.getUserByAttrb.name,
        variables: { userId, email: user.email },
      });

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user.toJSON(),
      });
    } catch (error) {
      const errorResponse = ErrorHandler.handleError(
        error,
        {
          req,
          additionalInfo: {
            fileName: __filename,
            methodName: this.getUserByAttrb.name,
            userId: req.params.userId,
          },
        },
        'Error fetching user data'
      );

      res.status(500).json(errorResponse);
    }
  };

  /**
   * @method getAllUsers
   * @description CONTROLLER for getting all users
   * @param {AuthenticatedRequest} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  getAllUsers: ControllerMethod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info('[CONTROLLER] Processing request to get all users', {
        fileName: __filename,
        methodName: this.getAllUsers.name,
      });

      const users = await authService.getAllUsers();

      logger.info('[CONTROLLER] All users retrieved successfully', {
        fileName: __filename,
        methodName: this.getAllUsers.name,
        variables: { count: users.length },
      });

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users.map(user => user.toJSON()),
      });
    } catch (error) {
      const errorResponse = ErrorHandler.handleError(
        error,
        {
          req,
          additionalInfo: {
            fileName: __filename,
            methodName: this.getAllUsers.name,
          },
        },
        'Error getting all users'
      );

      res.status(500).json(errorResponse);
    }
  };

  /**
   * @method updateUser
   * @description CONTROLLER for updating a user
   * @param {AuthenticatedRequest} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  updateUser: ControllerMethod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      logger.info('[CONTROLLER] Processing request to update user', {
        fileName: __filename,
        methodName: this.updateUser.name,
        variables: { userId, body: req.body },
      });

      // Validate the request body
      const { error, value } = validateRequest(
        UpdateUserApiRequestValidator,
        req.body as CreateUserRequest
      );

      if (error) {
        logger.warn('[CONTROLLER] Validation error in update user request', {
          fileName: __filename,
          methodName: this.updateUser.name,
          variables: { errors: error, body: req.body },
        });

        // Create validation error response to send to client
        const validationErrorResponse =
          ErrorHandler.createValidationErrorResponse(error, {
            req,
            additionalInfo: {
              fileName: __filename,
              methodName: this.updateUser.name,
            },
          });

        res.status(400).json(validationErrorResponse);
        return;
      }

      const user = await authService.updateUser(userId, value);

      if (!user) {
        logger.warn('[CONTROLLER] User not found for update', {
          fileName: __filename,
          methodName: this.updateUser.name,
          variables: { userId },
        });

        const notFoundResponse = ErrorHandler.createNotFoundErrorResponse(
          'User',
          {
            req,
            additionalInfo: {
              fileName: __filename,
              methodName: this.updateUser.name,
              userId,
            },
          }
        );

        res.status(404).json(notFoundResponse);
        return;
      }

      logger.info('[CONTROLLER] User updated successfully', {
        fileName: __filename,
        methodName: this.updateUser.name,
        variables: { userId, email: user.email },
      });

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user.toJSON(),
      });
    } catch (error) {
      const errorResponse = ErrorHandler.handleError(
        error,
        {
          req,
          additionalInfo: {
            fileName: __filename,
            methodName: this.updateUser.name,
            userId: req.params.userId,
            body: req.body,
          },
        },
        'Error updating user'
      );

      res.status(500).json(errorResponse);
    }
  };

  /**
   * @method deleteUser
   * @description CONTROLLER for deleting a user
   * @param {AuthenticatedRequest} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  deleteUser: ControllerMethod = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      logger.info('[CONTROLLER] Processing request to delete user', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: { userId },
      });

      const success = await authService.deleteUser(userId);

      if (!success) {
        logger.warn('[CONTROLLER] User not found for deletion', {
          fileName: __filename,
          methodName: this.deleteUser.name,
          variables: { userId },
        });

        const notFoundResponse = ErrorHandler.createNotFoundErrorResponse(
          'User',
          {
            req,
            additionalInfo: {
              fileName: __filename,
              methodName: this.deleteUser.name,
              userId,
            },
          }
        );

        res.status(404).json(notFoundResponse);
        return;
      }

      logger.info('[CONTROLLER] User deleted successfully', {
        fileName: __filename,
        methodName: this.deleteUser.name,
        variables: { userId },
      });

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      const errorResponse = ErrorHandler.handleError(
        error,
        {
          req,
          additionalInfo: {
            fileName: __filename,
            methodName: this.deleteUser.name,
            userId: req.params.userId,
          },
        },
        'Error deleting user'
      );

      res.status(500).json(errorResponse);
    }
  };
}

export default UserAuthController;
