import { IUsuarioRepository, IRegistroInput } from '../../domain/repositories/usuario.repository';
import { AuthService } from '../../infrastructure/config/auth-service';
import { Usuario } from '@prisma/client';

export class RegistrarUsuarioUseCase {

  constructor(private usuarioRepository: IUsuarioRepository) {}

  public async ejecutar(input: IRegistroInput): Promise<Usuario> {
    // 1. Validar si el email ya existe
    const existeUsuario = await this.usuarioRepository.findByEmail(input.email);
    if (existeUsuario) {
      throw new Error('El correo electrónico ya se encuentra registrado');
    }
  const passwordHasheada = await AuthService.encriptarPassword(input.password);
    // 3. Guardar en la base de datos mediante el repositorio
    const nuevoUsuario = await this.usuarioRepository.crear({
      nombre: input.nombre,
      email: input.email,
      password: passwordHasheada // Guardamos el hash
    });

    return nuevoUsuario;
  }
}