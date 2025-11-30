import { useEffect, useState } from "react";
import { BookingCalendar } from "./components/ui/BookingCalendar";
import { LinkList } from "./components/ui/LinkList";
import { ProfileHeader } from "./components/ui/ProfileHeader";

const USERNAME = "alienduck";
const API_URL = "http://localhost:1234/api";

function App() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Fetch du profil public
    fetch(`${API_URL}/user/username/${USERNAME}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setProfile(data.user))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  if (error || !profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Utilisateur introuvable 😢
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 1. Header Profil */}
        <ProfileHeader user={profile} />

        {/* 2. Liste de Liens */}
        <LinkList links={profile.links} />

        {/* 3. Séparateur */}
        <div className="border-t border-slate-200" />

        {/* 4. Calendrier */}
        <BookingCalendar username={profile.username} />
      </div>
    </div>
  );
}

export default App;
