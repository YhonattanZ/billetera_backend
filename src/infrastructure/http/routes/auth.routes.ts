import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';

const router = Router();
const usuarioController = new UsuarioController();

router.post('/register', usuarioController.registrar.bind(usuarioController));

export default router;