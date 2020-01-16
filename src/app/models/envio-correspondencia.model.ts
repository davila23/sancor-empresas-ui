import { FormaDePagoASDTO } from './forma-pago.model';
import { TipoEntregaCorrespondenciaDTO } from './tipo-entrega.model';

export class EnvioCorrespondenciaDTO{
    empresaId: number;
    convenioId: number;
    destino: string ;
    formaPago: FormaDePagoASDTO;
    tipoEnvio: TipoEntregaCorrespondenciaDTO ;
}