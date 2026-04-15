export const SITE = {
  meta: {
    title: "INFIBITE — Digital NFC Business Cards",
    description:
      "Share your complete digital profile instantly with a tap. No hidden charges, free design, lifetime validity.",
  },
  brand: {
    name: "INFIBITE",
    nameSuffix: "CARDS",
    logoSrc: "/assets/infibite-logo.svg",
    footerLogoSrc: "/assets/footer-logo.svg",
  },
  topBar: {
    tagline: "No Hidden Charge - Free Design - Life Time Validity",
  },
  social: [
    { id: "facebook", label: "Facebook", href: "https://facebook.com" },
    { id: "instagram", label: "Instagram", href: "https://instagram.com" },
    { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
    { id: "youtube", label: "YouTube", href: "https://youtube.com" },
  ] as const,
  nav: [
    { label: "Download App", href: "#download", hasDropdown: true },
    { label: "Digital Business Cards", href: "#digital-cards", hasDropdown: false },
    { label: "Products", href: "#products", hasDropdown: true },
    { label: "Solutions", href: "#solutions", hasDropdown: true },
    { label: "Resources", href: "#resources", hasDropdown: true },
    { label: "Pricing", href: "#pricing", hasDropdown: false },
    { label: "Company", href: "#company", hasDropdown: true },
  ] as const,
  auth: {
    login: "Login",
    requestDemo: "Request Demo",
  },
  hero: {
    badgeNew: "New",
    badgeIntro: "Introducing",
    badgeBrand: "INFIBITE",
    headingBefore: "One card. Unlimited",
    headingAccent: "connections",
    headingAfter: "Zero regrets",
    subheadingBefore:
      "Still using paper cards that get lost or forgotten?",
    subheadingAfter:
      "Infibite lets you share your complete digital profile instantly with a tap.",
    primaryCta: "Get Your NFC Card",
    secondaryCta: "View Live Demo",
    media: {
      backgroundSrc: "/assets/hero-banner.png",
      cloudOverlaySrc: "/assets/cloud.svg",
      productSrc: "/assets/wallet.svg",
    },
  },
  footer: {
    blurb:
      "Upgrade the way you network. Share contact details, social media, website, portfolio, and payment links with just one tap.",
    email: "contact@infibite.com",
    storesLabel: "Available In",
    newsletterTitle: "Get Our News Letter's Update",
    emailPlaceholder: "Enter your Email id...",
    subscribe: "Subscribe Now",
    socialTitle: "Social Connect",
    copyright: "Copyright © 2026, All rights are reserved by infibitecards.com",
    legal: [
      { label: "Privacy & Policy", href: "#privacy" },
      { label: "Terms & Conditions", href: "#terms" },
    ] as const,
    product: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#integrations" },
      { label: "Pricing", href: "#pricing" },
      { label: "Resources", href: "#resources" },
      { label: "Invoice & Payment", href: "#invoice" },
      { label: "AI Forecasting", href: "#ai-forecasting" },
      { label: "Reward & Deals", href: "#rewards" },
    ] as const,
    support: [
      { label: "Help Center", href: "#help" },
      { label: "Contact Us", href: "#contact" },
      { label: "Career", href: "#career" },
      { label: "About Us", href: "#about" },
      { label: "Insights", href: "#insights" },
      { label: "Our Team", href: "#team" },
    ] as const,
    socialIds: ["instagram", "linkedin"] as const,
  },
} as const
