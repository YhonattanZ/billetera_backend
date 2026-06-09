import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Cargar variables de entorno (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender formato JSON en el cuerpo de las peticiones
app.use(express.json());

// Ruta de prueba (Endpoint de salud de la API)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    message: 'Servidor de FinTech Wallet rugiendo perfectamente',
    timestamp: new Date()
  });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo con éxito en http://localhost:${PORT}`);
});