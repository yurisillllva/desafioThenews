import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });
      localStorage.setItem("userEmail", email);
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Erro no login!');
    }
  };

  return (
    <div className="auth-container">
      <div className="app-name">
        <h1>TheNews</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <button type="submit">Login</button>
        <a href="/register">Criar conta</a>
      </form>
    </div>
  );
};

export default LoginForm; 