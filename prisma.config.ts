import dotenv from 'dotenv';

// Cargamos el archivo .env obligatoriamente
dotenv.config();

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};