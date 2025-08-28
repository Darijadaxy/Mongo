import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/putovanja.jpg";
import Header from "../components/Header";

const FirstPage = () => {
  const navigate = useNavigate();

  return (
    <>
        <Header/>
        <div
        className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        >
        <button
        onClick={() => navigate("/home")}
        className="px-10 py-4 bg-green-500/40 hover:bg-green-600/50 text-black font-bold text-lg rounded-xl shadow-lg border-2 border-green-600 backdrop-blur-sm transition-transform transform hover:scale-105"
        >
        Pogledaj ponude putovanja
        </button>
        </div>
    </>
  );
};

export default FirstPage;
