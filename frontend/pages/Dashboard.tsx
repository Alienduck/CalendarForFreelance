import {
  LayoutDashboard,
  Link as LinkIcon,
  Loader2,
  Plus,
  Save,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [addingLink, setAddingLink] = useState(false);

  const text_area_id = useId();

  const fetchUser = useCallback(() => {
    fetch("http://localhost:1234/api/claims", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Non connecté");
        return res.json();
      })
      .then((claims) => fetch(`http://localhost:1234/api/user/${claims.sub}`))
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
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
    } catch (error) {
      console.error("Erreur update", error);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingLink(true);
    try {
      const res = await fetch("http://localhost:1234/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newLink),
      });
      if (res.ok) {
        setNewLink({ title: "", url: "" });
        fetchUser();
      }
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Supprimer ce lien ?")) return;

    await fetch(`http://localhost:1234/api/links/${linkId}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchUser();
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
        Non connecté.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-6">
        <div className="font-bold text-2xl text-blue-500 mb-10 flex items-center gap-2">
          <LayoutDashboard /> FreelanceOS
        </div>

        <nav className="space-y-2 flex-1">
          <TabButton
            icon={<User size={20} />}
            label="Mon Profil"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            icon={<LinkIcon size={20} />}
            label="Mes Liens"
            active={activeTab === "links"}
            onClick={() => setActiveTab("links")}
          />
          <TabButton
            icon={<Settings size={20} />}
            label="Paramètres"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-slate-300 mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
              <img
                src={user.avatar_url || "https://github.com/shadcn.png"}
                alt="Avatar"
              />
            </div>
            <div className="text-sm truncate max-w-[140px]">
              <p className="font-bold truncate">{user.full_name}</p>
              <Link
                to={`/u/${user.username}`}
                className="text-xs text-blue-400 hover:underline"
              >
                Voir mon profil public
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            {activeTab === "profile" && "Éditer mon profil"}
            {activeTab === "links" && "Gérer mon Linktree"}
            {activeTab === "settings" && "Paramètres"}
          </h1>

          {activeTab === "profile" && (
            <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup
                    label="Nom Complet"
                    value={user.full_name}
                    onChange={(v: string) => setUser({ ...user, full_name: v })}
                  />
                  <InputGroup
                    label="Titre / Spécialité"
                    value={user.job_title}
                    onChange={(v: string) => setUser({ ...user, job_title: v })}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={text_area_id}
                    className="text-sm font-semibold text-slate-400"
                  >
                    Bio
                  </label>
                  <textarea
                    id={text_area_id}
                    rows={4}
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  {/* 3. CORRECTION : Type submit explicite */}
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition"
                  >
                    <Save size={18} /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "links" && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus size={20} className="text-blue-500" /> Ajouter un lien
                </h3>
                <form
                  onSubmit={handleAddLink}
                  className="flex flex-col md:flex-row gap-4"
                >
                  <input
                    placeholder="Titre (ex: Mon GitHub)"
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newLink.title}
                    onChange={(e) =>
                      setNewLink({ ...newLink, title: e.target.value })
                    }
                    required
                  />
                  <input
                    placeholder="URL (https://...)"
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.target.value })
                    }
                    required
                  />
                  {/* 3. CORRECTION : Type submit pour le formulaire d'ajout */}
                  <button
                    type="submit"
                    disabled={addingLink}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50"
                  >
                    {addingLink ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Ajouter"
                    )}
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                {(!user.links || user.links.length === 0) && (
                  <p className="text-slate-500 italic text-center py-8">
                    Aucun lien pour le moment.
                  </p>
                )}
                {user.links?.map((link: any) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <LinkIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{link.title}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-400 hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    {/* 3. CORRECTION : Type button pour la suppression */}
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// 4. CORRECTION : Typage et type="button" pour le TabButton
function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${active ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
    >
      {icon} {label}
    </button>
  );
}

// 2. CORRECTION : Utilisation de useId pour l'accessibilité
function InputGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const id = useId(); // Génère un ID unique stable
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-400">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
      />
    </div>
  );
}
