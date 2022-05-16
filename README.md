# GeoHelper Front

> Vue.js application having [GeoHelper-Back](https://github.com/IvLaptev/GeoHelper-Back) as a backend

## Configuration
You need to create files `dev.env.js`, `prod.env.js` and `test.env.js` in `~/config`. Inside that files you should define variables of environment. Variables `NODE_ENV`, `VUE_APP_API` and `VUE_APP_KEY` must be defined.

Example:
``` js
'use strict'
module.exports = {
  NODE_ENV: '"production"' ,
  VUE_APP_API: '"https://geo-helper.ga/api/v1"',  //  Backend API base url
  VUE_APP_KEY: '"XXXXXXXXXXXX-X-XXXXXXXXXXXXXXX-XXXXXXXX"',  //  Google Cloud Platform Maps API Key
  VUE_APP_WS_PROTOCOL: '"ws"' | '"wss"' // websocket protocol
}
```

After setting up environment, run `npm install` to install all dependences.

## Building

Choose one of these commands:

``` bash
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Docker run
1. Build [locally](#building)
1. Build image
    ```bash
    docker build -t geohelper-front -f deploy/Dockerfile .
    ```
    or
    ```bash
    docker compose -f docker-compose.override.yml build
    ```
1. Run image
    ```bash
    docker run -d -p 3002:3002 geohelper-front
    ```
    or
    ```bash
    docker compose -f docker-compose.override.yml up -d
    ```
