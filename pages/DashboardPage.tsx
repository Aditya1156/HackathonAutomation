import React, { useState, useEffect } from 'react';
import type { Team } from '../types';
import { useToast } from '../hooks/useToast';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardOverview from '../components/DashboardOverview';
import DashboardTeam from '../components/DashboardTeam';
import DashboardProject from '../components/DashboardProject';
import DashboardChat from '../components/DashboardChat';
import DashboardResources from '../components/DashboardResources';
import ErrorBoundary from '../components/ErrorBoundary';

export type DashboardView = 'overview' | 'team' | 'project' | 'chat' | 'resources';

interface DashboardPageProps {
  team: Team;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ team, onLogout }) => {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const addToast = useToast();
  const hasShownWelcomeRef = React.useRef(false);
  
  useEffect(() => {
      const justRegistered = sessionStorage.getItem('justRegistered');
      if (justRegistered && !hasShownWelcomeRef.current) {
        addToast(`Welcome, Team ${team.name}!`, 'celebrate');
        hasShownWelcomeRef.current = true;
        try {
          sessionStorage.removeItem('justRegistered');
        } catch (error) {
          console.error("Failed to remove justRegistered flag:", error);
        }
      }
  }, [team.name, addToast]);

  const renderContent = () => {
    switch (activeView) {
      case 'team':
        return <DashboardTeam team={team} />;
      case 'project':
        return <DashboardProject team={team} />;
      case 'chat':
        return <DashboardChat team={team} />;
      case 'resources':
        return <DashboardResources />;
      case 'overview':
      default:
        return <DashboardOverview team={team} />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} />
        <main className="flex-1 min-w-0">
          <ErrorBoundary key={activeView}>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;