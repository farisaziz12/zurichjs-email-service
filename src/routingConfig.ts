// Define a TypeScript type named RoutingConfig to describe the structure of routing configuration.
type RoutingConfig = {
  path: `/${string}`
  routes: {
    path: `/${string}`
    method: 'get' | 'post' | 'put' | 'delete'
    handler: string // A string representing the name of the handler file in `/src/handlers`
    cacheTime?: number // An optional number representing caching duration in seconds
  }[]
}

export const routingConfig: RoutingConfig[] = [
  {
    path: '/test', // Specifies the base path for this configuration
    routes: [
      {
        path: '/test', // Specifies a specific route path under the base path
        method: 'get', // Specifies that this route responds to HTTP GET requests
        handler: 'test', // Specifies the name of the handler module/function for this route
        cacheTime: 60 * 5, // Specifies a caching duration of 5 minutes (300 seconds) for this route
      },
    ],
  },
]
