import { notFound } from "next/navigation";

const policies = {
  shipping: {
    title: "Shipping Policy",
    body: [
      "All packages are processed and shipped Monday through Friday, with the exception of national holidays.",
      "Estimated delivery time is anywhere from 3 to 5 business days within Pakistan. International shipping takes 3–14 working days.",
      "For international shipping, paintings will be rolled and shipped without the frame. For domestic shipping, a frame is available.",
    ],
  },
  refund: {
    title: "Refund Policy",
    body: [
      "Due to the original, one-of-a-kind nature of the artwork, all sales are final.",
      "If your painting arrives damaged, please contact us within 48 hours of delivery with photographs and we will arrange a resolution.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the information necessary to process your order and respond to your enquiries.",
      "Your personal information is never sold or shared with third parties except as required to fulfil and ship your order.",
    ],
  },
  terms: {
    title: "Terms of Service",
    body: [
      "By using this website and placing an order, you agree to our terms of sale and shipping.",
      "All artwork and images remain the intellectual property of the artist.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = policies[slug];
  return { title: policy ? policy.title : "Policy" };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const policy = policies[slug];
  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <h1 className="mb-8 text-4xl font-medium md:text-5xl">{policy.title}</h1>
      <div className="space-y-4 leading-relaxed text-foreground/80">
        {policy.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
