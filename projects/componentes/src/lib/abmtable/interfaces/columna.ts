import { Accion } from '../../interfaces';

export interface ColumnaTable {
	def: string;
	nombre: string;
	ancho?: number;
	tipo: 'numero' | 'texto' | 'fecha' | 'monto' | 'comprobante';
	clase?: string;
	accion?: Accion[];
}
