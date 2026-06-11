import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "@/components/MainMenu";
import { BattlePassPage } from "@/components/BattlePassPage";
import GamePage from "@/pages/GamePage";
import ReplayPage from "@/pages/ReplayPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/battlepass" element={<BattlePassPage />} />
        <Route path="/replays" element={<ReplayPage />} />
        <Route path="/replays/:id" element={<ReplayPage />} />
        <Route path="*" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}
