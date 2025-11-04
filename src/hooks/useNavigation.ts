
import { useNavigate } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();

  const handleStart = (wordListLength: number) => {
    if (wordListLength === 0) {
      navigate("/edit");
    } else {
      navigate("/study");
    }
  };

  const handleStartFromWord = (wordListLength: number) => {
    if (wordListLength === 0) {
      navigate("/edit");
    } else {
      return true;
    }
    return false;
  };

  const handleEditWordList = () => {
    navigate("/edit");
  };

  const handleBackToMain = () => {
    navigate("/");
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
    handleBackToMain,
    handleSelectStartWord,
    handleAutoplay,
  };
}
