import { LayoutDashboard, LogOut, Save, Settings, User } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const fullNameId = useId();
  const jobTitleId = useId();
  const bioId = useId();

  useEffect(() => {
    fetch("http://localhost:1234/api/claims", { credentials: "include" })
      .then((res) => res.json())
      .then((claims) => {
        return fetch(`http://localhost:1234/api/user/${claims.sub}`);
      })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Non connecté", err))
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
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  if (!user)
    return (
      <div className="p-10 text-center">
        Vous devez être connecté.{" "}
        <Link to="/login" className="text-blue-500">
          Se connecter
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Gauche */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="font-bold text-2xl text-blue-600 mb-10 flex items-center gap-2">
          <LayoutDashboard /> FreelanceOS
        </div>

        <nav className="space-y-2 flex-1">
          <button
          type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "profile" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <User size={20} /> Mon Profil
          </button>
          <button
          type="button"
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${activeTab === "settings" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Settings size={20} /> Paramètres
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 text-slate-700 mb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
              <img
                src={user.avatar_url || "https://github.com/shadcn.png"}
                alt="Avatar"
              />
            </div>
            <div className="text-sm">
              <p className="font-bold">{user.full_name}</p>
              <Link
                to={`/u/${user.username}`}
                className="text-xs text-blue-500 hover:underline"
              >
                Voir mon profil public
              </Link>
            </div>
          </div>
          <button type="button" className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium w-full">
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            {activeTab === "profile"
              ? "Éditer mon profil"
              : "Paramètres du compte"}
          </h1>

          {activeTab === "profile" && (
            <div>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor={fullNameId} className="text-sm font-semibold text-slate-700">
                    Nom Complet
                  </label>
                  <input
                    id={fullNameId}
                    type="text"
                    value={user.full_name}
                    onChange={(e) =>
                      setUser({ ...user, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={jobTitleId} className="text-sm font-semibold text-slate-700">
                    Titre / Spécialité
                  </label>
                  <input
                    id={jobTitleId}
                    type="text"
                    value={user.job_title}
                    onChange={(e) =>
                      setUser({ ...user, job_title: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={bioId} className="text-sm font-semibold text-slate-700">
                    Bio (Courte description)
                  </label>
                  <textarea
                    id={bioId}
                    rows={4}
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition">
                    <Save size={18} /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
