import { Router, Request, Response } from 'express';
import { UserAuthController } from '@/controllers/Auth.controller';
import { isLoggedIn } from '@/shared/middleware/IsLoggedIn';
import { authRateLimiter } from '@/shared/middleware/rateLimiter';

const userAuthController = new UserAuthController();
const authRouter = Router();

authRouter.post('/', authRateLimiter, (req: Request, res: Response) => userAuthController.createUser(req as any, res, () => {}));
authRouter.get('/', authRateLimiter, isLoggedIn, (req: Request, res: Response) => userAuthController.getAllUsers(req as any, res, () => {}));
authRouter.get('/:accessType/:userId', authRateLimiter, isLoggedIn, (req: Request, res: Response) => userAuthController.getUserByAttrb(req as any, res, () => {}));
authRouter.patch('/:userId', authRateLimiter, isLoggedIn, (req: Request, res: Response) => userAuthController.updateUser(req as any, res, () => {}));
authRouter.delete('/:userId', authRateLimiter, isLoggedIn, (req: Request, res: Response) => userAuthController.deleteUser(req as any, res, () => {}));

export default authRouter;
