# Lunari Socket Server

Servidor de Socket.io para el chat en tiempo real de Lunari.

## Instalación

```bash
npm install
```

## Uso Local

```bash
npm start
```

El servidor se ejecutará en el puerto 3001 por defecto.

## Deploy en Railway

1. Conecta tu cuenta de GitHub con Railway
2. Crea un nuevo proyecto desde este repositorio
3. Configura las variables de entorno:
   - `ALLOWED_ORIGINS`: URLs permitidas separadas por comas
   - `PORT`: Puerto del servidor (opcional, por defecto 3001)
4. Railway hará el deploy automáticamente

## Variables de Entorno

```env
NEXT_PUBLIC_SOCKET_URL=https://tu-servidor.railway.app
```

## Funcionalidades

- Chat en tiempo real
- Salas de chat
- Manejo de conexiones
- CORS configurado
- Endpoint de health check

## Estructura del Proyecto

```
├── socket-server.js
├── package.json
└── README.md
```
