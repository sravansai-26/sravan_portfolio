import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { Resend } from "resend";
import rateLimit from "../../lib/rate-limit";
import {
  generateStoryLabNotificationTemplate,
  generateStoryLabAutoReplyTemplate,
} from "../../lib/email-templates";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const formspreeEndpoint = process.env.VITE_FORMSPREE_STORYLAB || process.env.VITE_FORMSPREE_CONTACT;
const storyLabEmail = process.env.STORYLAB_OWNER_EMAIL || "storylab@buildwithsravan.dev";
const fromEmail = process.env.CONTACT_FROM_EMAIL || "contact@buildwithsravan.dev";
const replyToEmail = process.env.STORYLAB_REPLY_TO_EMAIL || "storylab@buildwithsravan.dev";

// Rate limiter: Max 5 requests per minute per IP
const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

export const Route = createFileRoute("/api/story-lab")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // 1. Rate Limiting
          const ip =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown-ip";

          const { isRateLimited } = limiter.check(5, ip);

          if (isRateLimited) {
            return new Response(JSON.stringify({ error: "Too many requests" }), {
              status: 429,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 2. Parse FormData
          const formData = await request.formData();
          const category = formData.get("category")?.toString() || "";
          const title = formData.get("title")?.toString() || "";
          const description = formData.get("description")?.toString() || "";
          const nickname = formData.get("nickname")?.toString() || "";
          const parentEmail = formData.get("parentEmail")?.toString() || "";
          const hasConsent = formData.get("hasConsent")?.toString() === "true";

          if (!category || !description || !parentEmail || !hasConsent) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Create a reference ID
          const referenceId = `SL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
          const safeTitle = title ? title.slice(0, 50) : "Untitled";

          // 3. Try Primary Provider (Resend)
          let resendSuccess = false;

          if (resend) {
            try {
              // Send Notification Email to Owner
              const notificationResult = await resend.emails.send({
                from: `The Story Lab <${fromEmail}>`,
                to: [storyLabEmail],
                replyTo: parentEmail,
                subject: `[Story Lab] New Character Idea — ${safeTitle}`,
                html: generateStoryLabNotificationTemplate({ 
                  category, 
                  title, 
                  description, 
                  nickname, 
                  hasConsent, 
                  ip, 
                  referenceId 
                }),
              });

              if (notificationResult.error) {
                console.error("Resend notification error (Story Lab):", notificationResult.error);
              } else {
                resendSuccess = true;

                // Send Auto-Reply to Parent/Guardian
                await resend.emails.send({
                  from: `The Story Lab <${fromEmail}>`,
                  to: [parentEmail],
                  replyTo: replyToEmail,
                  subject: "Every great story starts with an idea",
                  html: generateStoryLabAutoReplyTemplate(nickname),
                });
              }
            } catch (error) {
              console.error("Resend primary failure (Story Lab):", error);
            }
          }

          // 4. Automatic Fallback to Formspree
          if (!resendSuccess && formspreeEndpoint) {
            console.warn("Falling back to Formspree for /api/story-lab");

            // Re-create the form data to send to Formspree
            const fallbackData = new FormData();
            fallbackData.append("subject", `[Story Lab] New Character Idea — ${safeTitle}`);
            fallbackData.append("email", parentEmail); // Important for Formspree to know who to reply to
            fallbackData.append("message", `
Category: ${category}
Title: ${title}
Description: ${description}
Nickname: ${nickname}
Consent Provided: ${hasConsent ? "Yes" : "No"}
Reference ID: ${referenceId}
            `.trim());

            const response = await fetch(formspreeEndpoint, {
              method: "POST",
              body: fallbackData,
              headers: {
                Accept: "application/json",
              },
            });

            if (!response.ok) {
              throw new Error("Formspree fallback failed");
            }
          } else if (!resendSuccess && !formspreeEndpoint) {
            throw new Error("All email providers failed");
          }

          // 5. Return success (Frontend expects 200 OK)
          return new Response(JSON.stringify({ success: true, referenceId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Story Lab API Error:", error);
          // Return 500 without exposing internal error details to frontend
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
