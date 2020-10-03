import { ALL } from './roles';

export const SideNavRoutes = [
  {
    title: 'empresas',
    children: [
      { url: '/empresa/busqueda', title: 'Busqueda', icon: 'search' },
      { url: '/empresa/nueva', title: 'Nueva', icon: 'create' }
    ],
    rol: []
  },
  {
    title: 'Convenios temporales',
    children: [
      { url: '/conveniostemporales', title: 'Listado', icon: 'list' }
    ],
    rol: []
  },
  {
    title: 'Convenios en control',
    children: [
      { url: '/convenioscontrol', title: 'Listado', icon: 'list' }
    ],
    rol: ALL
  },
  {
    title: 'Convenios definitivos',
    children: [
      { url: '/conveniosdefinitivos', title: 'Listado', icon: 'list' }
    ],
    rol: []
  },
  {
    title: 'Reportes',
    children: [
      { url: '/reportes/convenios', title: 'Convenios', icon: 'article' }
    ],
    rol: ALL
  }
];