import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)


def send_scholarship_alert(
    recipient_email: str,
    scholarships: List[Dict[str, Any]],
    user_name: str = "Student"
) -> bool:
    """Send scholarship alert email to user."""
    
    try:
        # Email configuration (you'll need to set these in .env)
        sender_email = settings.SMTP_USER
        sender_password = settings.SMTP_PASSWORD
        
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"🎓 New Scholarships Found - {len(scholarships)} Opportunities!"
        message["From"] = sender_email
        message["To"] = recipient_email
        
        # HTML email body
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1976d2;">Hello {user_name}! 👋</h2>
            <p>We found <strong>{len(scholarships)}</strong> new scholarship opportunities that match your interests:</p>
            
            <div style="margin: 20px 0;">
        """
        
        for i, scholarship in enumerate(scholarships[:5], 1):  # Limit to 5
            html += f"""
            <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px;">
                <h3 style="color: #333; margin: 0 0 10px 0;">{i}. {scholarship['title']}</h3>
                <p style="margin: 5px 0;"><strong>Amount:</strong> {scholarship.get('amount', 'Not specified')}</p>
                <p style="margin: 5px 0;"><strong>Deadline:</strong> {scholarship.get('deadline', 'TBD')}</p>
                <p style="margin: 5px 0;"><strong>Country:</strong> {scholarship.get('country', 'Various')}</p>
                <p style="margin: 5px 0;">{scholarship.get('description', '')[:200]}...</p>
            </div>
            """
        
        html += """
            </div>
            
            <p>
                <a href="http://localhost:3001/scholarships" 
                   style="background: #1976d2; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; display: inline-block;">
                    View All Scholarships
                </a>
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
                You're receiving this email because you subscribed to scholarship alerts on Masters Abroad Platform.
                <br>To unsubscribe, visit your profile settings.
            </p>
          </body>
        </html>
        """
        
        part = MIMEText(html, "html")
        message.attach(part)
        
        # Send email (using Gmail SMTP - configure in .env)
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, message.as_string())
        
        logger.info(f"✅ Sent scholarship alert to {recipient_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error sending email: {e}")
        return False
