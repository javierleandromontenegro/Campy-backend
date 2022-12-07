# Campy-Backend

## Descripción de la estructura:

El Backend está estructurado en base a cuatro tecnologías: NodeJS, Express, Typescript y Sequelize.

El repositorio tiene como carpeta principal el `/src`, dentro se encuentra el archivo `index.ts` para levantar el servidor, posteriormente encontramos a `/app` donde se dispondrá de todo el comportamiento de nuestra API. Allí se hallan las demas carpetas: `models`, `routes`, `services` y `types`, junto a dos archivos esenciales: `app.ts` y `db.ts`.

-_/models:_ Acá estarán todos los modelos de sequelize(tablas) que la database requiera.

-_/routes:_ Todas los controladores de las rutas se crearán aquí, con sus respectivos métodos GET, POST, PUT, DELETE. Cabe aclarar que todas las rutas empezarán con `/api`, ya que esa se usa como principal middleware en el archivo `app.ts`.

-_/services:_ Aquí se hallarán los archivos que tengan que ver con la lógica de distintas peticiones en las rutas. Estas funciones serán utilizadas con el fin de separar controladores(rutas) y funcionabilidad(lógica).

-_/types:_ Se utilizará esta carpeta para guardar archivos con tipos de datos generales, sobre todo por el uso de `Typescript`, ya sea para guardar `types`, `enums`, `interfaces` y poder ser utilizados en toda la app.

-_app.ts_: Este archivo engloba toda la lógica de la aplicación, más que nada para colocar los middleware responsables ya sea para el manejo de rutas o el parseo de datos de la `request`.

-_db.ts_: Sirve para conectar la app con la database(mySql) y crear o vincular las tablas creadas en `models`.

## Producción/Desarrollo

El repositorio cuenta con un archivo package.json donde se especifican las dependencias y las dependencias de desarrollo. Una vez hecho `npm i` para leventar el server se necesita el comando `npm run dev`, el cual a su vez creará una carpeta `/build` con todo compilado a `JavaScript` puro. Esa carpeta es para lanzarlo a producción.
