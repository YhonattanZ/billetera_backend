import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Extendemos la petición nativa de Express para poder pegarle nuestro usuario desencriptado
export interface RequestConUsuario extends Request {
  usuario?: { usuarioId: number; email: string };
}

export const verificarToken = (req: RequestConUsuario, res: Response, next: NextFunction): void => {
  // Capturamos el header de autorización
  const authHeader = req.headers.authorization;

  // Verificamos que exista y que tenga el formato correcto ("Bearer eyJhb...")
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ 
      success: false, 
      error: 'Acceso denegado: Token no proporcionado o formato inválido' 
    });
    return;
  }

  // Extraemos solo el string del token ignorando la palabra "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Desencriptamos el payload usando la misma frase secreta del .env
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { usuarioId: number; email: string };
    
    // MIRA ESTA MAGIA: Le pegamos el payload a la petición para que el controlador lo use
    req.usuario = payload; 
    
    next(); // "Todo en orden, pase usted" -> Le pasa el control a la siguiente función
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token expirado o no válido' });
    return;
  }
};