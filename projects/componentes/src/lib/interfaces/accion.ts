/**
 *  Para definir el ancho de la columna de acciones, crear una columna con el nombre Acciones
 */
export interface Accion {
	color?: (element: any) => any;
	condicion?: (element: any) => any;
	icon: (element: any) => any;
	handler?: (element: any) => any;
	title?: (element: any) => any;
}
