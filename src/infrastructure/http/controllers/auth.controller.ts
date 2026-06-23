import { Request, Response } from 'express';
import { LoginUseCase } from '../../../application/use-cases/login-usuario.use-case';

export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validamos que vengan los datos mínimos
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'El email y el password son obligatorios'
        });
      }

      // Ejecutamos el caso de uso
      const resultado = await this.loginUseCase.execute(email, password);

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error: any) {
      // Si las credenciales fallan, atrapamos el error aquí
      return res.status(401).json({
        success: false,
        error: error.message || 'Error en la autenticación'
      });
    }
  }
}