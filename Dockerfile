FROM node:11.15.0
WORKDIR /usr/app
COPY package*.json ./

RUN npm install node-gyp -g
# RUN apt install node-gyp
RUN npm install 

COPY . .
RUN npm run build:real
EXPOSE 8000
# CMD ["npm","run" ,"real"]
