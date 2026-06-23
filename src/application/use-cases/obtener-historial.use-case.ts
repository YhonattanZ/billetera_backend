import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';

export class ObtenerHistorialUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async ejecutar(usuarioId: number) {
    // Le pido al repo que me traiga la lista.
    // Si no hay nada, devuelvo un array vacío, no quiero que el usuario vea un error.
    return await this.usuarioRepository.registrarMovimiento(usuarioId);
  }
}