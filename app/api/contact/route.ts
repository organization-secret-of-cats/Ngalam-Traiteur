import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, message, eventDate, guests, phone } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont obligatoires" },
        { status: 400 }
      );
    }

    await sendEmail(name, email, message, eventDate, guests, phone);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

async function sendEmail(
  name: string,
  email: string,
  message: string,
  eventDate?: string,
  guests?: string,
  phone?: string
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  /* EMAIL POUR VOUS */

  await transporter.sendMail({
    from: `"Site Web" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Nouvelle demande - ${name}`,
    html: `
      <h2>Nouvelle demande depuis le site</h2>

      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${phone || "-"}</p>
      <p><strong>Date événement:</strong> ${eventDate || "-"}</p>
      <p><strong>Nombre invités:</strong> ${guests || "-"}</p>

      <h3>Message:</h3>
      <p>${message}</p>
    `,
  });

  /* EMAIL POUR LE CLIENT */

      await transporter.sendMail({
      from: `"Ngalam Traiteur" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✨ Demande reçue — Ngalam Traiteur`,
      html: `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Confirmation de demande</title>
    </head>
    <body style="margin:0;padding:0;background-color:#fdf8f0;font-family:'Georgia',serif;">
    
      <!-- Wrapper -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f0;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#92400e 0%,#d97706 60%,#f59e0b 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#fde68a;font-family:Arial,sans-serif;">Traiteur & Événements</p>
                  <h1 style="margin:0;font-size:32px;font-weight:normal;color:#ffffff;letter-spacing:0.04em;">Ngalam Traiteur</h1>
                  <div style="margin:16px auto 0;width:48px;height:2px;background:rgba(255,255,255,0.4);border-radius:2px;"></div>
                </td>
              </tr>
    
              <!-- Body card -->
              <tr>
                <td style="background:#ffffff;padding:40px 40px 32px;border-left:1px solid #fde68a22;border-right:1px solid #fde68a22;">
    
                  <!-- Greeting -->
                  <h2 style="margin:0 0 8px;font-size:24px;font-weight:normal;color:#92400e;">Merci, ${name}&nbsp;!</h2>
                  <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#57534e;font-family:Arial,sans-serif;">
                    Nous avons bien reçu votre demande. Notre équipe l'examine et vous répondra dans les plus brefs délais.
                  </p>
    
                  <!-- Divider -->
                  <div style="height:1px;background:linear-gradient(to right,transparent,#fcd34d,transparent);margin:0 0 28px;"></div>
    
                  <!-- Summary box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:28px;">
                    <tr>
                      <td style="padding:20px 24px;">
                        <p style="margin:0 0 14px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b45309;font-family:Arial,sans-serif;">Résumé de votre demande</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding:6px 0;border-bottom:1px solid #fde68a;">
                              <span style="font-size:13px;color:#78716c;font-family:Arial,sans-serif;">📅&nbsp; Date de l'événement</span>
                            </td>
                            <td align="right" style="padding:6px 0;border-bottom:1px solid #fde68a;">
                              <strong style="font-size:13px;color:#1c1917;font-family:Arial,sans-serif;">${eventDate || "—"}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0;">
                              <span style="font-size:13px;color:#78716c;font-family:Arial,sans-serif;">👥&nbsp; Nombre de convives</span>
                            </td>
                            <td align="right" style="padding:6px 0;">
                              <strong style="font-size:13px;color:#1c1917;font-family:Arial,sans-serif;">${guests || "—"}</strong>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
    
                  <!-- Urgent contact -->
                  <p style="margin:0 0 14px;font-size:14px;color:#57534e;font-family:Arial,sans-serif;">
                    Pour toute demande urgente, n'hésitez pas à nous contacter directement :
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border-radius:10px;margin-bottom:32px;">
                    <tr>
                      <td style="padding:16px 24px;">
                        <p style="margin:0 0 6px;font-size:14px;color:#1c1917;font-family:Arial,sans-serif;">
                          📞&nbsp; <a href="tel:+33666030342" style="color:#d97706;text-decoration:none;font-weight:bold;">+33 6 66 03 03 42</a>
                        </p>
                        <p style="margin:0 0 6px;font-size:14px;color:#1c1917;font-family:Arial,sans-serif;">
                          📞&nbsp; <a href="tel:+33626767523" style="color:#d97706;text-decoration:none;font-weight:bold;">+33 6 26 76 75 23</a>
                        </p>
                        <p style="margin:0;font-size:14px;color:#1c1917;font-family:Arial,sans-serif;">
                          ✉️&nbsp; <a href="mailto:ndiayeaboubakry@gmail.com" style="color:#d97706;text-decoration:none;font-weight:bold;">ndiayeaboubakry@gmail.com</a>
                        </p>
                      </td>
                    </tr>
                  </table>
    
                  <!-- CTA -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:ndiayeaboubakry@gmail.com"
                          style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:0.05em;padding:14px 36px;border-radius:50px;box-shadow:0 4px 14px rgba(217,119,6,0.35);">
                          Répondre à cet email
                        </a>
                      </td>
                    </tr>
                  </table>
    
                </td>
              </tr>
    
              <!-- Footer -->
              <tr>
                <td style="background:#1c1917;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:13px;color:#d6d3d1;font-family:Arial,sans-serif;letter-spacing:0.03em;">Ngalam Traiteur</p>
                  <p style="margin:0;font-size:12px;color:#78716c;font-family:Arial,sans-serif;">4 Chemin des princes · 78870 Bailly, France</p>
                  <div style="margin:16px auto 0;width:32px;height:1px;background:#44403c;"></div>
                  <p style="margin:12px 0 0;font-size:11px;color:#57534e;font-family:Arial,sans-serif;">
                    Vous recevez cet email car vous avez soumis une demande via notre site.
                  </p>
                </td>
              </tr>
    
            </table>
          </td>
        </tr>
      </table>
    
    </body>
    </html>
      `,
    });
}