import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware';
import { PrismaUsuarioRepository } from '../../database/prisma-usuario.repository'; // O tu ruta exacta
import { ObtenerBilleteraUseCase } from '../../../application/use-cases/obtener-wallet.use-case';
import { BilleteraController } from '../controllers/wallet.controller';

const billeteraRouter = Router();

const repositorio = new PrismaUsuarioRepository();
const casoDeUso = new ObtenerBilleteraUseCase(repositorio);
const controlador = new BilleteraController(casoDeUso);

// EL CANDADO ESTÁ AQUÍ: Petición -> verificarToken -> controlador.obtenerMiBilletera
billeteraRouter.get('/me', verificarToken, controlador.obtenerMiBilletera.bind(controlador));

export default billeteraRouter;