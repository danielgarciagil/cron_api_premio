#Etapa 1
#Imagen de Node
FROM node:20-alpine as build

# Instala tzdata utilizando apk (el gestor de paquetes de Alpine)
RUN apk update && apk add tzdata
ENV TZ="America/Puerto_Rico"
#Crear la carperta
WORKDIR /app

#Anandir todo
ADD . .

#Comando Basicos
RUN npm install
RUN npm run build


#Etapa 2
FROM node:20-alpine

#Url de la api
ENV URL_API=""
ENV TZ="America/Puerto_Rico"

COPY --from=build /app /app

# Establece el directorio de trabajo
WORKDIR /app

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start:prod"]

# Exponer el puerto
EXPOSE $PORT