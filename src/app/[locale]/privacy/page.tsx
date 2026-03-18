export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream px-4 pt-24">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="mb-10 text-4xl font-bold text-dark md:text-5xl">Privacy Policy</h1>

        <p className="mb-8 text-base leading-relaxed text-muted">
          We are committed to protecting your privacy. This privacy policy explains how we collect and use your personal data.
        </p>

        <div className="space-y-8 text-base leading-relaxed text-muted">

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">1. Data We Collect</h2>
            <p>We collect personal data such as name, company name, email, phone number, and order details via forms on our website.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">2. Purpose of Processing</h2>
            <p>We use your data to process orders, respond to inquiries, and send relevant service updates.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">3. Data Sharing</h2>
            <p>We do not share your personal data with third parties, except where required for order fulfillment or by law.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">4. Data Storage</h2>
            <p>Your data is securely stored and retained only as long as necessary for the purposes above.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">5. Cookies</h2>
            <p>We use cookies to enhance your experience and analyze website usage.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">6. Your Rights</h2>
            <p>You may request access to, correction, or deletion of your data by contacting us at <a href="mailto:orders@thesandwichbar.nl" className="underline hover:text-dark transition-colors">orders@thesandwichbar.nl</a>.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">7. Contact Information</h2>
            <address className="not-italic">
              <p>The Sandwich Bar Nassaukade B.V.</p>
              <p>Nassaukade 378 H</p>
              <p>1054 AD Amsterdam</p>
              <p className="mt-2">KVK Number: 81264782</p>
              <p>VAT Number: NL81264782B01</p>
              <p>Email: <a href="mailto:orders@thesandwichbar.nl" className="underline hover:text-dark transition-colors">orders@thesandwichbar.nl</a></p>
            </address>
          </section>

        </div>
      </div>
    </main>
  )
}
