import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout.tsx';
import StreakChart from './StreakChart.tsx';
import AdminCharts from '../components/AdminCharts.tsx';
import EngagementChart from '../components/EngagementChart.tsx';
import MotivationalMessage from '../components/MotivationalMessage.tsx';

interface ReadingEvent {
  id: number;
  post_id: string;
  created_at: string;
}

export interface AdminMetric {
  email: string;
  currentStreak: number;
  maxStreak: number;
}

interface UserData {
  email: string;
  isAdmin: boolean;
  streak: number;
  maxStreak: number;
  streakHistory: number[];
  events: ReadingEvent[];
}

const Dashboard = () => {
  const userEmail = localStorage.getItem('userEmail') || '';
  const [userData, setUserData] = useState<UserData | null>(null);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetric[]>([]);
  const [userError, setUserError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [weeklyEngagement, setWeeklyEngagement] = useState<number[]>([]);
  const [isLoadingEngagement, setIsLoadingEngagement] = useState(false);

  const fetchAdminMetrics = useCallback(async () => {
    try {
      setIsLoadingAdmin(true);
      const response = await axios.get('http://localhost:3001/api/admin/metrics', {
        params: { email: userEmail },
      });
      setAdminMetrics(response.data);
      setAdminError(null);
    } catch (error) {
      setAdminError('Erro ao carregar métricas administrativas');
    } finally {
      setIsLoadingAdmin(false);
    }
  }, [userEmail]);

  const fetchWeeklyEngagement = useCallback(async () => {
    try {
      setIsLoadingEngagement(true);
      const response = await axios.get('http://localhost:3001/api/admin/engagement', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWeeklyEngagement(response.data);
    } catch (error) {
      console.error('Erro ao buscar engajamento:', error);
    } finally {
      setIsLoadingEngagement(false);
    }
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          navigate('/', { replace: true });
          return;
        }

        const response = await axios.get('http://localhost:3001/api/user/stats', {
          params: { email }
        });

        if (!response.data?.email) throw new Error('Dados inválidos');

        const userDataResponse = response.data as UserData;
        setUserData(userDataResponse);

        if (userDataResponse.isAdmin) {
          fetchAdminMetrics();
        }

        if (userDataResponse.isAdmin) {
          await Promise.all([fetchAdminMetrics(), fetchWeeklyEngagement()]);
        }

      } catch (error) {
        setUserError('Erro ao carregar dados do usuário');
      }
    };
    fetchUserData();
  }, [navigate, fetchAdminMetrics, fetchWeeklyEngagement]);

  if (userError && !userData?.isAdmin) {
    return (
      <MainLayout userEmail={userEmail}>
        <div className="error-container">
          <p>{userError}</p>
          <button onClick={() => navigate('/')}>Voltar ao Login</button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout userEmail={userEmail}>
      {userData ? (
        <div className="dashboard container">

          {/* Conteúdo para usuários comuns */}
          {!userData.isAdmin && (
            <>
              <h1>Bem-vindo, {userData.email}</h1>

              <MotivationalMessage currentStreak={userData.streak} />

              <div className="streak-metrics">
                <div className="metric-box">
                  <h3>Streak Atual</h3>
                  <div className="metric-value">{userData.streak} 🔥</div>
                </div>

                <div className="metric-box">
                  <h3>Maior Streak</h3>
                  <div className="metric-value">{userData.maxStreak} 🏆</div>
                </div>

                <div className="chart-container">
                  <StreakChart streakHistory={userData.streakHistory} />
                </div>
              </div>

              <div className="history">
                <h3>Histórico de Leituras</h3>
                <ul>
                  {userData.events.map((event) => (
                    <li key={event.id}>
                      {new Date(event.created_at).toLocaleDateString()} - Edição #{event.post_id}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Conteúdo para admin */}
          {userData.isAdmin && (
            <div className="admin-panel">
              <h2>Painel Administrativo</h2>

              {isLoadingAdmin ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Carregando ranking...</p>
                </div>
              ) : (
                <>
                  <div className="admin-metrics">
                    <h3>Ranking de Leitores</h3>
                    {adminMetrics.length > 0 ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Usuário</th>
                            <th>Streak Atual</th>
                            <th>Maior Streak</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminMetrics.map((user, index) => (
                            <tr key={index}>
                              <td>{user.email}</td>
                              <td>{user.currentStreak}</td>
                              <td>{user.maxStreak}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Nenhum dado disponível</p>
                    )}
                  </div>
                  {adminMetrics.length > 0 && (
                    <div className="admin-charts">
                      <h3>Visualização de Dados</h3>
                      <AdminCharts metrics={adminMetrics} />
                    </div>
                  )}
                  <div className="charts-section">
                    <div className="chart-card">
                      <h3>Engajamento Semanal (Todos os usuários)</h3>
                      {isLoadingEngagement ? (
                        <div className="loading-small">Carregando...</div>
                      ) : (
                        <EngagementChart weeklyData={weeklyEngagement} />
                      )}
                    </div>
                  </div>
                </>

              )}
            </div>
          )}
        </div>
      ) : (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;