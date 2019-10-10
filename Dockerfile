FROM node:11.15.0
WORKDIR /usr/app
COPY package*.json ./

RUN npm install -g node-gyp babel-cli truffle@4.1.14
RUN npm install 

COPY . .
RUN npm install prisma@1.30.5 -g
# RUN npm run build:real
# RUN babel server --out-dir build
# EXPOSE 8000 8080
EXPOSE 8080
# CMD ["npm","run" ,"real"]
