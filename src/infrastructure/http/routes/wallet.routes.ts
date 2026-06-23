import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware';
import { PrismaUsuarioRepository } from '../../database/prisma-usuario.repository'; // O tu ruta exacta
import { ObtenerBilleteraUseCase } from '../../../application/use-cases/obtener-wallet.use-case';
import { BilleteraController } from '../controllers/wallet.controller';
import { DepositarDineroUseCase } from '../../../application/use-cases/depositar-dinero.use-case';

const billeteraRouter = Router();

const repositorio = new PrismaUsuarioRepository();
const obtenerBilleteraUC = new ObtenerBilleteraUseCase(repositorio);
const depositarDineroUC = new DepositarDineroUseCase(repositorio);

const controlador = new BilleteraController(obtenerBilleteraUC, depositarDineroUC);
// EL CANDADO ESTÁ AQUÍ: Petición -> verificarToken -> controlador.obtenerMiBilletera
billeteraRouter.get('/me', verificarToken, controlador.obtenerMiBilletera.bind(controlador));
billeteraRouter.post('/depositar', verificarToken, controlador.depositar.bind(controlador));

export default billeteraRouter;