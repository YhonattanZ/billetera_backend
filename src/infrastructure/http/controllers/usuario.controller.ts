import { Request, Response } from 'express';
import { RegistrarUsuarioUseCase } from '../../../application/use-cases/registrar-usuario.use-cases';
import { PrismaUsuarioRepository } from '../../database/prisma-usuario.repository';
import { logger } from '../../../infrastructure/logging/logger';

const usuarioRepository = new PrismaUsuarioRepository();
const registrarUsuarioUseCase = new RegistrarUsuarioUseCase(usuarioRepository);

export class UsuarioController {
  
  public registrar = async (req: Request, res: Response): Promise<void> => {
   logger.info;
    try {
      // 🕵️‍♀️ Sanitización y mapeo explícito (Nuestro "fromJson" manual)
      const nombre = String(req.body.nombre || '').trim();
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');

      if (!nombre || !email || !password) {
       logger.info;
        res.status(400).json({ error: 'Campos obligatorios faltantes o inválidos' });
        return;
      }

     logger.info;
      
      // Ejecutamos y esperamos con un timeout controlado en el código para que no muera a los 20s
      const nuevoUsuario = await registrarUsuarioUseCase.ejecutar({ nombre, email, password });
      
     logger.info;
      
      const { password: _, ...usuarioSeguro } = nuevoUsuario;
      res.status(201).json({ success: true, data: usuarioSeguro });
      return;

    } catch (error: any) {
      console.error("❌ Excepción atrapada en el Controlador:", error.message);
      res.status(500).json({ error: error.message });
      return;
    }
  }
}