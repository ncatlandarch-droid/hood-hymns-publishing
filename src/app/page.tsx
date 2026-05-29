"use client";

import HeroLeadMagnet from "@/components/home/HeroLeadMagnet";
import ContentEngine from "@/components/home/ContentEngine";
import StorePreview from "@/components/home/StorePreview";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <HeroLeadMagnet />
      <StorePreview />
      <Testimonials />
      <ContentEngine />
    </>
  );
}
