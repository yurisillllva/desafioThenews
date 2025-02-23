import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userEmail: string;
}

const Header: React.FC<HeaderProps> = ({ userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove os dados de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    // Redireciona para a página de login
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <span className="user-email">{userEmail}</span>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;