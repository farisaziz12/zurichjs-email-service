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
import { PostEventRecapProps } from '../types/email'

export const PostEventRecapTemplate = ({ event, user, eventSummary, highlightImages, nextEvents, speakerHighlights }: PostEventRecapProps) => {
  const previewText = `Thank you for attending ${event.eventName}!`

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
            <Text style={heading}>🎉 Thank You for Attending!</Text>
            <Text style={paragraph}>
              Hi {user.firstName}, thank you for being part of <strong>{event.eventName}</strong>!
            </Text>
          </Section>

          <Section style={summarySection}>
            <Text style={sectionTitle}>Event Recap</Text>
            <Text style={summaryText}>{eventSummary}</Text>
          </Section>

          {highlightImages && highlightImages.length > 0 && (
            <Section style={imagesSection}>
              <Text style={sectionTitle}>Event Highlights</Text>
              <div style={imageGrid}>
                {highlightImages.slice(0, 3).map((imageUrl, index) => (
                  <Img
                    key={index}
                    src={imageUrl}
                    width="200"
                    height="150"
                    alt={`Event highlight ${index + 1}`}
                    style={highlightImage}
                  />
                ))}
              </div>
            </Section>
          )}

          {speakerHighlights && speakerHighlights.length > 0 && (
            <Section style={speakersSection}>
              <Text style={sectionTitle}>Speaker Highlights</Text>
              {speakerHighlights.map((speaker, index) => (
                <div key={index} style={speakerCard}>
                  {speaker.image && (
                    <Img
                      src={speaker.image}
                      width="60"
                      height="60"
                      alt={speaker.name}
                      style={speakerImage}
                    />
                  )}
                  <div>
                    <Text style={speakerName}>{speaker.name}</Text>
                    <Text style={speakerTopic}>{speaker.topic}</Text>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {nextEvents && nextEvents.length > 0 && (
            <Section style={nextEventsSection}>
              <Text style={sectionTitle}>Upcoming Events</Text>
              {nextEvents.map((nextEvent) => (
                <div key={nextEvent.eventId} style={eventCard}>
                  <Text style={nextEventTitle}>{nextEvent.eventName}</Text>
                  <Text style={nextEventDate}>
                    {new Date(nextEvent.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Button style={smallButton} href={nextEvent.eventUrl}>
                    Learn More
                  </Button>
                </div>
              ))}
            </Section>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Stay connected with {event.organizerName} •{' '}
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
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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

const summarySection = {
  margin: '24px auto',
  padding: '32px 24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const sectionTitle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1a202c',
  margin: '0 0 16px',
}

const summaryText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#495057',
  margin: '0',
}

const imagesSection = {
  margin: '32px auto',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const imageGrid = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap' as const,
  gap: '16px',
  margin: '16px 0',
}

const highlightImage = {
  borderRadius: '8px',
  objectFit: 'cover' as const,
}

const speakersSection = {
  margin: '32px auto',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const speakerCard = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  margin: '16px 0',
  gap: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}

const speakerImage = {
  borderRadius: '50%',
  objectFit: 'cover' as const,
}

const speakerName = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#212529',
  margin: '0 0 4px',
}

const speakerTopic = {
  fontSize: '14px',
  color: '#6c757d',
  margin: '0',
}

const nextEventsSection = {
  margin: '32px auto',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const eventCard = {
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  margin: '16px 0',
  textAlign: 'center' as const,
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
}

const nextEventTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#0c5460',
  margin: '0 0 8px',
}

const nextEventDate = {
  fontSize: '14px',
  color: '#087990',
  margin: '0 0 16px',
}

const smallButton = {
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 20px',
  boxShadow: '0 2px 4px rgba(240, 147, 251, 0.25)',
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
  color: '#f5576c',
  textDecoration: 'underline',
  fontWeight: '500',
}