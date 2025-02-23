import React from 'react';

interface Props {
  currentStreak: number;
}

const MotivationalMessage = ({ currentStreak }: Props) => {
  const getMessage = () => {
    if (currentStreak === 0) {
      return {
        title: '🚀 Hora de Começar!',
        text: 'Cada grande jornada começa com o primeiro passo! Que tal ler um artigo hoje?'
      };
    }

    if (currentStreak <= 3) {
      const messages = [
        {
          title: '🔥 Tá Esquentando!',
          text: 'Você está no caminho certo! Mais dois dias e vira uma sequência!'
        },
        {
          title: '🌟 Bom Começo!',
          text: 'Continue assim! A consistência é a chave do sucesso!'
        }
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }

    if (currentStreak <= 7) {
      return {
        title: '💪 Impressionante!',
        text: `${currentStreak} dias seguidos! Você está virando um hábito! Mantenha o ritmo!`
      };
    }

    return {
      title: '🏆 Lenda Viva!',
      text: `Incrível streak de ${currentStreak} dias! Você é uma inspiração!`
    };
  };

  const { title, text } = getMessage();

  return (
    <div className="motivational-message">
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="streak-fire">{'🔥'.repeat(Math.min(currentStreak, 10))}</div>
    </div>
  );
};

export default MotivationalMessage;