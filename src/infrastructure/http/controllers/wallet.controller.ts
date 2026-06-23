import { Response } from 'express';
import { RequestConUsuario } from '../middlewares/auth.middleware';
import { ObtenerBilleteraUseCase } from '../../../application/use-cases/obtener-wallet.use-case';
import { DepositarDineroUseCase } from '../../../application/use-cases/depositar-dinero.use-case';

export class BilleteraController {
  
  constructor(private obtenerBilleteraUseCase: ObtenerBilleteraUseCase,
              private depositarDineroUseCase: DepositarDineroUseCase
  ) {}

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


public depositar = async (req: RequestConUsuario, res: Response): Promise<void> => {
    try {
      const usuarioId = req.usuario?.usuarioId;
      const { monto } = req.body;

      if (!usuarioId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado' });
        return;
      }

      // Validamos que nos hayan mandado un número y no un texto o un vacío
      if (monto === undefined || isNaN(Number(monto))) {
        res.status(400).json({ success: false, error: 'Debe enviar un monto numérico válido' });
        return;
      }

      const saldoActualizado = await this.depositarDineroUseCase.ejecutar(usuarioId, Number(monto));

      res.status(200).json({
        success: true,
        message: `¡Depósito de $${monto} procesado con éxito!`,
        nuevoSaldo: saldoActualizado
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}

