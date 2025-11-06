
import { useNavigate } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/study");
  };

  const handleStartFromWord = () => {
    return true;
  };

  const handleEditWordList = () => {
    navigate("/edit");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectStartWord = () => {
    navigate("/study");
  };

  const handleAutoplay = () => {
    navigate("/autoplay");
  };

  return {
    handleStart,
    handleStartFromWord,
    handleEditWordList,
    handleBackToMain: handleBack,
    handleSelectStartWord,
    handleAutoplay,
  };
}
