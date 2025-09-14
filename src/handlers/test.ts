import type { RequestHandler } from 'express'
import { validateQueryParams } from '../helpers'

const handler: RequestHandler = async (req, res) => {
  try {
    const { queryParam } = validateQueryParams(req, [{ key: 'queryParam', type: 'string' }])

    res.status(200).json({
      queryParam,
    })
  } catch (error: unknown) {
    console.error(error)
    res.status(500).json({ error: (error as Error).message })
  }
}

export default handler
