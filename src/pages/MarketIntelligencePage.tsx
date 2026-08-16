import React from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { HeroBlock, SectionHeader, EmptyStatePanel, Container } from '../components/ui-blocks';

interface MarketIntelligencePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MarketIntelligencePage: React.FC<MarketIntelligencePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white min-h-screen">
      <HeroBlock 
        title="Market Intelligence"
        subtitle="Track valuations, transaction history, and market movement for iconic vehicles."
      />

      <section className="py-20">
        <Container>
          <SectionHeader title="Global Market Data" subtitle="Data integration in progress" />
          <EmptyStatePanel 
            icon={<TrendingUp className="w-12 h-12 text-trg-gray-300" />}
            title="Market Intelligence is being connected"
            description="The Right Gear is preparing an evidence-led view of valuations and market movement. Real market feeds will populate this area once integration is complete."
          />
        </Container>
      </section>

      <section className="py-20 bg-trg-warm-white border-t border-trg-gray-200">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-trg-gray-200 text-center flex flex-col items-center">
            <Activity className="w-8 h-8 text-trg-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-trg-carbon mb-2">Price Trends</h3>
            <p className="text-sm text-trg-gray-500 max-w-prose-trg">Historical valuation curves and tracking.</p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-trg-gray-200 text-center flex flex-col items-center">
            <BarChart3 className="w-8 h-8 text-trg-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-trg-carbon mb-2">Auction Results</h3>
            <p className="text-sm text-trg-gray-500 max-w-prose-trg">Verified transaction history from global auctions.</p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-trg-gray-200 text-center flex flex-col items-center">
            <TrendingUp className="w-8 h-8 text-trg-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-trg-carbon mb-2">Market Indices</h3>
            <p className="text-sm text-trg-gray-500 max-w-prose-trg">Aggregate movement metrics across categories.</p>
          </div>
        </Container>
      </section>
    </div>
  );
};
