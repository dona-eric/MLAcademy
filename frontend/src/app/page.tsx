import { HeroSection } from '@/components/layout/HeroSection';
import { CourseCatalogPreview } from '@/components/course/CourseCatalogPreview';
import { StatsSection } from '@/components/layout/StatsSection';
import { TestimonialsSection } from '@/components/layout/TestimonialsSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <CourseCatalogPreview />
      <TestimonialsSection />
    </main>
  );
}
