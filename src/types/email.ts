export interface BaseEventData {
  eventProvider: string
  eventId: string
  eventName: string
  eventDate: string
  eventTime?: string
  eventLocation: string
  organizerName: string
  organizerEmail: string
  eventUrl?: string
  logoUrl?: string
  brandColor?: string
}

export interface UserData {
  userId: string
  email: string
  firstName: string
  lastName: string
  fullName: string
}

export interface TicketData {
  ticketId: string
  ticketType: string
  ticketPrice: number
  currency: string
  qrCodeUrl?: string
  ticketUrl?: string
  seatNumber?: string
  section?: string
}

export interface EmailTemplateProps {
  event: BaseEventData
  user: UserData
  idempotencyKey: string
}

export interface TicketIssuedProps extends EmailTemplateProps {
  ticket: TicketData
  orderNumber: string
  orderDate: string
  totalAmount: number
  currency: string
}

export interface UpcomingEventProps extends EmailTemplateProps {
  daysUntilEvent: number
  reminderType: 'week' | 'day' | 'hour'
  eventDetails?: string
  actionItems?: string[]
}

export interface PostEventRecapProps extends EmailTemplateProps {
  eventSummary: string
  highlightImages?: string[]
  nextEvents?: {
    eventId: string
    eventName: string
    eventDate: string
    eventUrl: string
  }[]
  speakerHighlights?: {
    name: string
    topic: string
    image?: string
  }[]
}

export interface FeedbackEmailProps extends EmailTemplateProps {
  feedbackUrl: string
  incentive?: string
  surveyEstimatedTime?: number
}

export interface EmailRequest {
  template: 'ticket-issued' | 'upcoming-event' | 'post-event-recap' | 'feedback'
  to: string
  data: TicketIssuedProps | UpcomingEventProps | PostEventRecapProps | FeedbackEmailProps
  idempotencyKey: string
}

export interface EmailAttachment {
  filename: string
  content: Buffer
  contentType: string
}

export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
  idempotencyKey: string
  attachments?: EmailAttachment[]
}
