'use client';

import dynamic from 'next/dynamic';

// Dynamically import components for lazy loading
const MobileMain = dynamic(() => import('./mobile/MobileMain'));
const WebMain = dynamic(() => import('./web/WebMain'));

// Importing global styles
import './styles/globals.css';

export default function Page() {
  return (
    <div className="page-container">
      {/* MobileMain and WebMain are conditionally displayed based on screen width */}
      <div className="mobile-main">
        <MobileMain />
      </div>
      <div className="web-main">
        <WebMain />
      </div>
    </div>
  );
}
