import { Request } from 'express'

type RequiredQueryParam = {
  key: string
  type: 'string' | 'number' | 'boolean'
  validator?: (value: unknown) => boolean
}

type Validator = (req: Request, requiredQueryParams: RequiredQueryParam[]) => Request['query']

/**
 * The function `validateQueryParams` is a TypeScript function that validates query parameters in a
 * request object and throws errors if any required parameters are missing, have incorrect types, or
 * fail a custom validator function.
 * @param req - The `req` parameter is an object that represents the HTTP request. It typically
 * contains information such as the request method, headers, body, and query parameters. In this case,
 * the `req` object is expected to have a `query` property, which represents the query parameters of
 * the request.
 * @param requiredParams - The `requiredParams` parameter is an array of objects. Each object
 * represents a required query parameter and has the following properties:
 * @returns The function `validateQueryParams` returns the `req.query` object.
 */
export const validateQueryParams: Validator = (req, requiredParams) => {
  const { query } = req

  for (const { key, type, validator } of requiredParams) {
    if (!query[key]) {
      throw new Error(`${key} is missing`)
    }

    if (typeof query[key] !== type) {
      throw new Error(`${key} is not a ${type}`)
    }

    if (validator) {
      if (!validator(query[key])) {
        throw new Error(`${key} is invalid`)
      }
    }
  }

  return req.query
}
