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
    from: `"Le Délice Traiteur" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Nous avons bien reçu votre demande",
    html: `
      <div style="font-family:Arial,sans-serif;background:#f9f9f9;padding:40px">
        <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px">

          <h2 style="color:#d97706">Merci pour votre message ${name} !</h2>

          <p>
          Nous avons bien reçu votre demande concernant votre événement.
          Notre équipe va l'examiner et vous répondre très rapidement.
          </p>

          <div style="background:#fff7ed;padding:15px;border-radius:8px;margin:20px 0">
            <strong>Résumé de votre demande :</strong>
            <p>Date événement : ${eventDate || "-"}</p>
            <p>Nombre invités : ${guests || "-"}</p>
          </div>

          <p>
          Si votre demande est urgente vous pouvez aussi nous appeler :
          </p>

          <p style="font-size:18px;font-weight:bold;color:#d97706">
          +33 6 66 03 03 42
          </p>

          <hr style="margin:30px 0"/>

          <p style="font-size:14px;color:#777">
          Le Délice Traiteur<br>
          4 Chemin des princes<br>
          78870 Bailly
          </p>

        </div>
      </div>
    `,
  });
}