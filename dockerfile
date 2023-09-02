#Imagen de Node
FROM node:20-alpine

# Instala tzdata utilizando apk (el gestor de paquetes de Alpine)
RUN apk update && apk add tzdata
ENV TZ="America/New_York"


#Crear la carperta
WORKDIR /app

#Anandir todo
ADD . .

#Comando Basicos
RUN npm install
RUN npm run build
CMD ["npm", "run", "start:prod"]
EXPOSE 4000