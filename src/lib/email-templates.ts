const PORTFOLIO_LOGO = 'https://raw.githubusercontent.com/sravansai-26/sravan_portfolio/main/src/assets/ssv-name.png';
const LYFSPOT_LOGO = 'https://raw.githubusercontent.com/sravansai-26/sravan_portfolio/main/public/credentials/lyfspot-logo.png';

const styles = {
  main: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f7f9; color: #171717; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;`,
  container: `max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);`,
  header: `padding: 32px 40px; background-color: #ffffff; border-bottom: 1px solid #f0f0f0; text-align: left;`,
  logo: `height: 24px; width: auto; display: block;`,
  logoLarge: `height: 32px; width: auto; display: block;`,
  content: `padding: 40px; background-color: #ffffff;`,
  heading: `font-size: 24px; font-weight: 600; letter-spacing: -0.02em; color: #111111; margin: 0 0 8px 0;`,
  subheading: `font-size: 15px; color: #666666; margin: 0 0 32px 0; line-height: 1.5;`,
  text: `font-size: 15px; line-height: 1.6; color: #333333; margin: 0 0 16px 0;`,
  card: `background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 8px; padding: 24px; margin-bottom: 24px;`,
  cardRow: `margin-bottom: 20px;`,
  cardRowLast: `margin-bottom: 0;`,
  label: `font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; color: #888888; margin: 0 0 6px 0;`,
  value: `font-size: 15px; color: #111111; margin: 0; white-space: pre-wrap; word-break: break-word;`,
  valueLarge: `font-size: 20px; color: #111111; margin: 0; white-space: pre-wrap; font-style: italic; font-weight: 500;`,
  divider: `height: 1px; background-color: #eaeaea; border: none; margin: 32px 0;`,
  footer: `padding: 32px 40px; background-color: #fafafa; border-top: 1px solid #eaeaea; text-align: left;`,
  footerText: `font-size: 13px; color: #888888; line-height: 1.6; margin: 0 0 8px 0;`,
  footerLink: `color: #666666; text-decoration: none; font-weight: 500;`,
  link: `color: #000000; text-decoration: underline; text-decoration-color: #cccccc; text-underline-offset: 2px;`,
  signatureBlock: `margin-top: 32px; padding-top: 24px; border-top: 1px solid #eaeaea;`,
  signatureName: `font-size: 15px; font-weight: 600; color: #111111; margin: 0;`,
  signatureTitle: `font-size: 14px; color: #666666; margin: 2px 0 0 0;`,
  metaContainer: `display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 24px; border-top: 1px dashed #eaeaea;`,
  metaText: `font-size: 12px; color: #999999; margin: 0;`,
};

function getFooter(appName: string, companyName: string, isInternal: boolean = false) {
  return `
    <div style="${styles.footer}">
      <p style="${styles.footerText}">
        &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.<br/>
        ${isInternal ? 'This is an internal system notification.' : 'You are receiving this email because you contacted us through the portfolio.'}
      </p>
      <p style="margin: 0;">
        <a href="https://buildwithsravan.dev" style="${styles.footerLink}">${appName}</a>
      </p>
    </div>
  `;
}

export function generateContactNotificationTemplate(data: { name: string; email: string; subject: string; message: string; ip?: string }) {
  const appName = process.env.APP_NAME || 'Portfolio';
  const companyName = process.env.COMPANY_NAME || 'LYFSpot';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <body style="${styles.main}">
        <div style="${styles.container}">
          <div style="${styles.header}">
            <img src="${LYFSPOT_LOGO}" alt="${companyName}" style="${styles.logo}" />
          </div>
          <div style="${styles.content}">
            <h1 style="${styles.heading}">New Contact Request</h1>
            <p style="${styles.subheading}">A new message was submitted via the portfolio contact form.</p>
            
            <div style="${styles.card}">
              <div style="${styles.cardRow}">
                <p style="${styles.label}">Sender</p>
                <p style="${styles.value}"><strong>${data.name}</strong> &middot; <a href="mailto:${data.email}" style="${styles.link}">${data.email}</a></p>
              </div>
              
              <div style="${styles.cardRow}">
                <p style="${styles.label}">Subject</p>
                <p style="${styles.value}">${data.subject}</p>
              </div>
              
              <div style="${styles.cardRowLast}">
                <p style="${styles.label}">Message</p>
                <p style="${styles.value}">${data.message}</p>
              </div>
            </div>
            
            <div style="${styles.metaContainer}">
              <p style="${styles.metaText}">Timestamp: ${new Date().toLocaleString()}</p>
              ${data.ip ? `<p style="${styles.metaText}">IP: ${data.ip}</p>` : ''}
            </div>
          </div>
          ${getFooter(appName, companyName, true)}
        </div>
      </body>
    </html>
  `;
}

export function generateContactAutoReplyTemplate(name: string) {
  const appName = process.env.APP_NAME || 'Portfolio';
  const companyName = process.env.COMPANY_NAME || 'LYFSpot';
  const fromEmail = process.env.FROM_EMAIL || 'contact@buildwithsravan.dev';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <body style="${styles.main}">
        <div style="${styles.container}">
          <div style="${styles.header}">
            <img src="${PORTFOLIO_LOGO}" alt="${appName}" style="${styles.logoLarge}" />
          </div>
          <div style="${styles.content}">
            <h1 style="${styles.heading}">Message Received</h1>
            <p style="${styles.text}">Hello ${name},</p>
            <p style="${styles.text}">Thank you for reaching out. This is a confirmation that your message has been successfully delivered to my inbox.</p>
            <p style="${styles.text}">I review all messages personally and will get back to you as soon as possible regarding your inquiry.</p>
            
            <div style="${styles.signatureBlock}">
              <p style="${styles.signatureName}">Sravan Sai Vuppula</p>
              <p style="${styles.signatureTitle}">Founder, ${companyName}</p>
              <p style="${styles.signatureTitle}"><a href="mailto:${fromEmail}" style="${styles.link}">${fromEmail}</a></p>
            </div>
          </div>
          ${getFooter(appName, companyName, false)}
        </div>
      </body>
    </html>
  `;
}

export function generateQuestionnaireNotificationTemplate(data: { name: string; email: string; answer: string }) {
  const appName = process.env.APP_NAME || 'Portfolio';
  const companyName = process.env.COMPANY_NAME || 'LYFSpot';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <body style="${styles.main}">
        <div style="${styles.container}">
          <div style="${styles.header}">
            <img src="${LYFSPOT_LOGO}" alt="${companyName}" style="${styles.logo}" />
          </div>
          <div style="${styles.content}">
            <h1 style="${styles.heading}">Life Questionnaire Response</h1>
            <p style="${styles.subheading}">A new thought was shared for the LYFSpot Creative audition.</p>
            
            <div style="${styles.card}">
              <div style="${styles.cardRow}">
                <p style="${styles.label}">The Word / Thought</p>
                <p style="${styles.valueLarge}">"${data.answer}"</p>
              </div>
              <hr style="${styles.divider}" />
              <div style="${styles.cardRow}">
                <p style="${styles.label}">Entrant Name</p>
                <p style="${styles.value}">${data.name}</p>
              </div>
              
              <div style="${styles.cardRowLast}">
                <p style="${styles.label}">Entrant Email</p>
                <p style="${styles.value}"><a href="mailto:${data.email}" style="${styles.link}">${data.email}</a></p>
              </div>
            </div>
            
            <div style="${styles.metaContainer}">
              <p style="${styles.metaText}">Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
          ${getFooter(appName, companyName, true)}
        </div>
      </body>
    </html>
  `;
}

export function generateQuestionnaireAutoReplyTemplate(name: string) {
  const appName = process.env.APP_NAME || 'Portfolio';
  const companyName = process.env.COMPANY_NAME || 'LYFSpot';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <body style="${styles.main}">
        <div style="${styles.container}">
          <div style="${styles.header}">
            <img src="${LYFSPOT_LOGO}" alt="${companyName}" style="${styles.logoLarge}" />
          </div>
          <div style="${styles.content}">
            <h1 style="${styles.heading}">Your thought is heard.</h1>
            <p style="${styles.text}">Hello ${name},</p>
            <p style="${styles.text}">Your response to the Life Questionnaire has been safely received and logged.</p>
            <p style="${styles.text}">I deeply appreciate you taking the time to share your raw instinct. There is no formula here—only honesty. Each submission is read and reviewed personally.</p>
            <p style="${styles.text}">If your response aligns with our current creative explorations, you will receive a personal invitation to collaborate inside the creative wing of ${companyName}.</p>
            
            <div style="${styles.signatureBlock}">
              <p style="${styles.signatureName}">Sravan Sai Vuppula</p>
              <p style="${styles.signatureTitle}">Founder, ${companyName}</p>
            </div>
          </div>
          ${getFooter(appName, companyName, false)}
        </div>
      </body>
    </html>
  `;
}
