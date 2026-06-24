import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware';
import { PrismaUsuarioRepository } from '../../database/prisma-usuario.repository'; // O tu ruta exacta
import { ObtenerBilleteraUseCase } from '../../../application/use-cases/obtener-wallet.use-case';
import { BilleteraController } from '../controllers/wallet.controller';
import { DepositarDineroUseCase } from '../../../application/use-cases/depositar-dinero.use-case';
import { TransferirDineroUseCase } from '../../../application/use-cases/transferir-dinero.use-case';
import { ObtenerHistorialUseCase } from '../../../application/use-cases/obtener-historial.use-case';
import { RetirarDineroUseCase } from '../../../application/use-cases/retirar-dinero.use-case';

const billeteraRouter = Router();

const repositorio = new PrismaUsuarioRepository();
const obtenerBilleteraUC = new ObtenerBilleteraUseCase(repositorio);
const depositarDineroUC = new DepositarDineroUseCase(repositorio);
const transferirDineroUC = new TransferirDineroUseCase(repositorio);
const obtenerHistorialUC = new ObtenerHistorialUseCase(repositorio);
const retirarDineroUC = new RetirarDineroUseCase(repositorio);

const controlador = new BilleteraController(obtenerBilleteraUC, depositarDineroUC, transferirDineroUC, obtenerHistorialUC, retirarDineroUC);
// EL CANDADO ESTÁ AQUÍ: Petición -> verificarToken -> controlador.obtenerMiBilletera
billeteraRouter.get('/me', verificarToken, controlador.obtenerMiBilletera.bind(controlador));
billeteraRouter.post('/depositar', verificarToken, controlador.depositar.bind(controlador));
billeteraRouter.post('/transfer', verificarToken, controlador.transferir.bind(controlador));
billeteraRouter.get('/history', verificarToken, controlador.obtenerHistorial.bind(controlador));
billeteraRouter.post('/withdraw', verificarToken, controlador.retirar.bind(controlador));

export default billeteraRouter;