import bcrypt from 'bcrypt';

export class AuthService {
  private static SALT_ROUNDS = 10;

  static async encriptarPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compararPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}