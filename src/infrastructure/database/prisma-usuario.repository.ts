import { PrismaClient, Usuario } from '@prisma/client';
import { IUsuarioRepository, IRegistroInput } from '../../domain/repositories/usuario.repository';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import dotenv from 'dotenv';

// 1. Nos aseguramos de que el entorno esté cargado antes de instanciar
dotenv.config();

// 2. Configuración oficial de Prisma 7 para pasar la URL explícita al constructor
const databaseUrl = process.env.DATABASE_URL!.replace('mysql://', 'mariadb://');

// 3. Inicializar el adaptador con la URL corregida
const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({ adapter });

export class PrismaUsuarioRepository implements IUsuarioRepository {
  
  
  async findByEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email }
    });
  }

async findById(id: number) {
  return await prisma.usuario.findUnique({
    where: { id },
    include: { cuenta: true } // <-- ¡Crucial para que nos devuelva el saldo y el número de cuenta!
  });
}
  
  async crear(datos: any) {
    // IMPORTANTE: Asegúrate de que todo tenga 'await' para que no deje la conexión colgada
    return await prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        email: datos.email,
        password: datos.password, // Recuerda encriptarla luego
        cuenta: {
          create: {
            numeroCuenta: `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
            saldo: "0"
          }
        }
      },
      include: {
        cuenta: true
      }
    });
  }

  async actualizarSaldo(usuarioId: number, montoASumar: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { cuenta: true }
    });

    if (!usuario || !usuario.cuenta) {
      throw new Error('No se encontró la cuenta bancaria del usuario');
    }

    // Convertimos a número de forma segura (sirve tanto si en Prisma es String, Float o Decimal)
    const saldoActual = Number(usuario.cuenta.saldo);
    const nuevoSaldo = saldoActual + montoASumar;

    // Actualizamos la tabla Cuenta
    await prisma.cuenta.update({
      where: { id: usuario.cuenta.id },
      data: { 
        saldo: String(nuevoSaldo) // Lo casteamos a String por si tu DB lo guarda en texto
      }
    });

    return nuevoSaldo;
  }

  
}
