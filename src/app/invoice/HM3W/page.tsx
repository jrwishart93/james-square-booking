import type { Metadata } from "next";
import styles from "./invoice.module.css";

export const metadata: Metadata = {
  title: "Invoice #HM3W | James Square Accommodation",
  description: "Accommodation invoice for David Harant's two-night stay, 23–25 August 2026.",
  robots: {
    index: false,
    follow: false,
  },
};

const lineItems = [
  {
    description: "Guest bedroom accommodation",
    details: "2-night private guest-bedroom stay",
    amount: "£540.95",
  },
  {
    description: "Edinburgh Visitor Levy (5%)",
    details: "Included within the accommodation price",
    amount: "£27.05",
  },
  {
    description: "Short-stay cleaning fee",
    details: "One-time cleaning charge",
    amount: "£20.00",
  },
  {
    description: "Airbnb guest service fee",
    details: "Shown by Airbnb as £0.00",
    amount: "£0.00",
  },
];

export default function InvoicePage() {
  return (
    <div className={styles.portal}>
      <article className={styles.invoice} aria-labelledby="invoice-title">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>James Square · Edinburgh</p>
            <h1 id="invoice-title">James Square Accommodation Invoice</h1>
          </div>
          <div className={styles.reference}>
            <span>Reference</span>
            <strong>#HM3W</strong>
          </div>
        </header>

        <section className={styles.recipient} aria-labelledby="recipient-heading">
          <div>
            <p id="recipient-heading" className={styles.label}>Recipient</p>
            <p className={styles.recipientName}>David Harant</p>
            <p>Powertica Materials a.s.</p>
          </div>
          <dl className={styles.meta}>
            <div><dt>Invoice date</dt><dd>2 August 2026</dd></div>
            <div><dt>Stay duration</dt><dd>2 nights</dd></div>
            <div><dt>Booking channel</dt><dd>Airbnb</dd></div>
            <div><dt>Confirmation</dt><dd>HM3WSQKX92</dd></div>
          </dl>
        </section>

        <section className={styles.stay} aria-labelledby="stay-heading">
          <div className={styles.stayIntro}>
            <p className={styles.label}>Reservation dates</p>
            <h2 id="stay-heading">23–25 August 2026</h2>
            <p>Two-night accommodation at James Square, Edinburgh.</p>
          </div>
          <div className={styles.dateCards}>
            <div className={styles.dateCard}>
              <span>Check-in</span>
              <strong><b>23</b> August 2026</strong>
            </div>
            <div className={styles.nightCount} aria-label="2 nights">
              <span>2 nights</span>
              <svg aria-hidden="true" viewBox="0 0 80 12" fill="none">
                <path d="M1 6h78M74 1l5 5-5 5" />
              </svg>
            </div>
            <div className={styles.dateCard}>
              <span>Check-out</span>
              <strong><b>25</b> August 2026</strong>
            </div>
          </div>
        </section>

        <section className={styles.summary} aria-labelledby="summary-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.label}>Invoice summary</p>
              <h2 id="summary-heading">Accommodation details</h2>
            </div>
            <span className={styles.status}>Paid in full</span>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr><th>Description</th><th>Details</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.description}>
                    <td>{item.description}</td>
                    <td>{item.details}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.totals}>
            <div><span>Total paid through Airbnb</span><strong>£588.00 GBP</strong></div>
            <div className={styles.balance}><span>Balance due</span><strong>£0.00</strong></div>
          </div>
        </section>

        <footer className={styles.actions}>
          <div>
            <p className={styles.label}>Your invoice is ready</p>
            <p>Download and retain the final PDF invoice for your records.</p>
          </div>
          <a
            className={styles.download}
            href="/docs/survey/accommodation_invoice_david_harant_final.pdf"
            download="accommodation_invoice_david_harant_final.pdf"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" />
            </svg>
            Download final invoice
          </a>
        </footer>
      </article>
    </div>
  );
}
