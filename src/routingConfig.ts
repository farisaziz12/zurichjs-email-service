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
    path: '/api/v1/email',
    routes: [
      {
        path: '/send',
        method: 'post',
        handler: 'email',
      },
      {
        path: '/status/:idempotencyKey',
        method: 'get',
        handler: 'email',
      },
    ],
  },
  {
    path: '/api/v1/health',
    routes: [
      {
        path: '/',
        method: 'get',
        handler: 'email',
      },
    ],
  },
]
