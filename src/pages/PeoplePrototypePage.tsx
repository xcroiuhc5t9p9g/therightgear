import React from 'react';
import { Users } from 'lucide-react';
import { Container, EmptyStatePanel, SectionHeader } from '../components/ui-blocks';

interface PeoplePrototypePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const PeoplePrototypePage: React.FC<PeoplePrototypePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white py-20 min-h-[60vh]">
      <Container>
        <SectionHeader title="People Directory" />
        <EmptyStatePanel 
          icon={<Users className="w-10 h-10" />}
          title="People Directory Integration Pending"
          description="This is a prototype route for discovering designers, engineers, and racing figures. Full directory pages will be available soon."
          action={
            <button onClick={() => onNavigate('home')} className="px-6 py-3 bg-trg-carbon text-white rounded-lg font-bold hover:bg-trg-graphite transition-colors min-h-[44px]">
              Return Home
            </button>
          }
        />
      </Container>
    </div>
  );
};
