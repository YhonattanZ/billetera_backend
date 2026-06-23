import express, { Application } from 'express';
import authRoutes from './routes/auth.routes';
import billeteraRoutes from './routes/wallet.routes';

export class Server {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/wallet', billeteraRoutes); // Asegúrate de importar billeteraRoutes desde su archivo correspondiente
    // Endpoint de salud mudado a su capa correspondiente
    this.app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'online',
        message: 'FinTech Wallet bajo Clean Architecture latiendo con fuerza',
        timestamp: new Date()
      });
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor de Ingeniería corriendo en el puerto ${this.port}`);
    });
  }
}