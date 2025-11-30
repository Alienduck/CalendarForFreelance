import { LayoutDashboard, LogOut, Save, Settings, User } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const name_id = useId();
  const title_id = useId();
  const bio_id = useId();

  useEffect(() => {
    fetch("http://localhost:1234/api/claims", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Non connecté");
        return res.json();
      })
      .then((claims) => {
        if (!claims.sub) throw new Error("Token invalide");
        return fetch(`http://localhost:1234/api/user/${claims.sub}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("User introuvable");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch((err) => {
        console.error("Erreur Auth:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await fetch(`http://localhost:1234/api/user/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: user.full_name,
        bio: user.bio,
        job_title: user.job_title,
        username: user.username,
      }),
    });
    alert("Profil mis à jour !");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Chargement...
      </div>
    );
  if (!user)
    return (
      <div className="p-10 text-center bg-slate-950 text-white">
        Vous devez être connecté.{" "}
        <Link to="/login" className="text-blue-400 underline">
          Se connecter
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      {/* Sidebar Gauche */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-6">
        <div className="font-bold text-2xl text-blue-500 mb-10 flex items-center gap-2">
          <LayoutDashboard /> FreelanceOS
        </div>

        <nav className="space-y-2 flex-1">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "profile" ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <User size={20} /> Mon Profil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "settings" ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <Settings size={20} /> Paramètres
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-slate-300 mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
              <img
                src={user.avatar_url || "https://github.com/shadcn.png"}
                alt="Avatar"
              />
            </div>
            <div className="text-sm">
              <p className="font-bold">{user.full_name}</p>
              <Link
                to={`/u/${user.username}`}
                className="text-xs text-blue-400 hover:underline"
              >
                Voir mon profil public
              </Link>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium w-full transition"
          >
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            {activeTab === "profile"
              ? "Éditer mon profil"
              : "Paramètres du compte"}
          </h1>

          {activeTab === "profile" && (
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-8">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor={name_id} className="text-sm font-semibold text-slate-400">
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      value={user.full_name}
                      onChange={(e) =>
                        setUser({ ...user, full_name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={title_id} className="text-sm font-semibold text-slate-400">
                      Titre / Spécialité
                    </label>
                    <input
                      type="text"
                      value={user.job_title}
                      onChange={(e) =>
                        setUser({ ...user, job_title: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor={bio_id} className="text-sm font-semibold text-slate-400">
                    Bio (Courte description)
                  </label>
                  <textarea
                    rows={4}
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-white placeholder-slate-600"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-blue-900/20"
                  >
                    <Save size={18} /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-8 text-center text-slate-500">
              Fonctionnalité en cours de développement... (Email, mot de passe)
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
