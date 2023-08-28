<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Modo desarrollo 
1. Ejecutar
```
yarn install
```
2. Instalar Nest CLI
```
npm i -g @nestjs/cli
```
3. Iniciar la base de datos
```
docker-compose up -d
```

4. Configurar las variables de entorno del archivo __.env.example__ y configurarlas en el archivo __.env__

5. Ejecutar la aplicación en modo de desarrollo 
```
yarn start:dev
```

5. Reconstruir la base de datos
```
http://localhost:3000/api/v2/seed
```

# Production Build

1. Configurar las variables de entorno de producción en el archivo __env.prod__

2. Construir la imagen
```
docker compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```