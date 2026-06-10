import dotenv from 'dotenv';
import { Server } from './infrastructure/http/server';

// Cargar entorno
dotenv.config();

const port = Number(process.env.PORT) || 3000;

// Instanciar y encender el servidor modular
const server = new Server(port);
server.start();