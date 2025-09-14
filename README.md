# Typescript Microservice Template

## Features

* uses [esbuild](https://esbuild.github.io) and [`tsup`](https://tsup.egoist.sh) in dev mode for blazing fast builds and restarts
* VS Code debugger configs in .vscode folder
* recommended Dockerfile for secure Node.js production-ready images
* most strict and backend specific [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) configuration
* configured tests and reporters via [tap](https://node-tap.org)
* [dotenv](https://github.com/motdotla/dotenv#readme) for development env vars

## Getting Started

### Start the development server

```
$ npm run dev
```

## Included npm scripts
The commands must be run from the project's root folder.

### `dev`
It runs the project in development mode. It uses [`tsup`](https://tsup.egoist.sh) to watch the `./src/**/*.ts` files, build and restart the server on save. It exposes the debugger on the default port (`9229`), ready to be used by the provided VS Code `attach` configuration. This script runs parallelly [esbuild](https://esbuild.github.io) and `tsc --noEmit` to build your code faster.
```
$ npm run dev
```

### `build`
It builds for production all files from the `./src` to the `./build` folder. It uses `tsc` directly and therefore checks types too. It also emits the source maps.
```
$ npm run build
```

### `start`
It runs previously built code from the `./build` folder. In addition, it uses `--enable-source-maps` flag for native source-maps support. Note: this flag is present in Node.js since version `12.12.x`.
```
$ npm run start
```
This script is included only for convenience to test the production build locally on your dev machine. If needed, `-r dotenv/config` can be add to load the dev env. It is advised to run Node.js binary directly to avoid any overhead or `sigterm` propagation issues in production.
```
$ node --enable-source-maps build/index.js
```

### `lint`
It uses [`eslint`](https://eslint.org) and [`prettier`](https://prettier.io) to lint the code. It checks `./src` and `./test` folders. Note: `prettier` is run as `eslint` plugin via [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier).
```
$ npm run lint
```
If you want to fix all of the fixable problems, run
```
$ npm run lint -- --fix
```

### `update`
It uses [npm-check](https://www.npmjs.com/package/npm-check) to help you upgrading your dependencies and never have any outdated and broken packages again.
```
$ npm run update
```

### `test`
It uses [`tap`](https://node-tap.org) to run tests. Since version 15 `tap` needs `ts-node` to run TS files, `Stampo` also includes it.
```
$ npm run test
```

### `test:watch`
It runs `tap` in [watch mode](https://node-tap.org/docs/watch/) with interactive repl.
```
$ npm run test:watch
```

### `test:report`
It runs tests and reports the results in the widely used `junit` format using [`tap-mocha-reporter`](https://www.npmjs.com/package/tap-mocha-reporter). The default `xunit` reporter can be changed to anyone from the [supported reporters list](https://node-tap.org/docs/reporting/). This command is mainly intended to be used in CI/CD environments. The generated `junit-testresults.xml` can be consumed by automatic reporting systems.

## Env Vars
`Stampo` includes [dotenv](https://github.com/motdotla/dotenv#readme). You have to rename `.env.example` to `.env` and put your variables inside it. They will be automatically loaded when running `$ npm run dev` script.

## External typings augmentation
`Stampo` is configured to allow you to extend typings of external packages using `./typings` folder. The logic behind it is based on [this](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html) official template. To augment a module, create a folder with the same module name you are augmenting and add an `index.d.ts` file inside it. [Here](https://github.com/fox1t/fastify-websocket-router/tree/master/typings/fastify) you can find a real-world example.

## Debugging Steps

* run the `dev` script to start your application (`$ npm run dev`)
* either
  * use the VS Code included `attach` config for the best debugging experience
  <img width="327" alt="image" src="https://user-images.githubusercontent.com/1620916/129894966-15385c33-da0c-4e00-9f6f-a8ddf966e63e.png">

  * use the provided debug URL in Chrome

## Docker Support

`Stampo` provides a `Dockerfile` that follows the best practices regarding Node.js containerized applications.
* the application is run using a dedicated non-root user
* the Dockerfile uses a dedicated build step


### Build your docker image
```
docker build -t my-project-name .
```

### Run your docker container

```
docker run -p PORT:PORT my-project-name
```
