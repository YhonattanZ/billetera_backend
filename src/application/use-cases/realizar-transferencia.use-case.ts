import { Billetera } from "domain/billetera";
import { BilleteraRepository } from "domain/repositories/billetera.repository";

export class RealizarTransferencia {
  // El caso de uso orquesta la lógica
  constructor(private repositorio: BilleteraRepository) {}

  async ejecutar(billeteraOrigen: Billetera, monto: number): Promise<void> {
    billeteraOrigen.debitar(monto);
    
    // Ahora sí, llamamos al método del repositorio
    await this.repositorio.actualizar(billeteraOrigen);
  }
}