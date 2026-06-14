import { PrismaClient, Usuario } from '@prisma/client';
import { IUsuarioRepository, IRegistroInput } from '../../domain/usuario.repository';
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
  
  public async buscarPorEmail(email: string): Promise<Usuario | null> {
    console.log(`🔍 [Prisma] Iniciando findUnique para: ${email}`);
    try {
      const resultado = await prisma.usuario.findUnique({
        where: { email }
      });
      console.log('🔍 [Prisma] findUnique respondió con éxito.');
      return resultado;
    } catch (dbError: any) {
      console.error('❌ [Prisma Error] Falló findUnique inmediatamente:', dbError.message);
      throw new Error(`Error en búsqueda por email: ${dbError.message}`);
    }
  }

  public async crear(datos: IRegistroInput): Promise<Usuario> {
    console.log('💾 [Prisma] Iniciando operación de escritura (.create)');
    try {
      const usuarioCreado = await prisma.usuario.create({
        data: {
          nombre: datos.nombre,
          email: datos.email,
          password: datos.password,
          // 🚨 ¡OJO AQUÍ!: Asegúrate de que el modelo 'cuenta' en tu schema.prisma 
          // acepte 'numeroCuenta' como string y 'saldo' como Float/Decimal.
          cuenta: {
            create: {
              numeroCuenta: `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
              saldo: 0.00
            }
          }
        },
        // Forzamos a Prisma a incluir la cuenta para validar la relación
        include: {
          cuenta: true
        }
      });
      console.log('💾 [Prisma] Escritura completada en MySQL.');
      return usuarioCreado;
    } catch (dbError: any) {
      console.error('❌ [Prisma Error] Falló el .create de inmediato:', dbError.message);
      throw new Error(`Error al insertar en la base de datos: ${dbError.message}`);
    }
  }
}