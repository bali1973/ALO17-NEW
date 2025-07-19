const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'alo17.tr@gmail.com',
    pass: 'Sanane1746Alo17'
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP bağlantı hatası:', error);
  } else {
    console.log('SMTP bağlantısı başarılı!');
  }
}); 