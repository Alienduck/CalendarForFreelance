import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route d'accueil */}
        <Route path="/" element={<Landing />} />

        {/* Route d'inscription */}
        <Route path="/register" element={<Register />} />

        {/* Route dynamique pour les profils (ex: /u/alienduck) */}
        <Route path="/u/:username" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
