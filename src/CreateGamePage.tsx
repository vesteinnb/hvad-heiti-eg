import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCreationForm } from './components';
import SuccessGameScreen, { GameSuccess } from './SuccessGameScreen';

const CreateGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState<GameSuccess | null>(null);

  const handleGameCreationSuccess = (data: GameSuccess) => {
    setSuccessData(data);
  };

  const handleGameCreationCancel = () => {
    navigate('/parent');
  };

  if (successData) {
    return (
      <SuccessGameScreen
        game={successData}
        onViewGame={() => navigate(`/game/${successData.gameId}`)}
        onCreateAnother={() => setSuccessData(null)}
        onBackToDashboard={() => navigate('/parent')}
      />
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-6 pt-8">
        <GameCreationForm
          onSuccess={handleGameCreationSuccess}
          onCancel={handleGameCreationCancel}
        />
      </div>
    </main>
  );
};

export default CreateGamePage;