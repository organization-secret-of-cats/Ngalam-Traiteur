import { NextRequest, NextResponse } from "next/server";


interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  guests?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    const { name, email, phone, eventDate, guests, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Les champs nom, email et message sont obligatoires" },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // const { data, error } = await supabase.from("contact_requests").insert([
    //   {
    //     name: name.trim(),
    //     email: email.trim().toLowerCase(),
    //     phone: phone?.trim() || null,
    //     event_date: eventDate || null,
    //     guests: guests ? parseInt(guests) : null,
    //     message: message.trim(),
    //     status: "new",
    //     created_at: new Date().toISOString(),
    //   },
    // ]);

    // if (error) {
    //   console.error("Database error:", error);
    //   return NextResponse.json(
    //     { error: "Erreur lors de l'enregistrement du message" },
    //     { status: 500 }
    //   );
    // }

    await sendEmail(name, email, message, eventDate, guests, phone);

    return NextResponse.json(
      { success: true, message: "Demande enregistrée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
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
  try {
    // const apiUrl = `${supabaseUrl}/functions/v1/send-contact-email`;

    // await fetch(apiUrl, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${supabaseServiceKey}`,
    //   },
    //   body: JSON.stringify({
    //     name,
    //     email,
    //     message,
    //     eventDate,
    //     guests,
    //     phone,
    //   }),
    // });
  } catch (error) {
    console.error("Email sending error:", error);
  }
}
