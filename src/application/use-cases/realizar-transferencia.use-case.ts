import { Billetera } from "domain/billetera";

export class RealizarTransferencia {
  // El caso de uso orquesta la lógica
  async ejecutar(billeteraOrigen: Billetera, monto: number): Promise<void> {
    // Aquí es donde aplicamos la regla de negocio que definimos en la clase Billetera
    billeteraOrigen.debitar(monto);
    
    // Aquí luego vendrá la lógica de persistencia
    // await this.billeteraRepository.save(billeteraOrigen);
  }
}