import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import Dashboard from './components/Dashboard.tsx';
import './styles/Header.css';
import StreakChart from './components/StreakChart'; // Componente adicional se necessário
import EngagementChart from './components/EngagementChart'; // Componente adicional se necessário

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Se der tempo fazer mais rotas admin */}
        {/*
        <Route path="/admin/metrics" element={<AdminMetrics />} />
        <Route path="/admin/ranking" element={<RankingChart />} />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;