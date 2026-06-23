import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';

export class DepositarDineroUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async ejecutar(usuarioId: number, monto: number) {
    // REGLA DE ORO FINTECH: No se aceptan depósitos negativos ni de cero dólares
    if (monto <= 0) {
      throw new Error('El monto a depositar debe ser mayor a $0.00');
    }

    const nuevoSaldo = await this.usuarioRepository.actualizarSaldo(usuarioId, monto);
    return nuevoSaldo;
  }
}