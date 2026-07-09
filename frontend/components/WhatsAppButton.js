"use client";

import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || "923144965089";
const DEFAULT_MESSAGE = "Hello! I would like to enquire about your artwork.";

function whatsappUrl(number, message) {
  const digits = String(number).replace(/\D/g, "");
  if (!digits) return "";
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export default function WhatsAppButton() {
  const pathname = usePathname();
  const url = whatsappUrl(WHATSAPP_NUMBER, DEFAULT_MESSAGE);

  if (!url || pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#20bd5a] active:scale-95 md:bottom-8 md:right-8 md:h-[4.5rem] md:w-[4.5rem]"
    >
      <svg viewBox="0 0 32 32" className="h-9 w-9 md:h-10 md:w-10" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.003 2.667C8.64 2.667 2.67 8.64 2.67 16.003c0 2.34.61 4.53 1.674 6.44L2.667 29.33l7.04-1.848a13.2 13.2 0 0 0 6.296 1.594h.006c7.36 0 13.33-5.974 13.33-13.337C29.336 8.64 23.363 2.667 16.003 2.667zm0 24.39a11.05 11.05 0 0 1-5.63-1.54l-.403-.24-4.18 1.097 1.116-4.074-.263-.417a11.04 11.04 0 0 1-1.7-5.88c0-6.11 4.97-11.08 11.08-11.08 2.96 0 5.74 1.155 7.83 3.25a11.01 11.01 0 0 1 3.25 7.83c0 6.11-4.97 11.08-11.08 11.08zm6.11-8.27c-.34-.17-2.01-.99-2.32-1.1-.31-.11-.54-.17-.77.17-.23.34-.89 1.1-1.09 1.33-.2.23-.4.26-.74.09-.34-.17-1.43-.53-2.73-1.68-1.01-.9-1.69-2.01-1.89-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.55-.28-.68-.57-.59-.77-.6h-.66c-.23 0-.6.09-.91.43-.31.34-1.18 1.15-1.18 2.81 0 1.66 1.21 3.26 1.38 3.49.17.23 2.38 3.63 5.77 5.09.81.35 1.44.56 1.93.72.81.26 1.55.22 2.13.13.65-.1 2.01-.82 2.29-1.61.29-.8.29-1.49.2-1.61-.09-.12-.31-.2-.65-.37z"
        />
      </svg>
    </a>
  );
}
