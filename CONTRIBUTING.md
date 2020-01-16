1. [ Estructura. ](#estructura)
2. [ Routing. ](#routing)
3. [ Loops (*ngFor). ](#ngFor)
4. [ Servicios. ](#services)
5. [ Entidades e Interfaces. ](#entidades)
6. [ Personalizar comp. Material. ](#custom)
7. [ Estilos. ](#styles)
8. [ Formularios. ](#forms)
9. [ Buenas prácticas. ](#buenaspracticas)
10. [ TSLint. ](#tslint)
11. [ TSConfig. ](#tsconfig)
12. [ Mocking. ](#mocking)


<a name="estructura"></a>
# Estructura del proyecto

El proyecto está dividido, por convención, en tres partes (modules) importantes:

+ **Core**:  
Dentro de la carpeta *app/core*, contiene los servicios u otros elementos que deben estar instanciados sólo una vez dentro de la aplicación (patrón Singleton). Deberá ser importado sólo una vez por *app.module*.

+ **Shared**:  
Dentro de la carpeta *app/shared*, contiene módulos y/o componentes compartidos en toda la aplicación. Dentro de SharedModule se importarán (y exportarán) **todos los componentes de Material que estén presentes en más de un módulo**, ya que cada módulo hijo importará SharedModule y cargará todo lo que este tenga exportado.

+ **Features**:  
Estos son los módulos que forman la aplicación, cada uno de los módulos deberá importar SharedModule para incluir los componentes base. Además tendrá importado aquellos módulos que sean específicos, sean charts, módulos de Material específicos (como Tree, poco utilizados) o módulos como GoogleMaps, etc.

<a name="routing"></a>
# Routing

Lazy loading, modules para cada sección con su propio routing module

+ ng g module * --routing
+ ng g c *
+ En el nuevo routing.module agregar:
~~~~
	{
		path: '',
		component: *Component
	}
~~~~
+ Y en el routing.module padre agregar:  
~~~~
	{
		path: '*',
		loadChildren: 'app/layout/dashboard/*/*.module#*Module'
	}
~~~~

<a name="ngFor"></a>
# Loops (*ngFor)

Al utilizar la directiva `*ngFor`, hacerlo prudentemente en listas largas, en las cuales se puede implementar [trackBy](https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5) para que sepa identificar los objetos de la lista o [VirtualScrolling](https://material.angular.io/cdk/scrolling/overview#virtual-scrolling) (sólo cuando el listado no requiera cambios, ya que reconstruir el VirtualScrolling ante cambios es incluso peor que no usarlo)

<a name="services"></a>
# Services (http)

Dependiendo la complejidad del back-end, casi siempre se organizarán en una carpeta "services" en la ruta *app/services*, separados por funcionalidad.

<a name="entidades"></a>
# Entidades e interfaces

Realizar interfaces o clases, dependiendo la necesidad, dentro de sus respectivas carpetas dentro de *app*, *interfaces* y *clases*/*entidades*.

<a name="custom"></a>
# Personalizar componentes Material

Existen dos alternativas para esto:

1) `:host /deep/ .clase` (deprecada pero aun útil)

2) Crear un componente (button si es MatButton el que se quiere personalizar), incluir dentro de *@component()*:

`encapsulation: ViewEncapsulation.None` ([info](https://codecraft.tv/courses/angular/components/templates-styles-view-encapsulation/#_viewencapsulation_none))

<a name="styles"></a>
# Styles

Para los estilos se convendrá la utilización de [CSS Grid Layout](https://css-tricks.com/snippets/css/complete-guide-grid/).

Se utilizará SCSS en todo el proyecto para facilitar el uso de variables. Para esto existirán 3 archivos obligatoriamente:

+ **variables.scss**  
Importará *'~@angular/material/theming'* y definirá el theme de la app y variables como $primary-color, $accent-color, etc.

+ **theme.scss**  
Importará *'variables.scss'* y mat-core() y será donde se asigne el theme.

+ **global.scss** (antes styles.css)  
Importará *'theme'* y el grid a elección, en caso de que no sea FlexLayout

<a name="forms"></a>
# Forms

Existen dos formas de implementar formularios y la decisión de cuál utilizar está dada por:

**Template Driven**: cuando el formulario es relativamente chico y no requiere validaciones complejas.

**Reactive Forms**: cuando el mismo es de mayor tamaño, sus validaciones requieren el uso de expresiones regulares y se necesita un mayor control del cambio de sus valores.

<a name="buenaspracticas"></a>
# Buenas prácticas

Intentar, en lo posible, atenerse a convenciones o buenas prácticas

### index.ts
Escribir los archivos *index.ts* en **cada** carpeta del proyecto donde se considere que pueda ser importado desde otro lugar.

+ [Artículo recomendado #1](https://medium.freecodecamp.org/best-practices-for-a-clean-and-performant-angular-application-288e7b39eb6f)
+ [Artículo recomendado #2](https://blog.usejournal.com/best-practices-for-writing-angular-6-apps-e6d3c0f6c7c1)

<a name="tslint"></a>
# TSLint

Utilizar plugin **TSLint** para que el código tenga el mismo aspecto en toda la aplicación. Las reglas recomendadas son las del siguiente archivo: [LINK](https://pastebin.com/2tfUvK3J)

<a name="tsconfig"></a>
# TSConfig

Usar paths en tiempo de compilación para acortar importes. Como mínimo deberían existir:
~~~~
"baseUrl": "./",
    "paths": {
      "@app/*": [
        "src/app/*"
      ],
      "@env": [
        "src/environments/environment.ts"
      ]
~~~~
[Más info](https://blog.usejournal.com/best-practices-for-writing-angular-6-apps-e6d3c0f6c7c1#a851)

<a name="mocking"></a>
# Mocking

Para simular llamadas al backend en desarrollo, utilizar archivos JSON dentro de una carpeta *"mock-data"* en *"assets"* o utilizar el servicio de [Mocky](https://www.mocky.io).