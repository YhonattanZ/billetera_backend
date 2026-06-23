import { IUsuarioRepository, IRegistroInput } from '../../domain/repositories/usuario.repository';
export class ObtenerBilleteraUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async ejecutar(usuarioId: number) {
    // Necesitaremos que el repositorio busque al usuario e incluya su relación con "Cuenta"
    const usuario = await this.usuarioRepository.findById(usuarioId); 
    
    if (!usuario) {
      throw new Error('Usuario no encontrado en el sistema');
    }

    return usuario;
  }
}