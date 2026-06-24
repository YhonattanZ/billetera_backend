import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 Error capturado:", err.message);
  
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor, estamos trabajando en ello.'
  });
};