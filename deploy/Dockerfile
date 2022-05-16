FROM nginx:alpine

EXPOSE 3002

RUN mkdir /app

COPY /dist /app

COPY proxy.conf /etc/nginx/conf.d/proxy.conf
