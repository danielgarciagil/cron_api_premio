#Imagen de Node
FROM node:20

RUN apt update && apt install tzdata -y
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