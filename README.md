# ZurichJS Email Service

A comprehensive email service built with TypeScript, Resend, and React Email for event platforms. This service provides beautiful, responsive email templates and idempotent email sending capabilities.

## Features

- 🎯 **Event-focused email templates** - Ticket confirmations, event reminders, post-event recaps, and feedback requests
- 🎨 **Beautiful design system** - Consistent, responsive email designs
- 🔄 **Idempotent email sending** - Prevent duplicate emails with idempotency keys
- ⚡ **Powered by Resend** - Reliable email delivery service
- 📧 **React Email templates** - Modern, component-based email templates
- 📄 **PDF Ticket Generation** - Automatic PDF ticket generation with QR codes for ticket-issued emails
- 🔍 **QR Code Integration** - QR codes containing complete ticket and event information
- 📝 **Comprehensive logging** - Detailed logging with email masking for privacy
- 🌍 **Multi-provider support** - Generic design works with any event platform
- 🛡️ **Type-safe** - Full TypeScript support with comprehensive type definitions

## Quick Start

### 1. Environment Setup

Copy the environment variables:

```bash
cp .env.example .env
```

Update your `.env` file:

```env
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com
PORT=3000
NODE_ENV=production
LOG_LEVEL=INFO
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Service

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Send Email

**POST** `/api/v1/email/send`

Send an email using one of the predefined templates.

#### Ticket Issued Template

**Request Body:**
```json
{
  "template": "ticket-issued",
  "to": "user@example.com",
  "idempotencyKey": "ticket-issued-12345",
  "data": {
    "event": {
      "eventProvider": "ZurichJS",
      "eventId": "event-123",
      "eventName": "React Workshop",
      "eventDate": "2024-12-15",
      "eventTime": "18:00",
      "eventLocation": "Zurich Tech Hub",
      "organizerName": "ZurichJS Team",
      "organizerEmail": "hello@zurichjs.ch",
      "eventUrl": "https://zurichjs.ch/events/react-workshop",
      "logoUrl": "https://zurichjs.ch/logo.png",
      "brandColor": "#0070f3"
    },
    "user": {
      "userId": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe"
    },
    "ticket": {
      "ticketId": "TKT-789",
      "ticketType": "General Admission",
      "ticketPrice": 25.00,
      "currency": "CHF",
      "qrCodeUrl": "https://example.com/qr/TKT-789",
      "ticketUrl": "https://zurichjs.ch/tickets/TKT-789",
      "seatNumber": "A-15",
      "section": "Main Hall"
    },
    "orderNumber": "ORD-456",
    "orderDate": "2024-12-01",
    "totalAmount": 25.00,
    "currency": "CHF"
  }
}
```

#### Upcoming Event Template

**Request Body:**
```json
{
  "template": "upcoming-event",
  "to": "user@example.com",
  "idempotencyKey": "upcoming-event-12345",
  "data": {
    "event": {
      "eventProvider": "ZurichJS",
      "eventId": "event-123",
      "eventName": "React Workshop",
      "eventDate": "2024-12-15",
      "eventTime": "18:00",
      "eventLocation": "Zurich Tech Hub",
      "organizerName": "ZurichJS Team",
      "organizerEmail": "hello@zurichjs.ch",
      "eventUrl": "https://zurichjs.ch/events/react-workshop",
      "logoUrl": "https://zurichjs.ch/logo.png",
      "brandColor": "#0070f3"
    },
    "user": {
      "userId": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe"
    },
    "daysUntilEvent": 1,
    "reminderType": "day",
    "eventDetails": "Join us for an interactive React workshop covering hooks, state management, and best practices. Bring your laptop and get ready to code!",
    "actionItems": [
      "Bring your laptop and charger",
      "Install Node.js and npm",
      "Create a GitHub account if you don't have one",
      "Check the event location and parking options"
    ]
  }
}
```

#### Post Event Recap Template

**Request Body:**
```json
{
  "template": "post-event-recap",
  "to": "user@example.com",
  "idempotencyKey": "post-event-recap-12345",
  "data": {
    "event": {
      "eventProvider": "ZurichJS",
      "eventId": "event-123",
      "eventName": "React Workshop",
      "eventDate": "2024-12-15",
      "eventTime": "18:00",
      "eventLocation": "Zurich Tech Hub",
      "organizerName": "ZurichJS Team",
      "organizerEmail": "hello@zurichjs.ch",
      "eventUrl": "https://zurichjs.ch/events/react-workshop",
      "logoUrl": "https://zurichjs.ch/logo.png",
      "brandColor": "#0070f3"
    },
    "user": {
      "userId": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe"
    },
    "eventSummary": "Thank you for joining us at the React Workshop! We had an amazing time exploring React hooks, state management patterns, and building interactive components together. The energy in the room was incredible, and we hope you learned something valuable.",
    "highlightImages": [
      "https://zurichjs.ch/images/workshop-1.jpg",
      "https://zurichjs.ch/images/workshop-2.jpg",
      "https://zurichjs.ch/images/workshop-3.jpg"
    ],
    "nextEvents": [
      {
        "eventId": "event-124",
        "eventName": "Vue.js Meetup",
        "eventDate": "2024-12-22",
        "eventUrl": "https://zurichjs.ch/events/vue-meetup"
      },
      {
        "eventId": "event-125",
        "eventName": "TypeScript Deep Dive",
        "eventDate": "2025-01-05",
        "eventUrl": "https://zurichjs.ch/events/typescript-deep-dive"
      }
    ],
    "speakerHighlights": [
      {
        "name": "Sarah Johnson",
        "topic": "Advanced React Patterns",
        "image": "https://zurichjs.ch/speakers/sarah-johnson.jpg"
      },
      {
        "name": "Mike Chen",
        "topic": "State Management with Zustand",
        "image": "https://zurichjs.ch/speakers/mike-chen.jpg"
      }
    ]
  }
}
```

#### Feedback Template

**Request Body:**
```json
{
  "template": "feedback",
  "to": "user@example.com",
  "idempotencyKey": "feedback-12345",
  "data": {
    "event": {
      "eventProvider": "ZurichJS",
      "eventId": "event-123",
      "eventName": "React Workshop",
      "eventDate": "2024-12-15",
      "eventTime": "18:00",
      "eventLocation": "Zurich Tech Hub",
      "organizerName": "ZurichJS Team",
      "organizerEmail": "hello@zurichjs.ch",
      "eventUrl": "https://zurichjs.ch/events/react-workshop",
      "logoUrl": "https://zurichjs.ch/logo.png",
      "brandColor": "#0070f3"
    },
    "user": {
      "userId": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe"
    },
    "feedbackUrl": "https://zurichjs.ch/feedback/event-123",
    "incentive": "Complete the survey and get 10% off your next event ticket!",
    "surveyEstimatedTime": 5
  }
}
```

**Response (for all templates):**
```json
{
  "success": true,
  "messageId": "resend-message-id",
  "idempotencyKey": "unique-key-12345"
}
```

### Check Email Status

**GET** `/api/v1/email/status/:idempotencyKey`

Check if an email was already sent using the idempotency key.

**Example Request:**
```bash
GET /api/v1/email/status/ticket-issued-12345
```

**Response:**
```json
{
  "success": true,
  "sent": true,
  "messageId": "resend-message-id",
  "idempotencyKey": "ticket-issued-12345"
}
```

### Health Check

**GET** `/api/v1/health`

Check service health status.

**Example Request:**
```bash
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "Email service is running",
  "timestamp": "2024-12-01T10:30:00.000Z",
  "version": "1.0.0"
}
```

## Email Templates

### 1. Ticket Issued (`ticket-issued`)
Sent when a ticket is successfully purchased. **Automatically includes a PDF attachment with QR code containing complete ticket and event information.**

**PDF Features:**
- Professional ticket layout with event branding
- QR code containing JSON data with ticket details
- Event information, seat details, and verification data
- Print-ready format for physical ticket presentation
- Fallback to simple PDF if QR code generation fails

### 2. Upcoming Event (`upcoming-event`)
Sent as event reminders (1 week, 1 day, or 1 hour before).

### 3. Post-Event Recap (`post-event-recap`)
Sent after an event to thank attendees and share highlights.

### 4. Feedback Request (`feedback`)
Sent to collect feedback after an event.

## Development

### Scripts

```bash
# Development with hot reload
npm run dev

# Type checking
npm run check:types

# Linting
npm run lint

# Build for production
npm run build

# Run production server
npm start

# Run tests
npm test
```

## License

MIT License - see LICENSE file for details.
