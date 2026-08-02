import { createFileRoute } from '@tanstack/react-router';
import type {} from "@tanstack/react-start";
import { Resend } from 'resend';
import rateLimit from '../../lib/rate-limit';
import { 
  generateQuestionnaireNotificationTemplate, 
  generateQuestionnaireAutoReplyTemplate 
} from '../../lib/email-templates';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const formspreeEndpoint = process.env.VITE_FORMSPREE_QUESTION;
const supportEmail = process.env.SUPPORT_EMAIL || 'lyfspot@zohomail.in';
const fromEmail = process.env.FROM_EMAIL || 'contact@buildwithsravan.dev';
const replyToEmail = process.env.REPLY_TO_EMAIL || 'contact@buildwithsravan.dev';

// Rate limiter: Max 5 requests per minute per IP
const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

export const Route = createFileRoute('/api/questionnaire')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // 1. Rate Limiting
          const ip = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown-ip';
                     
          const { isRateLimited } = limiter.check(5, ip);
          
          if (isRateLimited) {
            return new Response(JSON.stringify({ error: 'Too many requests' }), { 
              status: 429,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // 2. Parse FormData
          const formData = await request.formData();
          const answer = formData.get('life_answer')?.toString() || '';
          const name = formData.get('entrant_name')?.toString() || '';
          const email = formData.get('entrant_email')?.toString() || '';

          if (!name || !email || !answer) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // 3. Try Primary Provider (Resend)
          let resendSuccess = false;
          
          if (resend) {
            try {
              // Send Notification Email to Support
              const notificationResult = await resend.emails.send({
                from: `Portfolio <${fromEmail}>`,
                to: [supportEmail],
                replyTo: email,
                subject: `Life Questionnaire Response`,
                html: generateQuestionnaireNotificationTemplate({ name, email, answer }),
              });

              if (notificationResult.error) {
                console.error('Resend notification error:', notificationResult.error);
              } else {
                resendSuccess = true;
                
                // Send Auto-Reply to Visitor
                await resend.emails.send({
                  from: `Sravan Sai Vuppula <${fromEmail}>`,
                  to: [email],
                  replyTo: replyToEmail,
                  subject: 'Thank you for sharing your thoughts',
                  html: generateQuestionnaireAutoReplyTemplate(name),
                });
              }
            } catch (error) {
              console.error('Resend primary failure:', error);
            }
          }

          // 4. Automatic Fallback to Formspree
          if (!resendSuccess && formspreeEndpoint) {
            console.warn('Falling back to Formspree for /api/questionnaire');
            
            // Re-create the form data to send to Formspree
            const fallbackData = new FormData();
            fallbackData.append('life_answer', answer);
            fallbackData.append('entrant_name', name);
            fallbackData.append('entrant_email', email);
            
            const response = await fetch(formspreeEndpoint, {
              method: 'POST',
              body: fallbackData,
              headers: {
                Accept: 'application/json',
              },
            });
            
            if (!response.ok) {
              throw new Error('Formspree fallback failed');
            }
          } else if (!resendSuccess && !formspreeEndpoint) {
            throw new Error('All email providers failed');
          }

          // 5. Return success (Frontend expects 200 OK)
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
          
        } catch (error) {
          console.error('Questionnaire API Error:', error);
          // Return 500 without exposing internal error details to frontend
          return new Response(JSON.stringify({ error: 'Internal server error' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
    },
  },
});
