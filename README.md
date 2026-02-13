# API Gestión de Usuarios y Películas

Backend con Node.js, Express y MongoDB para gestión de usuarios con roles y películas favoritas.

## Características

- Autenticación con JWT
- Roles (user/admin)
- Subida de imágenes a Cloudinary
- CRUD de usuarios y películas
- Sistema de favoritos sin duplicados
- Passwords encriptadas

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT
- Cloudinary + Multer
- Bcrypt

## Instalación
```bash
npm install
```

Configurar `.env`:
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=tu_secreto
CLOUDINARY_CLOUD_NAME=nombre
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret
PORT=3000
```

Ejecutar:
```bash
npm run seed  # cargar películas
npm run dev   # servidor desarrollo
npm start     # servidor producción
```

## Configuración

### MongoDB Atlas
1. Crear cuenta y cluster
2. Crear usuario de base de datos
3. Permitir IP 0.0.0.0/0
4. Copiar URI al .env

### Cloudinary
1. Crear cuenta
2. Copiar credenciales del dashboard
3. Añadir al .env

### Primer Admin
1. Registrar usuario normal
2. MongoDB Atlas → Collections → users
3. Editar documento: `role: "user"` → `role: "admin"`

## Modelos

**User:**
```javascript
{
  username: String (único),
  email: String (único),
  password: String (hasheada),
  role: String (user/admin),
  image: String (URL Cloudinary),
  favoriteMovies: [ObjectId]
}
```

**Movie:**
```javascript
{
  title: String,
  director: String,
  year: Number,
  genre: String,
  duration: Number,
  rating: Number (0-10),
  synopsis: String,
  poster: String
}
```

## Endpoints

### Autenticación
- `POST /api/users/register` - Registro (form-data con image opcional)
- `POST /api/users/login` - Login

### Usuarios
- `GET /api/users` - Ver todos (admin)
- `GET /api/users/:id` - Ver uno
- `PUT /api/users/:id` - Actualizar
- `DELETE /api/users/:id` - Eliminar
- `PATCH /api/users/:id/role` - Cambiar rol (admin)

### Favoritos
- `POST /api/users/:id/favorites` - Añadir película
- `DELETE /api/users/:id/favorites` - Quitar película

### Películas
- `GET /api/movies` - Todas
- `GET /api/movies/:id` - Una
- `GET /api/movies/genre/:genre` - Por género
- `POST /api/movies` - Crear (admin)
- `PUT /api/movies/:id` - Actualizar (admin)
- `DELETE /api/movies/:id` - Eliminar (admin)

**Géneros:** Acción, Comedia, Drama, Terror, Ciencia Ficción, Romance, Thriller, Animación, Documental, Aventura

## Autenticación

Rutas protegidas requieren:
```
Authorization: Bearer TOKEN
```

Token expira en 1 día.

## Roles y Permisos

**User:**
- Ver perfiles
- Editar su perfil
- Eliminar su cuenta
- Gestionar sus favoritos

**Admin:**
- Todo lo anterior +
- Ver todos los usuarios
- Cambiar roles
- Eliminar cualquier cuenta
- CRUD películas

**Reglas:**
- Usuarios se crean como "user"
- Primer admin manual en MongoDB
- Usuario no puede cambiar su rol
- Usuario solo elimina su cuenta
- Admin elimina cualquier cuenta

## Estructura
```
backend-project/
├── index.js
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── userController.js
│   │   │   └── movieController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Movie.js
│   │   └── routes/
│   │       ├── userRoutes.js
│   │       └── movieRoutes.js
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── file.js
│   └── utils/
│       ├── deleteFile.js
│       ├── seed.js
│       └── token.js
├── .env
└── package.json
```

## Scripts
```bash
npm start      # producción
npm run dev    # desarrollo
npm run seed   # insertar películas
```

## ESTADOS HTTP

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Seguridad

- Passwords hasheadas con bcrypt
- JWT firmado
- Validación con Mongoose
- Middlewares de autenticación
- Imágenes redimensionadas a 500x500px

## Funcionalidades Especiales

**Favoritos:**
- Evita duplicados con validación
- Usa `push()` para no pisar datos
- Usa `filter()` para eliminar

**Imágenes:**
- Se suben a carpeta "Users" en Cloudinary
- Se redimensionan automáticamente
- Se eliminan al borrar usuario

## Semilla

10 películas incluidas: El Padrino, El Caballero Oscuro, Pulp Fiction, Interestelar, Forrest Gump, Gladiator, Parásitos, La La Land, Matrix, Toy Story.
