import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';

export class TransferirDineroUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async ejecutar(remitenteId: number, destinatarioId: number, monto: number) {
    if (monto <= 0) {
      throw new Error('El monto a transferir debe ser mayor a $0.00');
    }

    if (remitenteId === destinatarioId) {
      throw new Error('No puedes transferirte dinero a ti mismo (autobucle bloqueado)');
    }

    return await this.usuarioRepository.realizarTransferencia(remitenteId, destinatarioId, monto);
  }
}