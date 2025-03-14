
import React from 'react';
import LifeTimeline from '@/components/LifeTimeline';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="p-8 border-b border-border/40 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto p-0">
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">Life Timeline</h1>
          <p className="text-muted-foreground mt-1">Visualize the significant moments in your life journey</p>
        </div>
      </header>
      
      <main className="flex-1 container overflow-hidden flex flex-col">
        <LifeTimeline className="flex-1" />
      </main>
      
      <footer className="border-t border-border/40 p-4 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm">
        <p>Your Life Journey — Elegantly Visualized &middot; Build 20250314 &middot; Created by <a href="https://nrird.com" className='text-white'>Heiswayi Nrird</a></p>
      </footer>
    </div>
  );
};

export default Index;
