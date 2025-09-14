import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import { TicketIssuedProps } from '../types/email'
import { logger } from '../utils/logger'

export interface PDFTicketData {
  eventName: string
  eventDate: string
  eventTime?: string
  eventLocation: string
  ticketId: string
  ticketType: string
  seatNumber?: string
  section?: string
  organizerName: string
  qrCodeData: string
}

export class PDFService {
  /**
   * Generate a PDF ticket with QR code
   */
  async generateTicketPDF(ticketData: TicketIssuedProps): Promise<Buffer> {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Set up colors
      const primaryColor = '#1e40af'
      const secondaryColor = '#3b82f6'
      const textColor = '#1f2937'
      const lightGray = '#f3f4f6'

      // Create QR code data
      const qrData = this.createQRCodeData(ticketData)
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 120,
        margin: 2,
        color: {
          dark: primaryColor,
          light: '#ffffff'
        }
      })

      // Header section
      pdf.setFillColor(primaryColor)
      pdf.rect(0, 0, 210, 40, 'F')
      
      // Event provider logo area (placeholder)
      pdf.setFillColor('#ffffff')
      pdf.circle(25, 20, 8, 'F')
      pdf.setFontSize(8)
      pdf.setTextColor(primaryColor)
      pdf.text('LOGO', 20, 24)

      // Event name in header
      pdf.setFontSize(16)
      pdf.setTextColor('#ffffff')
      pdf.setFont('helvetica', 'bold')
      pdf.text(ticketData.event.eventName, 50, 25)

      // Ticket type
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Ticket Type: ${ticketData.ticket.ticketType}`, 50, 32)

      // Main content area
      pdf.setFillColor(lightGray)
      pdf.rect(10, 50, 190, 120, 'F')

      // Event details section
      pdf.setFontSize(12)
      pdf.setTextColor(textColor)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Event Details', 20, 65)

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      
      const eventDate = new Date(ticketData.event.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      pdf.text(`Date: ${eventDate}`, 20, 75)
      if (ticketData.event.eventTime) {
        pdf.text(`Time: ${ticketData.event.eventTime}`, 20, 82)
      }
      pdf.text(`Location: ${ticketData.event.eventLocation}`, 20, 89)
      pdf.text(`Organizer: ${ticketData.event.organizerName}`, 20, 96)

      // Ticket details section
      pdf.setFont('helvetica', 'bold')
      pdf.text('Ticket Information', 20, 110)

      pdf.setFont('helvetica', 'normal')
      pdf.text(`Ticket ID: ${ticketData.ticket.ticketId}`, 20, 120)
      pdf.text(`Type: ${ticketData.ticket.ticketType}`, 20, 127)
      
      if (ticketData.ticket.seatNumber) {
        pdf.text(`Seat: ${ticketData.ticket.seatNumber}`, 20, 134)
      }
      if (ticketData.ticket.section) {
        pdf.text(`Section: ${ticketData.ticket.section}`, 20, 141)
      }

      // QR Code section
      pdf.setFillColor('#ffffff')
      pdf.rect(120, 60, 70, 90, 'F')
      
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(textColor)
      pdf.text('QR Code', 140, 75)

      // Add QR code image
      pdf.addImage(qrCodeDataURL, 'PNG', 130, 80, 50, 50)

      // Footer section
      pdf.setFillColor(primaryColor)
      pdf.rect(0, 180, 210, 30, 'F')

      pdf.setFontSize(8)
      pdf.setTextColor('#ffffff')
      pdf.setFont('helvetica', 'normal')
      pdf.text('Present this ticket at the event entrance', 20, 195)
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 202)

      // Terms and conditions
      pdf.setFontSize(6)
      pdf.text('Terms: This ticket is non-transferable and valid only for the specified event.', 20, 207)

      // Convert to buffer
      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
      
      logger.info('PDF ticket generated successfully', {
        ticketId: ticketData.ticket.ticketId,
        eventName: ticketData.event.eventName
      })

      return pdfBuffer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown PDF generation error'
      logger.error('Failed to generate PDF ticket', { error: errorMessage }, error as Error)
      throw new Error(`PDF generation failed: ${errorMessage}`)
    }
  }

  /**
   * Create QR code data string from ticket information
   */
  private createQRCodeData(ticketData: TicketIssuedProps): string {
    const qrData = {
      ticketId: ticketData.ticket.ticketId,
      eventId: ticketData.event.eventId,
      eventName: ticketData.event.eventName,
      eventDate: ticketData.event.eventDate,
      eventTime: ticketData.event.eventTime,
      eventLocation: ticketData.event.eventLocation,
      ticketType: ticketData.ticket.ticketType,
      seatNumber: ticketData.ticket.seatNumber,
      section: ticketData.ticket.section,
      organizerName: ticketData.event.organizerName,
      organizerEmail: ticketData.event.organizerEmail,
      generatedAt: new Date().toISOString(),
      verificationUrl: ticketData.event.eventUrl ? `${ticketData.event.eventUrl}/verify/${ticketData.ticket.ticketId}` : null
    }

    return JSON.stringify(qrData, null, 2)
  }

  /**
   * Generate a simple ticket PDF without QR code (fallback)
   */
  async generateSimpleTicketPDF(ticketData: TicketIssuedProps): Promise<Buffer> {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const primaryColor = '#1e40af'
      const textColor = '#1f2937'

      // Header
      pdf.setFillColor(primaryColor)
      pdf.rect(0, 0, 210, 30, 'F')
      
      pdf.setFontSize(16)
      pdf.setTextColor('#ffffff')
      pdf.setFont('helvetica', 'bold')
      pdf.text(ticketData.event.eventName, 20, 20)

      // Content
      pdf.setFontSize(12)
      pdf.setTextColor(textColor)
      pdf.setFont('helvetica', 'normal')
      
      const yStart = 50
      let yPos = yStart
      
      pdf.text(`Ticket ID: ${ticketData.ticket.ticketId}`, 20, yPos)
      yPos += 10
      pdf.text(`Event: ${ticketData.event.eventName}`, 20, yPos)
      yPos += 10
      pdf.text(`Date: ${new Date(ticketData.event.eventDate).toLocaleDateString()}`, 20, yPos)
      yPos += 10
      pdf.text(`Location: ${ticketData.event.eventLocation}`, 20, yPos)
      yPos += 10
      pdf.text(`Type: ${ticketData.ticket.ticketType}`, 20, yPos)
      
      if (ticketData.ticket.seatNumber) {
        yPos += 10
        pdf.text(`Seat: ${ticketData.ticket.seatNumber}`, 20, yPos)
      }

      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))
      return pdfBuffer
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown PDF generation error'
      logger.error('Failed to generate simple PDF ticket', { error: errorMessage }, error as Error)
      throw new Error(`Simple PDF generation failed: ${errorMessage}`)
    }
  }
}