import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        email,
        password
      });
      navigate('/'); // Redireciona para login após registro
    } catch (err) {
      setError('Erro ao registrar. Tente outro e-mail.');
    }
  };

  return (
    <div className="auth-container">
      <div className="app-name">
        <h1>TheNews</h1>
      </div>
      <h2>Criar Conta</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Registrar</button>
      </form>
      <p>
        Já tem conta? <Link to="/">Faça login</Link>
      </p>
    </div>
  );
};

export default RegisterForm;