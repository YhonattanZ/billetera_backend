import { Usuario } from '@prisma/client';

// Definimos qué datos necesitamos estrictamente para registrar
export interface IRegistroInput {
  nombre: string;
  email: string;
  password: string;
}

export interface IUsuarioRepository {
  crear(datos: IRegistroInput): Promise<Usuario>;
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: number): Promise<Usuario | null>;
  actualizarSaldo(usuarioId: number, montoASumar: number): Promise<number>;
  realizarTransferencia(remitenteId: number, destinatarioId: number, monto: number): Promise<{ saldoRestante: number; destinatario: string }>;
}