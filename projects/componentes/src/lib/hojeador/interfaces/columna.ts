import { Accion } from '@componentes/interfaces';

export interface ColumnaHojeador {
	def: string;
	nombre: string;
	ancho?: number;
	tipo: 'numero' | 'texto' | 'fecha' | 'monto' | 'comprobante' | 'imagen' | 'boton' | 'html';
	modifica?: boolean;
	clase?: string;
	modificaDatos?: {
		remoto: boolean,
		datosBS?: () => any,
		que?: string;
		datos?: (todos: any[]) => any;

		/**
		 * Procesa el dato antes de enviar al InputBS
		 * (procesa: (el, col)) procesa(element, columna)
		 */
		procesa?: (el, col) => any;

		/**
		 * Actualiza el dato en la BD
		 * (actualiza: (el, col, res) actualiza(element[def], res)
		 */
		actualiza?: (el, col, res) => any;
	};
	accion?: Accion[];
}
