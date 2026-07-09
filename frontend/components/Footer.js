import Link from "next/link";

const policyLinks = [
  { href: "/policies/refund", label: "Refund policy" },
  { href: "/policies/privacy", label: "Privacy policy" },
  { href: "/policies/terms", label: "Terms of service" },
  { href: "/policies/shipping", label: "Shipping policy" },
  { href: "/contact", label: "Contact information" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Social */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:abdulsamikhan471@gmail.com"
              aria-label="Email"
              className="text-foreground transition hover:opacity-60"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-foreground transition hover:opacity-60"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>

          {/* Country / region */}
          <div>
            <h2 className="eyebrow mb-3 text-muted">Country/region</h2>
            <select
              defaultValue="PKR"
              aria-label="Country/region"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground outline-none"
            >
              <option value="PKR">PKR ₨ | Pakistan</option>
              <option value="USD">USD $ | United States</option>
              <option value="GBP">GBP £ | United Kingdom</option>
              <option value="EUR">EUR € | Germany</option>
              <option value="AED">AED د.إ | United Arab Emirates</option>
            </select>
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["VISA", "MC", "AMEX", "PayPal"].map((m) => (
              <span
                key={m}
                className="rounded border border-border px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Policy links */}
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-muted">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()}, ZB
          </p>
        </div>
      </div>
    </footer>
  );
}
