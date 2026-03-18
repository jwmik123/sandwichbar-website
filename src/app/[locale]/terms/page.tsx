export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cream px-4 pt-24">
      <div className="mx-auto max-w-3xl py-16">
        <h1 className="mb-10 text-4xl font-bold text-dark md:text-5xl">Terms and Conditions</h1>

        <div className="space-y-8 text-base leading-relaxed text-muted">

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">1. Company Information</h2>
            <p>This website is operated by The Sandwich Bar Nassaukade B.V., registered with the Dutch Chamber of Commerce under number 81264782, with VAT ID NL81264782B01.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">2. Services</h2>
            <p>We provide catering services to businesses, including but not limited to lunches, buffets, and event catering.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">3. Orders and Payment</h2>
            <p>Orders must be placed at least 24 hours in advance. Payments can be made via bank transfer (IBAN: NL05 INGB 0006 8499 73). All prices are listed in EUR, excluding VAT unless otherwise stated.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">4. Delivery</h2>
            <p>Deliveries are made within Amsterdam and surrounding areas. Free delivery is available for orders above €150,- (some areas excluded: 1026–1028, 1035, 1101–1109). Specific delivery times are agreed upon when ordering. We reserve the right to cancel or delay orders due to unforeseen circumstances.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">5. Cancellation and Refunds</h2>
            <p>Due to the perishable nature of our products, cancellations must be made at least 24 hours in advance. Refunds are subject to approval and depend on the timing of cancellation.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">6. Liability</h2>
            <p>We are not liable for any damages resulting from allergies or misuse of our products. Customers are responsible for providing accurate dietary information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">7. Complaints</h2>
            <p>Complaints must be reported within 24 hours after delivery via <a href="mailto:orders@thesandwichbar.nl" className="underline hover:text-dark transition-colors">orders@thesandwichbar.nl</a>. We aim to respond within 2 business days.</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-dark">8. Applicable Law</h2>
            <p>Dutch law applies. Any disputes will be handled by the competent court in Amsterdam.</p>
          </section>

        </div>
      </div>
    </main>
  )
}
