import { Request, Response } from 'express'
import { ResendService } from '../services/resend'
import { EmailRequest } from '../types/email'
import { logger } from '../utils/logger'

const resendService = new ResendService()

export const sendEmail = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const emailRequest = validateEmailRequest(req.body)

    if (!emailRequest.success) {
      logger.validationFailed([emailRequest.error], req.body)
      return res.status(400).json({
        success: false,
        error: emailRequest.error,
      })
    }

    // Send email
    const result = await resendService.sendEmail(emailRequest.data)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        idempotencyKey: result.idempotencyKey,
      })
    }

    return res.status(200).json({
      success: true,
      messageId: result.messageId,
      idempotencyKey: result.idempotencyKey,
    })
  } catch (error) {
    const handlerError = error instanceof Error ? error : new Error('Unknown handler error')
    logger.error('Email handler error', { endpoint: '/send' }, handlerError)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}

export const getEmailStatus = async (req: Request, res: Response) => {
  try {
    const { idempotencyKey } = req.params

    if (!idempotencyKey) {
      return res.status(400).json({
        success: false,
        error: 'Idempotency key is required',
      })
    }

    const wasSent = resendService.wasEmailSent(idempotencyKey)
    const messageId = resendService.getMessageId(idempotencyKey)

    return res.status(200).json({
      success: true,
      sent: wasSent,
      messageId: messageId || null,
      idempotencyKey,
    })
  } catch (error) {
    const handlerError = error instanceof Error ? error : new Error('Unknown handler error')
    logger.error('Email status handler error', { endpoint: '/status' }, handlerError)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}

export const healthCheck = async (req: Request, res: Response) => {
  try {
    logger.healthCheck()
    return res.status(200).json({
      success: true,
      message: 'Email service is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  } catch (error) {
    const handlerError = error instanceof Error ? error : new Error('Unknown handler error')
    logger.error('Health check error', { endpoint: '/health' }, handlerError)
    return res.status(500).json({
      success: false,
      error: 'Service unavailable',
    })
  }
}

// Validation helper function
function validateEmailRequest(
  body: unknown,
): { success: true; data: EmailRequest } | { success: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Request body is required' }
  }

  const bodyObj = body as Record<string, unknown>
  const { template, to, data, idempotencyKey } = bodyObj

  // Check required fields
  if (!template || typeof template !== 'string') {
    return { success: false, error: 'Template is required' }
  }

  if (!to || typeof to !== 'string') {
    return { success: false, error: 'To email is required' }
  }

  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Data is required' }
  }

  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    return { success: false, error: 'Idempotency key is required' }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(to)) {
    return { success: false, error: 'Invalid email format' }
  }

  // Validate template
  const validTemplates = ['ticket-issued', 'upcoming-event', 'post-event-recap', 'feedback']
  if (!validTemplates.includes(template)) {
    return {
      success: false,
      error: `Invalid template. Must be one of: ${validTemplates.join(', ')}`,
    }
  }

  // Validate data structure based on template
  const validationResult = validateTemplateData(template, data as Record<string, unknown>)
  if (!validationResult.success) {
    return validationResult
  }

  return {
    success: true,
    data: {
      template,
      to,
      data,
      idempotencyKey,
    } as EmailRequest,
  }
}

function validateTemplateData(
  template: string,
  data: Record<string, unknown>,
): { success: true } | { success: false; error: string } {
  if (!data.event || typeof data.event !== 'object' || data.event === null) {
    return { success: false, error: 'Event data is required' }
  }

  if (!data.user || typeof data.user !== 'object' || data.user === null) {
    return { success: false, error: 'User data is required' }
  }

  // Validate event data
  const event = data.event as Record<string, unknown>
  const requiredEventFields = [
    'eventProvider',
    'eventId',
    'eventName',
    'eventDate',
    'eventLocation',
    'organizerName',
    'organizerEmail',
  ]

  for (const field of requiredEventFields) {
    if (!event[field] || typeof event[field] !== 'string') {
      return { success: false, error: `Event ${field} is required` }
    }
  }

  // Validate user data
  const user = data.user as Record<string, unknown>
  const requiredUserFields = ['userId', 'email', 'firstName', 'lastName', 'fullName']

  for (const field of requiredUserFields) {
    if (!user[field] || typeof user[field] !== 'string') {
      return { success: false, error: `User ${field} is required` }
    }
  }

  // Template-specific validation
  switch (template) {
    case 'ticket-issued': {
      if (
        !data.ticket ||
        !data.orderNumber ||
        !data.orderDate ||
        typeof data.totalAmount !== 'number' ||
        !data.currency
      ) {
        return {
          success: false,
          error:
            'Ticket issued template requires: ticket, orderNumber, orderDate, totalAmount, currency',
        }
      }

      const requiredTicketFields = ['ticketId', 'ticketType', 'ticketPrice']
      const ticket = data.ticket as Record<string, unknown>
      for (const field of requiredTicketFields) {
        if (!ticket[field]) {
          return { success: false, error: `Ticket ${field} is required` }
        }
      }
      break
    }

    case 'upcoming-event':
      if (typeof data.daysUntilEvent !== 'number' || !data.reminderType) {
        return {
          success: false,
          error: 'Upcoming event template requires: daysUntilEvent (number), reminderType',
        }
      }

      if (!['week', 'day', 'hour'].includes(data.reminderType as string)) {
        return { success: false, error: 'reminderType must be one of: week, day, hour' }
      }
      break

    case 'post-event-recap':
      if (!data.eventSummary) {
        return { success: false, error: 'Post event recap template requires: eventSummary' }
      }
      break

    case 'feedback':
      if (!data.feedbackUrl) {
        return { success: false, error: 'Feedback template requires: feedbackUrl' }
      }
      break
  }

  return { success: true }
}

export default { sendEmail, getEmailStatus, healthCheck }
