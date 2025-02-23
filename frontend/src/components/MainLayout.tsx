import React from 'react';
import Header from './Header.tsx';

interface MainLayoutProps {
  children: React.ReactNode;
  userEmail: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, userEmail }) => {
  return (
    <div className="main-layout">
      <Header userEmail={userEmail} />
      <main className="main-content container">{children}</main>
    </div>
  );
};

export default MainLayout;