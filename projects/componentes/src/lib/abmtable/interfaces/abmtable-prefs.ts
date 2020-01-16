import { Accion } from '../../interfaces';
import { ColumnaTable } from './columna';

export interface ABMTablePrefs {
    /** Definición de columnas de tabla primaria */
    columnas?: ColumnaTable[];

    /** Array de acciones (tabla primaria) */
	acciones?: Accion[];

    /** Array desde el que se popula el DataSource */
    datos?: any[];

    /** Establece si mostrar el formulario o no */
	abm?: boolean;
	
	/** Establece si mostrar el prefijo $ cuando es un monto */
	mostrarPeso?: boolean;

    /** Función que hace focus al primer elemento del formulario */
    focusFirst?: Function;

    /**
     * Función que es llamada al insertar una row. Un retorno false indica que no debe ser añadida
     */
    onAdd?: Function;

    /**
     * Función que es llamada al eliminar una row. Un retorno false indica que no debe ser removida
     */
    onRemove?: Function;
}
