// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { UpcomingEventProps } from '../types/email'

export const UpcomingEventTemplate = ({
  event,
  user,
  daysUntilEvent,
  eventDetails,
  actionItems,
}: UpcomingEventProps) => {
  const previewText = `${event.eventName} is coming up in ${daysUntilEvent} days!`

  const getReminderMessage = () => {
    if (daysUntilEvent === 0) {
      return 'today!'
    } else if (daysUntilEvent === 1) {
      return 'tomorrow!'
    } else {
      return `in ${daysUntilEvent} days!`
    }
  }

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {event.logoUrl && (
            <Section style={logoSection}>
              <Img src={event.logoUrl} width="40" height="40" alt={`${event.eventProvider} logo`} />
            </Section>
          )}

          <Section style={header}>
            <Text style={heading}>📅 Event Reminder</Text>
            <Text style={paragraph}>
              Hi {user.firstName}, <strong>{event.eventName}</strong> is happening{' '}
              {getReminderMessage()}
            </Text>
          </Section>

          <Section style={eventCard}>
            <Text style={eventTitle}>{event.eventName}</Text>
            <Text style={eventDetail}>
              📅{' '}
              {new Date(event.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {event.eventTime && ` at ${event.eventTime}`}
            </Text>
            <Text style={eventDetail}>📍 {event.eventLocation}</Text>
            {eventDetails && <Text style={eventDescription}>{eventDetails}</Text>}
          </Section>

          {actionItems && actionItems.length > 0 && (
            <Section style={actionSection}>
              <Text style={sectionTitle}>What to bring:</Text>
              {actionItems.map((item, index) => (
                <Text key={index} style={actionItem}>
                  • {item}
                </Text>
              ))}
            </Section>
          )}

          {event.eventUrl && (
            <Section style={buttonSection}>
              <Button style={button} href={event.eventUrl}>
                Event Details
              </Button>
            </Section>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Organized by {event.organizerName} •{' '}
              <a href={`mailto:${event.organizerEmail}`} style={link}>
                {event.organizerEmail}
              </a>
            </Text>
            <Text style={footerText}>Powered by {event.eventProvider}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f8fafc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
}

const logoSection = {
  padding: '24px 32px 16px',
  textAlign: 'center' as const,
  backgroundColor: '#ffffff',
}

const header = {
  padding: '16px 32px 32px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
}

const heading = {
  fontSize: '28px',
  lineHeight: '1.2',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 12px',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: 'rgba(255, 255, 255, 0.95)',
  margin: '0',
}

const eventCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  margin: '24px auto',
  padding: '32px 24px',
  textAlign: 'center' as const,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  maxWidth: '500px',
}

const eventTitle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1a202c',
  margin: '0 0 20px',
}

const eventDetail = {
  fontSize: '15px',
  color: '#4a5568',
  margin: '10px 0',
  fontWeight: '500',
}

const eventDescription = {
  fontSize: '16px',
  color: '#424242',
  margin: '16px 0 0',
  lineHeight: '1.5',
}

const actionSection = {
  margin: '24px auto',
  padding: '24px',
  backgroundColor: '#fef7e0',
  borderRadius: '12px',
  border: '1px solid #f6e05e',
  borderLeft: '4px solid #f59e0b',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const sectionTitle = {
  fontSize: '17px',
  fontWeight: '700',
  color: '#92400e',
  margin: '0 0 16px',
}

const actionItem = {
  fontSize: '15px',
  color: '#a16207',
  margin: '8px 0',
  fontWeight: '500',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)',
  transition: 'all 0.2s ease',
}

const footer = {
  padding: '32px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
}

const footerText = {
  fontSize: '13px',
  color: '#718096',
  margin: '6px 0',
  lineHeight: '1.4',
}

const link = {
  color: '#667eea',
  textDecoration: 'underline',
  fontWeight: '500',
}
