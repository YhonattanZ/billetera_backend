
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = { 
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FinTech Wallet API',
      version: '1.0.0',
      description: 'API para la gestión de billeteras digitales'
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: [require('path').resolve(__dirname, '../../http/routes/billetera.routes.ts')]
};
const swaggerSpec = swaggerJsdoc(options);
console.log("Rutas encontradas:", JSON.stringify((swaggerSpec as any).paths, null, 2));
export { swaggerSpec };