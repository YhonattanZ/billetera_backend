import { Billetera } from '../src/domain/billetera';
import { RealizarTransferencia } from '../src/application/use-cases/realizar-transferencia.use-case';

describe('RealizarTransferencia', () => {
  it('debe reducir el saldo de la billetera correctamente', async () => {
    // Arrange
    const billetera = new Billetera(100);
    const casoDeUso = new RealizarTransferencia();

    // Act
    await casoDeUso.ejecutar(billetera, 30);

    // Assert
    expect(billetera.saldo).toBe(70);
  });

  it('debe lanzar un error si el saldo es insuficiente', async () => {
    // Arrange: Creamos billetera con 50
    const billetera = new Billetera(50);
    const casoDeUso = new RealizarTransferencia();

    // Act & Assert: Verificamos que el sistema lanza el error esperado
    // Usamos await porque la función es asíncrona
    await expect(casoDeUso.ejecutar(billetera, 100))
      .rejects.toThrow('Saldo insuficiente');
  });
  
});