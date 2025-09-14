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
import { TicketIssuedProps } from '../types/email'

export const TicketIssuedTemplate = ({ event, user, ticket, orderNumber, orderDate, totalAmount, currency }: TicketIssuedProps) => {
  const previewText = `Your ticket for ${event.eventName} is ready!`

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
            <Text style={heading}>🎫 Your Ticket is Ready!</Text>
            <Text style={paragraph}>
              Hi {user.firstName}, your ticket for <strong>{event.eventName}</strong> has been issued successfully.
            </Text>
            <Text style={paragraph}>
              📎 Your digital ticket with QR code is attached to this email.
            </Text>
          </Section>

          <Section style={ticketCard}>
            <Text style={ticketTitle}>{event.eventName}</Text>
            <Text style={eventDetail}>
              📅 {new Date(event.eventDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={eventDetail}>📍 {event.eventLocation}</Text>
            <Text style={eventDetail}>🎟️ {ticket.ticketType}</Text>
            <Text style={eventDetail}>🆔 {ticket.ticketId}</Text>
            {ticket.seatNumber && (
              <Text style={eventDetail}>💺 Seat: {ticket.seatNumber}</Text>
            )}
          </Section>

          <Section style={orderSection}>
            <Text style={sectionTitle}>Order Details</Text>
            <Text style={orderDetail}>Order Number: {orderNumber}</Text>
            <Text style={orderDetail}>Order Date: {new Date(orderDate).toLocaleDateString()}</Text>
            <Text style={orderDetail}>Total: {totalAmount} {currency}</Text>
          </Section>

          {ticket.ticketUrl && (
            <Section style={buttonSection}>
              <Button style={button} href={ticket.ticketUrl}>
                View Full Ticket
              </Button>
            </Section>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Questions? Contact {event.organizerName} at{' '}
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
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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

const ticketCard = {
  backgroundColor: '#ffffff',
  border: '2px dashed #3b82f6',
  borderRadius: '16px',
  margin: '24px auto',
  padding: '32px 24px',
  textAlign: 'center' as const,
  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.1)',
  position: 'relative' as const,
  maxWidth: '500px',
}

const ticketTitle = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1e40af',
  margin: '0 0 20px',
}

const eventDetail = {
  fontSize: '15px',
  color: '#475569',
  margin: '10px 0',
  fontWeight: '500',
}

const orderSection = {
  margin: '24px auto',
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  textAlign: 'center' as const,
  maxWidth: '500px',
}

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1a202c',
  margin: '0 0 16px',
}

const orderDetail = {
  fontSize: '16px',
  color: '#495057',
  margin: '8px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 4px 6px rgba(79, 172, 254, 0.25)',
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
  color: '#4facfe',
  textDecoration: 'underline',
  fontWeight: '500',
}