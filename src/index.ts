import express from 'express'
import cors from 'cors'

import { routingConfig } from './routingConfig'
import cache from './cache'
import { logger } from './utils/logger'

export default ((): void => {
  const app = express()

  // Enable Cross-Origin Resource Sharing (CORS) middleware
  app.use(cors())

  // Parse incoming JSON requests
  app.use(express.json())

  // Parse incoming URL-encoded requests with extended mode
  app.use(express.urlencoded({ extended: true }))

  // Iterate through the routing configuration
  routingConfig.forEach(config => {
    const router = express.Router()

    // Iterate through the routes within the configuration
    config.routes.forEach(async (route): Promise<void> => {
      try {
        // Dynamically import the handler module for the current route
        const handlerModule = await import(`./handlers/${route.handler}.js`)

        // Get the appropriate handler function based on the route
        let handlerFunction
        if (route.handler === 'email') {
          if (route.path === '/send') {
            handlerFunction = handlerModule.sendEmail
          } else if (route.path.includes('/status')) {
            handlerFunction = handlerModule.getEmailStatus
          } else if (route.path === '/') {
            handlerFunction = handlerModule.healthCheck
          }
        } else {
          handlerFunction = handlerModule.default ?? handlerModule
        }

        // Check if the route specifies caching
        if (route.cacheTime) {
          // Use the cache middleware with the specified cache time
          router[route.method](route.path, cache(route.cacheTime), handlerFunction)
        } else {
          // Use the handler without caching
          router[route.method](route.path, handlerFunction)
        }
      } catch (error) {
        // Log any errors that occur during route setup
        const routeError = error instanceof Error ? error : new Error('Unknown route setup error')
        logger.error(
          'Route setup failed',
          {
            path: config.path,
            route: route.path,
            method: route.method,
            handler: route.handler,
          },
          routeError,
        )
      }
    })

    // Mount the router with its configured routes under the specified path
    app.use(config.path, router)
  })

  // Determine the port to listen on, defaulting to 3000 if not specified
  const port = process.env.PORT ?? 3000

  // Start the server and listen on the determined port
  app.listen(port, () => {
    logger.serviceStarted(port)
  })
})()
