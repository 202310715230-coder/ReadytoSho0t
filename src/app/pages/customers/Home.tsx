import { Hero } from '../../components/Hero';
import { StatsSection } from '../../components/StatsSection';
import { FeaturedProducts } from '../../components/FeaturedProducts'; // Import Komponen, bukan Hook
import { HowToRent } from '../../components/HowToRent';
import { TrustSection } from '../../components/TrustSection';
import { Footer } from '../../components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      
      {/* Gunakan Komponen UI yang sudah berisi data dari Hook */}
      <FeaturedProducts /> 
      
      <HowToRent />
      <TrustSection />
      <Footer />
    </>
  );
}