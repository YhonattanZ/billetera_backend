import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';
export class LoginUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(email: string, passwordPlana: string) {
    // 1. Buscar si el usuario existe en la base de datos de Docker
    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new Error('Credenciales incorrectas'); // Usamos un mensaje genérico por seguridad
    }

    // 2. Comparar la contraseña ingresada con el hash de la base de datos
    // Nota: Cuando crees usuarios de ahora en adelante, asegúrate de guardar la contraseña usando bcrypt.hash()
    const passwordValida = await bcrypt.compare(passwordPlana, usuario.password);
    if (!passwordValida) {
      throw new Error('Credenciales incorrectas');
    }

    // 3. Si todo está bien, generar el JWT
    const token = jwt.sign(
      { usuarioId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' } // El token expira en un día
    );

    // 4. Devolver los datos del usuario (sin la contraseña) junto al token
    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      },
      token
    };
  }
}