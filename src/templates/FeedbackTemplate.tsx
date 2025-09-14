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
import { FeedbackEmailProps } from '../types/email'

export const FeedbackTemplate = ({
  event,
  user,
  feedbackUrl,
  incentive,
  surveyEstimatedTime,
}: FeedbackEmailProps) => {
  const previewText = `Share your feedback on ${event.eventName}`

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
            <Text style={heading}>💭 We'd Love Your Feedback!</Text>
            <Text style={paragraph}>
              Hi {user.firstName}, your thoughts on <strong>{event.eventName}</strong> matter to us.
            </Text>
          </Section>

          <Section style={feedbackCard}>
            <Text style={cardTitle}>Help us improve future events</Text>
            <Text style={cardText}>
              Your feedback helps us create better experiences for our community.
              {surveyEstimatedTime &&
                ` This survey takes about ${surveyEstimatedTime} minutes to complete.`}
            </Text>

            {incentive && (
              <Section style={incentiveSection}>
                <Text style={incentiveText}>🎁 {incentive}</Text>
              </Section>
            )}

            <Section style={buttonSection}>
              <Button style={button} href={feedbackUrl}>
                Share Your Feedback
              </Button>
            </Section>
          </Section>

          <Section style={eventDetails}>
            <Text style={detailsTitle}>Event Details</Text>
            <Text style={eventDetail}>
              📅 {new Date(event.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={eventDetail}>📍 {event.eventLocation}</Text>
            <Text style={eventDetail}>👤 Organized by {event.organizerName}</Text>
          </Section>

          <Section style={questions}>
            <Text style={questionsTitle}>What we'll ask about:</Text>
            <Text style={questionItem}>• Overall event experience</Text>
            <Text style={questionItem}>• Content quality and relevance</Text>
            <Text style={questionItem}>• Venue and logistics</Text>
            <Text style={questionItem}>• Suggestions for improvement</Text>
            <Text style={questionItem}>• Interest in future events</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Thank you for being part of our community! •{' '}
              <a href={`mailto:${event.organizerEmail}`} style={link}>
                {event.organizerEmail}
              </a>
            </Text>
            <Text style={footerText}>
              Powered by {event.eventProvider}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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
  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  color: '#7c2d12',
}

const heading = {
  fontSize: '28px',
  lineHeight: '1.2',
  fontWeight: '700',
  color: '#7c2d12',
  margin: '0 0 12px',
  textShadow: '0 1px 2px rgba(124, 45, 18, 0.1)',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#92400e',
  margin: '0',
}

const feedbackCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #fed7aa',
  borderRadius: '16px',
  margin: '24px auto',
  padding: '32px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 6px rgba(251, 191, 36, 0.1)',
  maxWidth: '500px',
}

const cardTitle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#ea580c',
  margin: '0 0 16px',
}

const cardText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#9a3412',
  margin: '0 0 24px',
}

const incentiveSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '12px',
  padding: '20px',
  margin: '20px 0 24px',
  border: '1px solid #fbbf24',
  boxShadow: '0 2px 4px rgba(251, 191, 36, 0.1)',
}

const incentiveText = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#e65100',
  margin: '0',
  textAlign: 'center' as const,
}

const buttonSection = {
  margin: '24px 0 0',
}

const button = {
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  boxShadow: '0 4px 8px rgba(251, 191, 36, 0.3)',
  transition: 'all 0.2s ease',
}

const eventDetails = {
  margin: '24px auto',
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const detailsTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#212529',
  margin: '0 0 12px',
}

const eventDetail = {
  fontSize: '14px',
  color: '#6c757d',
  margin: '6px 0',
}

const questions = {
  margin: '24px auto',
  padding: '24px',
  backgroundColor: '#f0fdf4',
  borderRadius: '12px',
  border: '1px solid #bbf7d0',
  borderLeft: '4px solid #22c55e',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const questionsTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2e7d32',
  margin: '0 0 12px',
}

const questionItem = {
  fontSize: '14px',
  color: '#388e3c',
  margin: '4px 0',
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
  color: '#f59e0b',
  textDecoration: 'underline',
  fontWeight: '500',
}