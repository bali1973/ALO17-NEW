import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
  return info;
}

// Email notification service
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text: string;
}

// Email templates
export const emailTemplates = {
  welcome: (userName: string): EmailTemplate => ({
    subject: 'Alo17\'e Hoş Geldiniz!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Alo17'e Hoş Geldiniz!</h2>
        <p>Merhaba ${userName},</p>
        <p>Alo17 ailesine katıldığınız için teşekkür ederiz. Artık ilanlarınızı yayınlayabilir ve diğer kullanıcılarla iletişime geçebilirsiniz.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Başlamak için:</h3>
          <ul>
            <li>Profilinizi tamamlayın</li>
            <li>İlk ilanınızı yayınlayın</li>
            <li>Diğer kullanıcıların ilanlarını keşfedin</li>
          </ul>
        </div>
        <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,
    text: `Alo17'e Hoş Geldiniz!\n\nMerhaba ${userName},\n\nAlo17 ailesine katıldığınız için teşekkür ederiz. Artık ilanlarınızı yayınlayabilir ve diğer kullanıcılarla iletişime geçebilirsiniz.\n\nBaşlamak için:\n- Profilinizi tamamlayın\n- İlk ilanınızı yayınlayın\n- Diğer kullanıcıların ilanlarını keşfedin\n\nHerhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.\n\nSaygılarımızla,\nAlo17 Ekibi`
  }),

  listingApproved: (userName: string, listingTitle: string): EmailTemplate => ({
    subject: 'İlanınız Onaylandı',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">İlanınız Onaylandı!</h2>
        <p>Merhaba ${userName},</p>
        <p><strong>"${listingTitle}"</strong> başlıklı ilanınız başarıyla onaylanmıştır ve artık yayındadır.</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <p style="margin: 0;"><strong>İlan Detayları:</strong></p>
          <p style="margin: 10px 0 0 0;">Başlık: ${listingTitle}</p>
          <p style="margin: 5px 0;">Durum: Yayında</p>
        </div>
        <p>İlanınızı görüntülemek ve düzenlemek için profilinizi ziyaret edebilirsiniz.</p>
        <p>İyi satışlar dileriz!</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,
    text: `İlanınız Onaylandı!\n\nMerhaba ${userName},\n\n"${listingTitle}" başlıklı ilanınız başarıyla onaylanmıştır ve artık yayındadır.\n\nİlan Detayları:\n- Başlık: ${listingTitle}\n- Durum: Yayında\n\nİlanınızı görüntülemek ve düzenlemek için profilinizi ziyaret edebilirsiniz.\n\nİyi satışlar dileriz!\n\nSaygılarımızla,\nAlo17 Ekibi`
  }),

  listingRejected: (userName: string, listingTitle: string, reason: string): EmailTemplate => ({
    subject: 'İlanınız Onaylanmadı',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">İlanınız Onaylanmadı</h2>
        <p>Merhaba ${userName},</p>
        <p><strong>"${listingTitle}"</strong> başlıklı ilanınız onay kriterlerimizi karşılamadığı için onaylanmamıştır.</p>
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p style="margin: 0;"><strong>Onaylanmama Nedeni:</strong></p>
          <p style="margin: 10px 0 0 0;">${reason}</p>
        </div>
        <p>İlanınızı düzenleyip tekrar gönderebilirsiniz. Sorularınız için bizimle iletişime geçebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,
    text: `İlanınız Onaylanmadı\n\nMerhaba ${userName},\n\n"${listingTitle}" başlıklı ilanınız onay kriterlerimizi karşılamadığı için onaylanmamıştır.\n\nOnaylanmama Nedeni:\n${reason}\n\nİlanınızı düzenleyip tekrar gönderebilirsiniz. Sorularınız için bizimle iletişime geçebilirsiniz.\n\nSaygılarımızla,\nAlo17 Ekibi`
  }),

  newMessage: (userName: string, senderName: string, listingTitle: string): EmailTemplate => ({
    subject: 'Yeni Mesajınız Var',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Yeni Mesajınız Var</h2>
        <p>Merhaba ${userName},</p>
        <p><strong>${senderName}</strong> kullanıcısından yeni bir mesaj aldınız.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>İlan:</strong> ${listingTitle}</p>
          <p style="margin: 10px 0 0 0;"><strong>Gönderen:</strong> ${senderName}</p>
        </div>
        <p>Mesajınızı okumak için profilinizi ziyaret edebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,
    text: `Yeni Mesajınız Var\n\nMerhaba ${userName},\n\n${senderName} kullanıcısından yeni bir mesaj aldınız.\n\nİlan: ${listingTitle}\nGönderen: ${senderName}\n\nMesajınızı okumak için profilinizi ziyaret edebilirsiniz.\n\nSaygılarımızla,\nAlo17 Ekibi`
  }),

  premiumExpiring: (userName: string, daysLeft: number): EmailTemplate => ({
    subject: 'Premium Üyeliğiniz Yakında Sona Erecek',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Premium Üyeliğiniz Yakında Sona Erecek</h2>
        <p>Merhaba ${userName},</p>
        <p>Premium üyeliğinizin ${daysLeft} gün sonra sona ereceğini hatırlatmak isteriz.</p>
        <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0;"><strong>Premium Avantajları:</strong></p>
          <ul style="margin: 10px 0 0 0;">
            <li>Öncelikli ilan gösterimi</li>
            <li>Gelişmiş arama filtreleri</li>
            <li>İstatistikler ve analitikler</li>
            <li>Öncelikli müşteri desteği</li>
          </ul>
        </div>
        <p>Premium avantajlarından yararlanmaya devam etmek için üyeliğinizi yenileyebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,
    text: `Premium Üyeliğiniz Yakında Sona Erecek\n\nMerhaba ${userName},\n\nPremium üyeliğinizin ${daysLeft} gün sonra sona ereceğini hatırlatmak isteriz.\n\nPremium Avantajları:\n- Öncelikli ilan gösterimi\n- Gelişmiş arama filtreleri\n- İstatistikler ve analitikler\n- Öncelikli müşteri desteği\n\nPremium avantajlarından yararlanmaya devam etmek için üyeliğinizi yenileyebilirsiniz.\n\nSaygılarımızla,\nAlo17 Ekibi`
  }),

  passwordReset: (userName: string, resetLink: string): EmailTemplate => ({
    subject: 'Şifre Sıfırlama Talebi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Şifre Sıfırlama</h2>
        <p>Merhaba ${userName},</p>
        <p>Hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Şifremi Sıfırla
          </a>
        </div>
        <p>Bu bağlantı 1 saat süreyle geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        <p>Saygılarımızla,<br>Alo17 Ekibi</p>
      </div>
    `,
    text: `Şifre Sıfırlama\n\nMerhaba ${userName},\n\nHesabınız için şifre sıfırlama talebinde bulundunuz.\n\nŞifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n${resetLink}\n\nBu bağlantı 1 saat süreyle geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.\n\nSaygılarımızla,\nAlo17 Ekibi`
  })
};

// Email service class
export class EmailService {
  private static instance: EmailService;
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Enable/disable email notifications
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isEmailEnabled(): boolean {
    return this.isEnabled;
  }

  // Send email notification
  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('📧 Email notifications disabled, skipping:', emailData.subject);
      return true;
    }

    try {
      console.log('📧 Sending email to:', emailData.to, 'Subject:', emailData.subject);
      
      // In a real application, you would integrate with an email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Nodemailer with SMTP
      
      // For now, we'll simulate email sending
      await this.simulateEmailSending(emailData);
      
      console.log('✅ Email sent successfully to:', emailData.to);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const template = emailTemplates.welcome(userName);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Send listing approval notification
  async sendListingApprovedEmail(userEmail: string, userName: string, listingTitle: string): Promise<boolean> {
    const template = emailTemplates.listingApproved(userName, listingTitle);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Send listing rejection notification
  async sendListingRejectedEmail(userEmail: string, userName: string, listingTitle: string, reason: string): Promise<boolean> {
    const template = emailTemplates.listingRejected(userName, listingTitle, reason);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Send new message notification
  async sendNewMessageEmail(userEmail: string, userName: string, senderName: string, listingTitle: string): Promise<boolean> {
    const template = emailTemplates.newMessage(userName, senderName, listingTitle);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Send premium expiration warning
  async sendPremiumExpiringEmail(userEmail: string, userName: string, daysLeft: number): Promise<boolean> {
    const template = emailTemplates.premiumExpiring(userName, daysLeft);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(userEmail: string, userName: string, resetLink: string): Promise<boolean> {
    const template = emailTemplates.passwordReset(userName, resetLink);
    return this.sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  // Simulate email sending (replace with actual email service)
  private async simulateEmailSending(emailData: EmailData): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log email details for development
    console.log('📧 Email Details:', {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString()
    });
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance(); 