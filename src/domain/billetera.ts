// src/domain/Billetera.ts
export class Billetera {
  constructor(public saldo: number) {}

  public debitar(monto: number): void {
    if (monto > this.saldo) {
      throw new Error("Saldo insuficiente");
    }
    this.saldo -= monto;
  }
}