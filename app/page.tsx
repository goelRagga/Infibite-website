import { BlendingBannerSection } from "@/components/site/blending-banner-section";
import { FaqSection } from "@/components/site/faq-section";
import { HeroSection } from "@/components/site/hero-section";
import { ReviewsSection } from "@/components/site/reviews-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FaqSection />
      <BlendingBannerSection />
      <ReviewsSection />
    </>
  );
}
