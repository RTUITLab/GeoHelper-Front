FROM nginx:alpine

EXPOSE 3002

RUN mkdir /app

COPY /dist /app

COPY nginx.conf /etc/nginx/nginx.conf
