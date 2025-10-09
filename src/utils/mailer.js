import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: config.MAIL.user, pass: config.MAIL.pass },
});

transporter.verify()
  .then(() => console.log('📨 Gmail SMTP listo'))
  .catch(err => console.error('❌ Error SMTP:', err.message));

export async function sendPasswordResetEmail(to, resetUrl, name = '') {
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.4">
      <h2>Recuperar contraseña</h2>
      <p>Hola ${name || ''}, recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Este enlace expira en <strong>1 hora</strong>.</p>
      <p style="margin:24px 0">
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 18px;border-radius:8px;background:#0d6efd;color:#fff;text-decoration:none">
          Restablecer contraseña
        </a>
      </p>
      <p>Si no fuiste vos, ignorá este correo.</p>
    </div>
  `;
  await transporter.sendMail({
    from: config.MAIL.from || config.MAIL.user,
    to,
    subject: 'Restablecer contraseña',
    html,
  });
}


//(async () => {
//  try {
//    await transporter.sendMail({
//      from: config.MAIL.from,
//      to: config.MAIL.user, // te lo mandás a vos
//      subject: 'Prueba SMTP desde Nodemailer',
//      text: 'Todo ok con Gmail SMTP ✅'
//    });
//    console.log('Correo de prueba enviado.');
//  } catch (err) {
//    console.error('Error al enviar prueba:', err);
//  }
//})();

