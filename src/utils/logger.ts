export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: Error
}

export class Logger {
  private logLevel: LogLevel

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private formatLog(entry: LogEntry): string {
    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG']
    const levelName = levelNames[entry.level]

    let logMessage = `[${entry.timestamp}] [${levelName}] ${entry.message}`

    if (entry.context && Object.keys(entry.context).length > 0) {
      logMessage += ` | Context: ${JSON.stringify(entry.context)}`
    }

    if (entry.error) {
      logMessage += ` | Error: ${entry.error.message}`
      if (entry.error.stack) {
        logMessage += ` | Stack: ${entry.error.stack}`
      }
    }

    return logMessage
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }

    const formattedLog = this.formatLog(entry)

    // Use appropriate console method based on log level
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog)
        break
      case LogLevel.WARN:
        console.warn(formattedLog)
        break
      case LogLevel.INFO:
        console.info(formattedLog)
        break
      case LogLevel.DEBUG:
        console.debug(formattedLog)
        break
    }
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  // Email service specific logging methods
  emailSent(messageId: string, to: string, template: string, idempotencyKey: string): void {
    this.info('Email sent successfully', {
      messageId,
      to: this.maskEmail(to),
      template,
      idempotencyKey,
    })
  }

  emailFailed(to: string, template: string, idempotencyKey: string, error: Error): void {
    this.error(
      'Email sending failed',
      {
        to: this.maskEmail(to),
        template,
        idempotencyKey,
      },
      error,
    )
  }

  emailDuplicate(
    to: string,
    template: string,
    idempotencyKey: string,
    existingMessageId: string,
  ): void {
    this.info('Duplicate email request (idempotent)', {
      to: this.maskEmail(to),
      template,
      idempotencyKey,
      existingMessageId,
    })
  }

  validationFailed(errors: string[], requestData?: unknown): void {
    this.warn('Email request validation failed', {
      errors,
      hasRequestData: !!requestData,
    })
  }

  serviceStarted(port: number | string): void {
    this.info('Email service started', {
      port,
      environment: process.env.NODE_ENV || 'development',
    })
  }

  healthCheck(): void {
    this.debug('Health check requested')
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@')
    if (!domain) return email // Invalid email format, return as-is

    if (localPart.length <= 2) {
      return `${localPart}@${domain}`
    }

    const maskedLocal =
      localPart.charAt(0) +
      '*'.repeat(localPart.length - 2) +
      localPart.charAt(localPart.length - 1)
    return `${maskedLocal}@${domain}`
  }
}

// Create default logger instance
const getLogLevel = (): LogLevel => {
  const level = process.env.LOG_LEVEL?.toUpperCase()
  switch (level) {
    case 'ERROR':
      return LogLevel.ERROR
    case 'WARN':
      return LogLevel.WARN
    case 'INFO':
      return LogLevel.INFO
    case 'DEBUG':
      return LogLevel.DEBUG
    default:
      return process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG
  }
}

export const logger = new Logger(getLogLevel())
