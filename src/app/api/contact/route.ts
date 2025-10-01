import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Rate limiting - simple in-memory store (use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 3; // Max 3 emails per hour per IP

// Sanitize input to prevent XSS and injection attacks
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 5000); // Limit length
}

// Validate name (letters, spaces, hyphens only)
function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(name);
}

// Enhanced email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Detect spam keywords
function containsSpam(text: string): boolean {
  const spamKeywords = [
    'viagra', 'cialis', 'lottery', 'winner', 'prize', 
    'click here', 'buy now', 'limited time', 'act now',
    'cryptocurrency', 'bitcoin', 'forex', 'casino'
  ];
  const lowerText = text.toLowerCase();
  return spamKeywords.some(keyword => lowerText.includes(keyword));
}

// Rate limiting check
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    let { name, email, message } = body;

    // Validate input presence
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    message = sanitizeInput(message);

    // Validate name format
    if (!isValidName(name)) {
      return NextResponse.json(
        { error: 'Invalid name format. Only letters, spaces, and hyphens allowed.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message is too short. Please provide more details.' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 5000 characters.' },
        { status: 400 }
      );
    }

    // Spam detection
    if (containsSpam(name) || containsSpam(message)) {
      console.warn('Spam detected:', { name, email, ip });
      return NextResponse.json(
        { error: 'Message flagged as spam. Please contact me through other channels.' },
        { status: 400 }
      );
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact me through other channels.' },
        { status: 503 }
      );
    }

    // Configure Nodemailer transporter with security options
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Security options
      tls: {
        rejectUnauthorized: true, // Verify server certificate
        minVersion: 'TLSv1.2', // Minimum TLS version
      },
      // Connection timeout
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Escape HTML entities to prevent XSS in email
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Email content for you (receiving the message)
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_TO || 'pratham.satani@outlook.com',
      subject: `[Portfolio] Contact from ${escapeHtml(name)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2; border-bottom: 3px solid #0891b2; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #1e293b;">Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 10px 0;"><strong style="color: #1e293b;">Email:</strong> 
              <a href="mailto:${escapeHtml(email)}" style="color: #0891b2;">${escapeHtml(email)}</a>
            </p>
            <p style="margin: 10px 0;"><strong style="color: #1e293b;">IP Address:</strong> ${escapeHtml(ip)}</p>
            <p style="margin: 10px 0;"><strong style="color: #1e293b;">User Agent:</strong> ${escapeHtml(request.headers.get('user-agent') || 'Unknown')}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #1e293b;">Message:</h3>
            <p style="line-height: 1.6; color: #374151; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This message was sent from your portfolio contact form on ${new Date().toLocaleString()}<br>
            Message ID: ${Date.now()}-${Math.random().toString(36).substring(7)}
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
IP Address: ${ip}
User Agent: ${request.headers.get('user-agent') || 'Unknown'}

Message:
${message}

---
Sent: ${new Date().toLocaleString()}
Message ID: ${Date.now()}-${Math.random().toString(36).substring(7)}
      `,
      replyTo: email, // Allow you to reply directly to the sender
    };

    // Verify transporter connection before sending
    try {
      await transporter.verify();
    } catch (error) {
      console.error('SMTP connection failed:', error);
      return NextResponse.json(
        { error: 'Email service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log success (but don't log sensitive data in production)
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      from: email,
      timestamp: new Date().toISOString(),
      ip: ip
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Message sent successfully! I will get back to you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error securely (don't expose sensitive info to client)
    console.error('Error processing contact form:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    // Generic error message to client
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour
