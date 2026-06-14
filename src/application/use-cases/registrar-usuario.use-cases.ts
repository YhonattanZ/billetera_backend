import { IUsuarioRepository, IRegistroInput } from '../../domain/usuario.repository';
import bcrypt from 'bcrypt';
import { Usuario } from '@prisma/client';

export class RegistrarUsuarioUseCase {

  constructor(private usuarioRepository: IUsuarioRepository) {}

  public async ejecutar(input: IRegistroInput): Promise<Usuario> {
    // 1. Validar si el email ya existe
    const existeUsuario = await this.usuarioRepository.buscarPorEmail(input.email);
    if (existeUsuario) {
      throw new Error('El correo electrónico ya se encuentra registrado');
    }

    // 2. Aplicar Hashing + Salting a la contraseña 
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(input.password, saltRounds);

    // 3. Guardar en la base de datos mediante el repositorio
    const nuevoUsuario = await this.usuarioRepository.crear({
      nombre: input.nombre,
      email: input.email,
      password: hashedPassword // Guardamos el hash
    });

    return nuevoUsuario;
  }
}