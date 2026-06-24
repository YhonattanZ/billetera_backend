import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';

export class RetirarDineroUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async ejecutar(usuarioId: number, monto: number) {
    if (monto <= 0) throw new Error('El retiro debe ser mayor a $0.00');

    // Primero verificamos si tiene fondos suficientes
    const usuario = await this.usuarioRepository.findById(usuarioId);
    const saldoActual = Number(usuario?.cuenta?.saldo || 0);

    if (saldoActual < monto) {
      throw new Error('Fondos insuficientes para este retiro');
    }

    // Si tiene fondos, procedemos con el retiro usando la lógica del repo
    return await this.usuarioRepository.actualizarSaldo(usuarioId, -monto);
  }
}