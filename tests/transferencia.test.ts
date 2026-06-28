import { Billetera } from '../src/domain/billetera';
import { RealizarTransferencia } from '../src/application/use-cases/realizar-transferencia.use-case';
import { BilleteraRepository } from 'domain/repositories/billetera.repository';

describe('RealizarTransferencia', () => {

let repositorioMock: any;

  beforeEach(() => {
    repositorioMock = { actualizar: jest.fn() };
  });


  it('debe reducir el saldo de la billetera correctamente', async () => {
    // Creamos un mock vacío para satisfacer el constructor
   
    const billetera = new Billetera(100);
    const casoDeUso = new RealizarTransferencia(repositorioMock);

    await casoDeUso.ejecutar(billetera, 30);

    expect(billetera.saldo).toBe(70);
  });

  it('debe lanzar un error si el saldo es insuficiente', async () => {
   
    const billetera = new Billetera(50);
    const casoDeUso = new RealizarTransferencia(repositorioMock);

    await expect(casoDeUso.ejecutar(billetera, 100))
      .rejects.toThrow('Saldo insuficiente');
  });
  it('debe persistir los datos al realizar una transferencia exitosa', async () => {
  const billetera = new Billetera(100);
  
  // Creamos el mock que implementa la interfaz
  const repositorioMock: BilleteraRepository = {
    actualizar: jest.fn().mockResolvedValue(undefined)
  };

  // Ahora pasamos el mock al constructor
  const casoDeUso = new RealizarTransferencia(repositorioMock);
  
  await casoDeUso.ejecutar(billetera, 50);

  // Verificamos
  expect(repositorioMock.actualizar).toHaveBeenCalledWith(billetera);
});

});