import { getSpots, getAuctionConfig, getBids } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SpotBoard from '@/components/SpotBoard';
import BidHistory from '@/components/BidHistory';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [spots, config, bids] = await Promise.all([
    getSpots(),
    getAuctionConfig(),
    getBids(),
  ]);

  const totalRaised = spots.reduce((sum, s) => sum + s.current_bid, 0);

  return (
    <main className="min-h-screen">
      <Navbar />

      <HeroSection
        totalRaised={totalRaised}
        fundingGoal={config.funding_goal}
        endsAt={config.ends_at}
        spotsTaken={spots.filter((s) => s.current_bid > 0).length}
        totalSpots={spots.length}
      />

      <SpotBoard spots={spots} />

      <BidHistory bids={bids} />

      <HowItWorks />

      <FAQ />

      <Footer />
    </main>
  );
}
