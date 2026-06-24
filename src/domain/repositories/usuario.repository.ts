

// Definimos qué datos necesitamos estrictamente para registrar
export interface IRegistroInput {
  nombre: string;
  email: string;
  password: string;
}

export interface IUsuarioRepository {
  findById(id: number): Promise<any>;
  actualizarSaldo(usuarioId: number, monto: number): Promise<number>;
  realizarTransferencia(remitenteId: number, destinatarioId: number, monto: number): Promise<any>;
  obtenerMovimientos(usuarioId: number): Promise<any[]>;
  crear(datos: any): Promise<any>;
  findByEmail(email: string): Promise<any>;
  

}