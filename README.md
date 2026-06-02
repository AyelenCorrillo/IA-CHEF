# IA-CHEF

Proyecto Spring Boot que sugiere recetas generadas por IA a partir de los ingredientes que el usuario tiene disponible.

## Resumen

IA-CHEF es una aplicación web de cocina que permite seleccionar ingredientes desde una tabla, generar recetas con inteligencia artificial mediante la API de Groq y guardar recetas elegidas en una base de datos PostgreSQL.

## Tecnologías principales

- Java 21
- Spring Boot 4
- Spring Data JPA
- Thymeleaf
- PostgreSQL
- Docker / Docker Compose
- JavaScript vanila para interactividad en el front-end
- Tailwind CSS cargado desde CDN

## Estructura del proyecto

- `src/main/java/com/chefia/app`
  - `ChefiaAppApplication.java`: punto de entrada de Spring Boot.
  - `controller/RecetaController.java`: control de rutas HTTP y lógica de vistas.
  - `service/RecetaService.java`: comunicación con la API de Groq y persistencia de recetas.
  - `service/IngredientService.java`: consulta de ingredientes desde la base de datos.
  - `repository/IngredientRepository.java`: repositorio JPA para ingredientes.
  - `repository/RecetaRepository.java`: repositorio JPA para recetas.
  - `model/`: entidades JPA (`Receta`, `Ingredient`, `Category`).
  - `dto/RecetaDTO.java`: DTO usado para mapear la respuesta JSON de la IA.

- `src/main/resources/templates/`
  - `index.html`: página principal del usuario.
  - `historial.html`: plantilla vacía actualmente disponible en el proyecto.
  - `recetas-sugeridas.html`: plantilla vacía actualmente disponible en el proyecto.

- `src/main/resources/static/js/filters.js`: lógica de selección, drag & drop, búsqueda y llamada AJAX para generar recetas.
- `src/main/resources/static/css/style.css`: estilos de la aplicación.
- `ingredientes.sql`: script de inicialización de PostgreSQL con categorías e ingredientes.
- `docker-compose.yml`: orquestación de contenedores para PostgreSQL y la aplicación.
- `Dockerfile`: build independiente de la aplicación para producción.
- `Dockerfile.dev`: contenedor de desarrollo con `mvn spring-boot:run`.

## Flujo de ejecución

1. El usuario carga `/` y el backend devuelve `index.html` con el listado de ingredientes.
2. El usuario arrastra o selecciona ingredientes en la tabla.
3. Al presionar "Generar 3 recetas" se hace un POST a `/generar-recetas` con el listado de ingredientes.
4. `RecetaService` arma un prompt y llama a la API de Groq.
5. La respuesta JSON de la IA se parsea a `List<RecetaDTO>` y se devuelve al front-end.
6. El front-end renderiza las 3 recetas en la misma página.
7. Si el usuario guarda una receta, se envía un POST a `/guardar-receta`.
8. `RecetaService.guardarEnBaseDeDatos()` convierte el DTO en una entidad `Receta` y la guarda en PostgreSQL.
9. Al visitar `/mis-recetas` el controlador carga todas las recetas guardadas.

## Componentes clave

### `RecetaController`

Rutas principales:
- `GET /`: muestra la pantalla inicial con ingredientes.
- `POST /generar-recetas`: recibe un JSON con `ingredientes` y devuelve recetas generadas.
- `POST /guardar-receta`: guarda la receta elegida en la base de datos.
- `GET /mis-recetas`: muestra las recetas guardadas.

### `RecetaService`

- Usa `RestClient` para llamar a la API de Groq.
- Construye el prompt solicitando un JSON limpio y exacto.
- Extrae `choices[0].message.content` de la respuesta y lo parsea con Jackson a `List<RecetaDTO>`.
- Convierte `RecetaDTO` en entidad `Receta` para persistirla.

### `IngredientService`

- Provee ingredientes desde la base de datos.
- Incluye filtro por categoría con `findByCategory_Name(String name)`.

### Entidades JPA

- `Receta`
  - `id`, `nombre`, `ingredientes`, `instrucciones`, `imagenUrl`, `fechaCreacion`
  - `fechaCreacion` se asigna automáticamente con `@PrePersist`

- `Ingredient`
  - `id`, `name`, `image`, `category`
  - relación `@ManyToOne` con `Category`

- `Category`
  - `id`, `name`
  - relación `@OneToMany` con `Ingredient`

## Configuración de la base de datos

- `application.properties` define la conexión a PostgreSQL:
  - URL: `jdbc:postgresql://db:5432/chefia_db`
  - Usuario: `chefia_user`
  - Contraseña: `chefia_password`
- `spring.jpa.hibernate.ddl-auto=update` permite crear/actualizar tablas automáticamente.
- `ingredientes.sql` se usa para inicializar las tablas `categorias` e `ingredientes`.

## API de IA

- El proyecto está configurado para usar Groq:
  - `GROQ_API_KEY` debe estar disponible en el entorno.
  - `RecetaService` usa `llama-3.1-8b-instant` como modelo.
- El prompt actual exige que la respuesta sea JSON válido sin texto adicional.

## Ejecución local

### Con Maven

```bash
./mvnw spring-boot:run
```

La aplicación arranca en `http://localhost:8080`.

### Con Docker Compose

```bash
# Desde la carpeta raíz:
# Crear el archivo .env con la clave de Groq
echo GROQ_API_KEY=tu_api_key_aqui > .env

# Levantar la app y la base de datos
docker compose up --build
```

Esto levanta:
- `db`: PostgreSQL con datos iniciales.
- `chefia-backend`: Spring Boot conectado a la base de datos.

```bash
# Detener y remover los contenedores
docker compose down
```

## Variables de entorno necesarias

- `GROQ_API_KEY`: clave para la API de Groq.

Opcionalmente, el contenedor puede recibir variables Spring de conexión si se desea sobrescribir la configuración.

## Notas importantes

- `package.json` existe pero actualmente está vacío (`{}`), por lo que no hay dependencias de Node ni build frontend en el proyecto.
- `src/main/resources/templates/historial.html` y `recetas-sugeridas.html` existen, pero la ruta `/mis-recetas` en el controlador intenta cargar una vista llamada `mis-recetas`, que actualmente no se encuentra en el proyecto. Esto puede requerir una corrección o un renombrado de plantilla.
- La propiedad `groq.api.url` en `application.properties` no es usada actualmente por `RecetaService`, que tiene la URL codificada en el servicio.

## Estructura de archivos relevante

- `Dockerfile`: build de producción.
- `Dockerfile.dev`: contenedor de desarrollo con volumen montado.
- `docker-compose.yml`: orquesta app + PostgreSQL.
- `src/main/resources/static/js/filters.js`: lógica de arrastrar ingredientes, búsqueda y renderizado de recetas.
- `src/main/resources/static/css/style.css`: estilos globales.
- `ingredientes.sql`: script de creación y datos iniciales para PostgreSQL.

## Posibles mejoras

- Agregar la plantilla correcta para `/mis-recetas`.
- Validar el JSON devuelto por Groq antes de parsearlo.
- Extraer la URL de Groq a `application.properties` y usarla desde `RecetaService`.
- Agregar tests de integración para el flujo de recetas.
- Integrar registro y login con Google, hotmail/outlook.