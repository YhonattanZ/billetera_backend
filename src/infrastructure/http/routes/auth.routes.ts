import { Router } from 'express';
import { PrismaUsuarioRepository } from '../../database/prisma-usuario.repository';
import { LoginUseCase } from '../../../application/use-cases/login-usuario.use-case';
import { AuthController } from '../controllers/auth.controller';
import { UsuarioController } from '../controllers/usuario.controller';

const authRouter = Router();

// 1. Instanciamos las capas (Inyección de dependencias)
const usuarioRepository = new PrismaUsuarioRepository();
const loginUseCase = new LoginUseCase(usuarioRepository);
const authController = new AuthController(loginUseCase);
const usuarioController = new UsuarioController();

// 2. Definimos el endpoint POST /auth/login
// Usamos .bind para no perder el contexto de 'this' dentro del controlador


/**
 * @openapi
 * /api/wallet/login:
 * post:
 * summary: Iniciar sesión
 * responses:
 * 200:
 * description: Inicio de sesión exitoso
 */
authRouter.post('/login', authController.login.bind(authController));

/**
 * @openapi
 * /api/wallet/register:
 * post:
 * summary: Registrar usuario   
 * responses:
 * 200:
 * description: Registro exitoso
 */
authRouter.post('/register', usuarioController.registrar.bind(usuarioController));




export default authRouter;