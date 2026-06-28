import { Billetera } from "domain/billetera";


export interface BilleteraRepository {
  actualizar(billetera: Billetera): Promise<void>;
}