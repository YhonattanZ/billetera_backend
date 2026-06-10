import express, { Application } from 'express';

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