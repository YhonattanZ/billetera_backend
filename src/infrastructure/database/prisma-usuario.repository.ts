import { PrismaClient, Prisma } from '@prisma/client';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';
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
public async realizarTransferencia(remitenteId: number, destinatarioId: number, monto: number) {
    // 🛡️ INICIA LA BURBUJA ACID (Cualquier 'throw Error' aquí dentro echa hacia atrás todo lo que haya cambiado)
    
    return await prisma.$transaction(async (tx) => {
      
      // 1. Buscamos al remitente (con 'tx')
      const remitente = await tx.usuario.findUnique({
        where: { id: remitenteId },
        include: { cuenta: true }
      });

      if (!remitente || !remitente.cuenta) throw new Error('La cuenta de origen no existe');

      const saldoRemitente = Number(remitente.cuenta.saldo);
      if (saldoRemitente < monto) {
        throw new Error(`Fondos insuficientes. Tienes $${saldoRemitente} e intentas enviar $${monto}`);
      }

      // 2. Buscamos al destinatario (con 'tx')
      const destinatario = await tx.usuario.findUnique({
        where: { id: destinatarioId },
        include: { cuenta: true }
      });

      if (!destinatario || !destinatario.cuenta) throw new Error('La cuenta de destino no existe en el banco');

      // 3. Le quitamos el dinero a Luna
      const nuevoSaldoRemitente = saldoRemitente - monto;
      await tx.cuenta.update({
        where: { id: remitente.cuenta.id },
        data: { saldo: String(nuevoSaldoRemitente) }
      });

      // 4. Se lo ponemos a Víctor
      const saldoDestinatario = Number(destinatario.cuenta.saldo);
      const nuevoSaldoDestinatario = saldoDestinatario + monto;
      await tx.cuenta.update({
        where: { id: destinatario.cuenta.id },
        data: { saldo: String(nuevoSaldoDestinatario) }
      });

    if (monto > 0) {
      await this.registrarMovimiento(tx, remitenteId, monto, 'TRANSFERENCIA_ENVIADA');
      await this.registrarMovimiento(tx, destinatarioId, monto, 'TRANSFERENCIA_RECIBIDA');
    }
    
      // Si llegamos a esta línea sin errores, Prisma hace el "COMMIT" definitivo en la base de datos
      return {
        
        saldoRestante: nuevoSaldoRemitente,
        destinatario: destinatario.nombre
      };

      
    });
  }

private async registrarMovimiento(
  tx: any, 
  usuarioId: number, 
  monto: number, 
  tipo: string
) {
  // Depuración rápida: veamos si están llegando los datos
  console.log(`DEBUG: Registrando movimiento para ${usuarioId} de ${monto} tipo ${tipo}`);

  await (tx.movimiento || prisma.movimiento).create({
    data: { 
      usuarioId: Number(usuarioId), // Forzamos a número
      monto: monto.toString(),      // Prisma espera Decimal, String es seguro
      tipo: tipo 
    }
  });
}

async obtenerMovimientos(usuarioId: number) {
    // Aquí busco todos los movimientos de este usuario, del más nuevo al más antiguo.
    return await prisma.movimiento.findMany({
        where: { usuarioId },
        orderBy: { fecha: 'desc' }
    });
}
}
