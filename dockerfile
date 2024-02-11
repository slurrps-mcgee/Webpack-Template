#Base Image for build phase
FROM node:alpine as build

#Set the working directory
WORKDIR /usr/src/app

#Copy package and package-lock
COPY package.json package-lock.json* /usr/src/app/

#Install dependencies
RUN npm install

#Add the source code to app
COPY . /usr/src/app

#Generate the build of the application
RUN npm run build:prod

#NGINX Web Server Phase
FROM nginx:alpine

#COPY nginx.conf /etc/nginx/nginx.conf

#Copy docs which is the directory for the app after build
COPY --from=build ./usr/src/app/docs /usr/share/nginx/html

#Expose web port
EXPOSE 80