import { Request, Response } from 'express';
import { RegistrarUsuarioUseCase } from '../../../application/use-cases/registrar-usuario.use-cases';
import { PrismaUsuarioRepository } from '../../database/prisma-usuario.repository';

const usuarioRepository = new PrismaUsuarioRepository();
const registrarUsuarioUseCase = new RegistrarUsuarioUseCase(usuarioRepository);

export class UsuarioController {
  
  public registrar = async (req: Request, res: Response): Promise<void> => {
    console.log('📥 [POST] Cuerpo recibido en crudo:', req.body);

    try {
      // 🕵️‍♀️ Sanitización y mapeo explícito (Nuestro "fromJson" manual)
      const nombre = String(req.body.nombre || '').trim();
      const email = String(req.body.email || '').trim().toLowerCase();
      const password = String(req.body.password || '');

      if (!nombre || !email || !password) {
        console.log('⚠️ Validación fallida: Campos vacíos o mal codificados');
        res.status(400).json({ error: 'Campos obligatorios faltantes o inválidos' });
        return;
      }

      console.log('⚙️ Enviando datos limpios al Caso de Uso...', { nombre, email });
      
      // Ejecutamos y esperamos con un timeout controlado en el código para que no muera a los 20s
      const nuevoUsuario = await registrarUsuarioUseCase.ejecutar({ nombre, email, password });
      
      console.log('✅ Usuario creado exitosamente en el flujo');
      
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