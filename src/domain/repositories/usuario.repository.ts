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
}