export type FaqEntry = {
  id: string
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqEntry[] = [
  {
    id: "what-is-digital-business-card",
    question: "What is digital business card?",
    answer:
      "A digital business card is a shareable online profile containing your contact details, social links, portfolio, and website. Instead of printing on paper, you share it via NFC tap, QR code, or a direct link. The recipient's phone opens your profile in their browser — no app download, no account, no friction.",
  },
  {
    id: "is-digital-business-card-free",
    question: "Is digital business card free?",
    answer:
      "Yes — core sharing and profile features are free. Optional upgrades may apply for premium templates or team features.",
  },
  {
    id: "does-recipient-need-app",
    question: "Does the recipient need to download the app?",
    answer:
      "No. Your card opens in the browser from a tap, QR scan, or link. Recipients save your details without installing anything.",
  },
  {
    id: "how-do-i-share",
    question: "How do I share my digital business card?",
    answer:
      "Share your link, show your QR code, or let someone tap your NFC card. You choose what works best in the moment.",
  },
  {
    id: "can-i-update-after-share",
    question: "Can I update my digital business card after I share it?",
    answer:
      "Yes. Updates apply instantly to the same link, so people always see your latest information.",
  },
  {
    id: "digital-vs-nfc",
    question: "What's the difference between digital business card and NFC Card?",
    answer:
      "Your digital business card is the online profile people see. An NFC card is a physical tap-to-open shortcut that opens that same profile in one gesture.",
  },
]

export const FAQ_DEFAULT_OPEN_ID = FAQ_ITEMS[0]?.id ?? ""
