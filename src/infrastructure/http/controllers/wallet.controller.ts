import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { ObtenerBilleteraUseCase } from '../../../application/use-cases/obtener-wallet.use-case';

export class BilleteraController {
  constructor(private obtenerBilleteraUseCase: ObtenerBilleteraUseCase) {}

  public obtenerMiBilletera = async (req: RequestConUsuario, res: Response): Promise<void> => {
    try {
      // Tomamos el ID que el middleware inyectó silenciosamente
      const usuarioId = req.usuario?.usuarioId;

      if (!usuarioId) {
        res.status(400).json({ success: false, error: 'No se pudo identificar al usuario autenticado' });
        return;
      }

      const datosCompletos = await this.obtenerBilleteraUseCase.ejecutar(usuarioId);

      // Limpiamos la contraseña antes de escupir los datos a la red
      const { password, ...perfilSeguro } = datosCompletos;

      res.status(200).json({
        success: true,
        data: perfilSeguro
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}