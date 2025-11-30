import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookingCalendar } from "../components/ui/BookingCalendar";
import { LinkList } from "../components/ui/LinkList";
import { ProfileHeader } from "../components/ui/ProfileHeader";

const API_URL = "http://localhost:1234/api";

export function Profile() {
  const { username } = useParams(); // Récupère le :username de l'URL
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    // Fetch dynamique basé sur l'URL
    fetch(`${API_URL}/user/username/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setProfile(data.user))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse">Chargement du profil...</div>
      </div>
    );
  if (error || !profile)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Profil introuvable 😕
        </h2>
        <p className="text-slate-500">L'utilisateur {username} n'existe pas.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ProfileHeader user={profile} />
        <LinkList links={profile.links} />
        <div className="border-t border-slate-200" />
        <BookingCalendar username={profile.username} />
      </div>
    </div>
  );
}
