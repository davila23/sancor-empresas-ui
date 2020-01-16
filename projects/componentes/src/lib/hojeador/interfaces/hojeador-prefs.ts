import { Accion } from '@componentes/interfaces';
import { ColumnaHojeador } from './columna';

export interface HojeadorPrefs {

    /** Número de acciones para que se agrupen en un menú */
    accionesMinimo?: number;

    /** Nombre del atributo en el que se reciben los resultados de la respuesta */
    nombreDatos?: string;

    /** Nombre del atributo en el que se recibe la cantidad de resultados de la respuesta */
    nombreCuantas?: string;

    /** Definición de columnas de tabla primaria */
    columnas?: ColumnaHojeador[];

    /** Resultados por página */
    cuantos?: number;

    /** Si muestra checkbox y emite eventos */
    selecciona?: boolean;

    seleccionaSi?: (element: any) => boolean;

    /** Nombre del campo que referencia al id. Ej: "ctid" */
    nombreCampoId?: string;

    /** Nombre del campo que referencia al nombre. Ej: "ctnombre" */
    nombreCampoDenominacion?: string;

    /** Retorna el objeto completo en el selecciona */
    retornarObjetoCompleto?: boolean;

    /** "Elementos seleccionadas": 1 */
    nombreElementosSeleccionados?: string;

    /** Si hace efecto al hover y busca detalle */
    detalla?: boolean;

    /** Determina si rellena con filas vacías */
    rellena?: boolean;

    /** Si se incluye un buscador y agregar campo 'texto' a las requests */
    busca?: string;

    /** Array de acciones (tabla primaria) */
    acciones?: Accion[];

    /** Si se detalla, esta es la estructura de la subtabla */
    columnasSubtabla?: ColumnaHojeador[];

    /** Array de acciones de la subtabla */
    accionesSubtabla?: Accion[];

    /** Ruta query. Ej: admin/hojear/usuarios */
    url?: string;

    /** Si no es null (por defecto), muestra un toggle-slide */
    toggle?: {
        checked: (element: any) => boolean;
        onChange: (element) => any;
		enabled?: (element: any) => boolean;
		visible?: (element: any) => boolean;
    };

    /** Si está contenido en un sidenav, por scrolling */
	sidenav?: boolean;

    /** Si pagina al mover la rueda */
    scrollable?: boolean;

    /** Si se utiliza un disparador personalizado para expandir el detalle */
    customTrigger?: boolean;

    /** Si realiza las peticiones por POST, caso contrario, GET */
	post?: boolean;

	/** Muestra el prefijo simbolo $ si es de tipo monto */
	mostrarPeso?: boolean;
	
	/** Permite desactivar la ordenacion de la tabla */
    sortable?: boolean;
    
    /** Si usa matTooltip en lugar de title para acción */
    matTooltip?: boolean;

    /** Función que brinda el componente padre para modificar los datos al refrescar */
    modificarDatos?: (datos: any) => any;

	/** Formatea la respuesta que llega de la petición */
    formateaRespuesta?: (datos: any) => { todos: any[], cuantas: number };

    /** Función que brinda el componente padre para obtener los parámetros de la query */
    getDatos?: () => any;

    /** Función que brinda el componente padre para obtener los parámetros de la query */
	buscarDetalle?: (element: any) => Promise<any>;

}
