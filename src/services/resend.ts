import { Resend } from 'resend'
import { render } from '@react-email/components'
import React from 'react'
import {
  EmailRequest,
  EmailResponse,
  TicketIssuedProps,
  UpcomingEventProps,
  PostEventRecapProps,
  FeedbackEmailProps,
  EmailAttachment,
} from '../types/email'
import {
  TicketIssuedTemplate,
  UpcomingEventTemplate,
  PostEventRecapTemplate,
  FeedbackTemplate,
} from '../templates'
import { PDFService } from './pdf'
import { logger } from '../utils/logger'

export class ResendService {
  private resend: Resend
  private fromEmail: string
  private sentEmails: Map<string, string> = new Map() // idempotencyKey -> messageId
  private pdfService: PDFService

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }

    this.resend = new Resend(apiKey)
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@example.com'
    this.pdfService = new PDFService()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getTemplate(templateName: string): (props: any) => React.ReactElement {
    switch (templateName) {
      case 'ticket-issued':
        return TicketIssuedTemplate
      case 'upcoming-event':
        return UpcomingEventTemplate
      case 'post-event-recap':
        return PostEventRecapTemplate
      case 'feedback':
        return FeedbackTemplate
      default:
        throw new Error(`Unknown template: ${templateName}`)
    }
  }

  private getSubject(templateName: string, eventName: string): string {
    switch (templateName) {
      case 'ticket-issued':
        return `🎫 Your ticket for ${eventName} is ready!`
      case 'upcoming-event':
        return `📅 Reminder: ${eventName} is coming up!`
      case 'post-event-recap':
        return `🎉 Thank you for attending ${eventName}!`
      case 'feedback':
        return `💭 Share your feedback on ${eventName}`
      default:
        return `Event Update: ${eventName}`
    }
  }

  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    try {
      // Check for idempotency
      if (this.sentEmails.has(request.idempotencyKey)) {
        const existingMessageId = this.sentEmails.get(request.idempotencyKey) || 'unknown'
        logger.emailDuplicate(
          request.to,
          request.template,
          request.idempotencyKey,
          existingMessageId,
        )
        return {
          success: true,
          messageId: existingMessageId,
          idempotencyKey: request.idempotencyKey,
        }
      }

      const Template = this.getTemplate(request.template)
      const subject = this.getSubject(request.template, request.data.event.eventName)

      // Render the email template
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html = await render(Template(request.data as any))
      const text = this.generatePlainText(request.template, request.data)

      // Generate PDF attachment for ticket-issued emails
      let attachments: EmailAttachment[] = []
      if (request.template === 'ticket-issued') {
        try {
          const ticketData = request.data as TicketIssuedProps
          const pdfBuffer = await this.pdfService.generateTicketPDF(ticketData)
          const filename = `ticket-${ticketData.ticket.ticketId}.pdf`
          
          attachments = [{
            filename,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }]

          logger.info('PDF ticket generated and attached', {
            ticketId: ticketData.ticket.ticketId,
            filename
          })
        } catch (pdfError) {
          logger.error('Failed to generate PDF ticket, sending email without attachment', {
            error: pdfError instanceof Error ? pdfError.message : 'Unknown PDF error'
          }, pdfError as Error)
          // Continue without PDF attachment
        }
      }

      // Send email via Resend
      const emailPayload: any = {
        from: this.fromEmail,
        to: request.to,
        subject,
        html,
        text,
        headers: {
          'X-Idempotency-Key': request.idempotencyKey,
        },
      }

      // Add attachments if any
      if (attachments.length > 0) {
        emailPayload.attachments = attachments.map(attachment => ({
          filename: attachment.filename,
          content: attachment.content.toString('base64'),
          content_type: attachment.contentType
        }))
      }

      const response = await this.resend.emails.send(emailPayload)

      if (response.error) {
        const error = new Error(response.error.message)
        logger.emailFailed(request.to, request.template, request.idempotencyKey, error)
        return {
          success: false,
          error: response.error.message,
          idempotencyKey: request.idempotencyKey,
        }
      }

      // Store for idempotency
      const messageId = response.data?.id || 'unknown'
      this.sentEmails.set(request.idempotencyKey, messageId)

      logger.emailSent(messageId, request.to, request.template, request.idempotencyKey)

      return {
        success: true,
        messageId,
        idempotencyKey: request.idempotencyKey,
        attachments: attachments.length > 0 ? attachments : undefined,
      }
    } catch (error) {
      const emailError = error instanceof Error ? error : new Error('Unknown error occurred')
      logger.emailFailed(request.to, request.template, request.idempotencyKey, emailError)
      return {
        success: false,
        error: emailError.message,
        idempotencyKey: request.idempotencyKey,
      }
    }
  }

  private generatePlainText(
    templateName: string,
    data: TicketIssuedProps | UpcomingEventProps | PostEventRecapProps | FeedbackEmailProps,
  ): string {
    const { event, user } = data

    switch (templateName) {
      case 'ticket-issued': {
        const ticketData = data as TicketIssuedProps
        return `
Hi ${user.firstName},

Your ticket for ${event.eventName} is ready!

Event Details:
- Event: ${event.eventName}
- Date: ${new Date(event.eventDate).toLocaleDateString()}
- Location: ${event.eventLocation}
- Ticket ID: ${ticketData.ticket.ticketId}
- Order #: ${ticketData.orderNumber}

Questions? Contact ${event.organizerName} at ${event.organizerEmail}

Powered by ${event.eventProvider}
        `.trim()
      }

      case 'upcoming-event': {
        const upcomingData = data as UpcomingEventProps
        return `
Hi ${user.firstName},

${event.eventName} is coming up in ${upcomingData.daysUntilEvent} days!

Event Details:
- Event: ${event.eventName}
- Date: ${new Date(event.eventDate).toLocaleDateString()}
- Location: ${event.eventLocation}

Don't miss it!

Event organized by ${event.organizerName}
Contact: ${event.organizerEmail}

Powered by ${event.eventProvider}
        `.trim()
      }

      case 'post-event-recap': {
        const recapData = data as PostEventRecapProps
        return `
Hi ${user.firstName},

Thank you for attending ${event.eventName}!

${recapData.eventSummary}

We hope you enjoyed the event. Stay tuned for future events!

${event.organizerName}
${event.organizerEmail}

Powered by ${event.eventProvider}
        `.trim()
      }

      case 'feedback': {
        const feedbackData = data as FeedbackEmailProps
        return `
Hi ${user.firstName},

We'd love your feedback on ${event.eventName}!

Please take a few minutes to share your thoughts: ${feedbackData.feedbackUrl}

Your feedback helps us improve our future events.

Thank you,
${event.organizerName}
${event.organizerEmail}

Powered by ${event.eventProvider}
        `.trim()
      }

      default:
        return `
Hi ${user.firstName},

You have an update regarding ${event.eventName}.

Best regards,
${event.organizerName}

Powered by ${event.eventProvider}
        `.trim()
    }
  }

  // Method to clear the idempotency cache (useful for testing or maintenance)
  clearIdempotencyCache(): void {
    this.sentEmails.clear()
  }

  // Method to check if an email was already sent
  wasEmailSent(idempotencyKey: string): boolean {
    return this.sentEmails.has(idempotencyKey)
  }

  // Method to get message ID for a sent email
  getMessageId(idempotencyKey: string): string | undefined {
    return this.sentEmails.get(idempotencyKey)
  }
}
