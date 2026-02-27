import { Response } from 'express';

export const success = (res: Response, data: any, status = 200, meta?: any): void => {
  res.status(status).json({ success: true, data, meta });
};

export const error = (res: Response, status: number, msg: string): void => {
  res.status(status).json({ success: false, error: msg });
};
