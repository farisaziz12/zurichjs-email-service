import { Request, RequestHandler, NextFunction, Response } from 'express'
import * as mcache from 'memory-cache'

/**
 * Creates a middleware function for caching responses in memory.
 *
 * @param {number} duration - The number of seconds to keep the cache.
 * @returns {express.RequestHandler} An Express request handler with caching logic.
 */
const cache = (duration: number): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Define the key for the cache based on the request URL
    const key = '__express__' + (req.originalUrl || req.url)
    // Attempt to retrieve the cached response
    const cachedBody = mcache.get<string>(key)
    if (cachedBody) {
      // If cached, send the cached response
      res.json(cachedBody)
    } else {
      // Override the res.json function to cache the response
      const jsonResponse = res.json
      res.json = (body: any): Response => {
        // Cache the response body and convert duration to milliseconds
        mcache.put(key, body, duration * 1000)
        // Send the response to the client
        return jsonResponse.call(res, body)
      }
      // Call the next middleware function
      next()
    }
  }
}

export default cache
