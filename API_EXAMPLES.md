# Ejemplos de Uso de la API

Guía rápida para probar los endpoints.

## Variables
- BASE_URL: `http://localhost:3000`
- TOKEN: tu token JWT
- USER_ID: ID del usuario
- MOVIE_ID: ID de película

## Autenticación

### Registro
**POST** `/api/users/register`
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Registro con imagen
**POST** `/api/users/register`
Form-data:
- username
- email
- password
- image (archivo)

### Login
**POST** `/api/users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Usuarios

### Ver todos (Admin)
**GET** `/api/users`
Header: `Authorization: Bearer TOKEN`

### Ver usuario
**GET** `/api/users/:id`
Header: `Authorization: Bearer TOKEN`

### Actualizar usuario
**PUT** `/api/users/:id`
Header: `Authorization: Bearer TOKEN`
```json
{
  "username": "nuevoNombre",
  "email": "nuevo@email.com"
}
```

### Cambiar rol (Admin)
**PATCH** `/api/users/:id/role`
Header: `Authorization: Bearer TOKEN`
```json
{
  "role": "admin"
}
```

### Eliminar usuario
**DELETE** `/api/users/:id`
Header: `Authorization: Bearer TOKEN`

## Favoritos

### Añadir favorito
**POST** `/api/users/:id/favorites`
Header: `Authorization: Bearer TOKEN`
```json
{
  "movieId": "ID_PELICULA"
}
```

### Quitar favorito
**DELETE** `/api/users/:id/favorites`
Header: `Authorization: Bearer TOKEN`
```json
{
  "movieId": "ID_PELICULA"
}
```

## Películas

### Ver todas
**GET** `/api/movies`

### Ver una
**GET** `/api/movies/:id`

### Por género
**GET** `/api/movies/genre/Drama`

Géneros: Acción, Comedia, Drama, Terror, Ciencia Ficción, Romance, Thriller, Animación, Documental, Aventura

### Crear (Admin)
**POST** `/api/movies`
Header: `Authorization: Bearer TOKEN`
```json
{
  "title": "Título",
  "director": "Director",
  "year": 2024,
  "genre": "Drama",
  "duration": 120,
  "rating": 8.5,
  "synopsis": "Descripción...",
  "poster": "url_imagen"
}
```

### Actualizar (Admin)
**PUT** `/api/movies/:id`
Header: `Authorization: Bearer TOKEN`
```json
{
  "rating": 9.0
}
```

### Eliminar (Admin)
**DELETE** `/api/movies/:id`
Header: `Authorization: Bearer TOKEN`

## Errores comunes

- Sin token: `No se proporcionó token de autenticación`
- Token inválido: `Token inválido o expirado`
- Sin permisos: `Acceso denegado`
- No encontrado: `Usuario/Película no encontrado`
- Duplicado: `El usuario o email ya existe`
- Login fallido: `Credenciales inválidas`

## Notas

- Token expira en 7 días
- Imágenes: jpg, jpeg, png, gif, webp (max 500x500px)
- Rutas públicas: GET de películas
- Rutas admin: crear/editar/eliminar películas, ver todos los usuarios, cambiar roles