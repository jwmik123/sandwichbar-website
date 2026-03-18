import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, name, email, phone, deliveryDate, deliveryTime, address, postalCode } = body

    if (!companyName || !name || !email || !phone || !deliveryDate || !deliveryTime || !address || !postalCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'The Sandwich Bar <noreply@thesandwichbar.nl>',
      to: 'orders@thesandwichbar.nl',
      replyTo: email,
      subject: `Nieuwe proeflunch box aanvraag: ${companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #4D343F; margin-bottom: 24px;">Nieuwe gratis proeflunch box aanvraag</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E; width: 40%;">Bedrijfsnaam</td>
              <td style="padding: 10px 0; color: #382628;">${companyName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E;">Naam</td>
              <td style="padding: 10px 0; color: #382628;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E;">Email</td>
              <td style="padding: 10px 0; color: #382628;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E;">Telefoon</td>
              <td style="padding: 10px 0; color: #382628;">${phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E;">Bezorgdatum</td>
              <td style="padding: 10px 0; color: #382628;">${deliveryDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E;">Bezorgtijd</td>
              <td style="padding: 10px 0; color: #382628;">${deliveryTime}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E;">Adres</td>
              <td style="padding: 10px 0; color: #382628;">${address}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #685D5E;">Postcode</td>
              <td style="padding: 10px 0; color: #382628;">${postalCode}</td>
            </tr>
          </table>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to send catering form email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
