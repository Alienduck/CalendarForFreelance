import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Clock,
  LayoutDashboard,
  Link as LinkIcon,
  Loader2,
  Save,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // State Liens
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [addingLink, setAddingLink] = useState(false);

  // State Dispos
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [newDispo, setNewDispo] = useState({
    day_of_week: 1,
    start_time: "09:00",
    end_time: "17:00",
  });

  // State RDV
  const [appointments, setAppointments] = useState<any[]>([]);

  const fetchUser = useCallback(() => {
    fetch("http://localhost:1234/api/claims", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Non connecté");
        return res.json();
      })
      .then((claims) => fetch(`http://localhost:1234/api/user/${claims.sub}`))
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const fetchSchedule = useCallback(() => {
    fetch("http://localhost:1234/api/schedule/availabilities", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAvailabilities(data.availabilities || []));

    fetch("http://localhost:1234/api/schedule/appointments", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data.appointments || []));
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (
      user &&
      (activeTab === "availabilities" || activeTab === "appointments")
    ) {
      fetchSchedule();
    }
  }, [user, activeTab, fetchSchedule]);

  // --- HANDLERS LIENS ---
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingLink(true);
    await fetch("http://localhost:1234/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newLink),
    });
    setNewLink({ title: "", url: "" });
    setAddingLink(false);
    fetchUser();
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`http://localhost:1234/api/links/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchUser();
  };

  // --- HANDLERS DISPOS ---
  const handleAddDispo = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:1234/api/schedule/availabilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...newDispo,
        day_of_week: Number(newDispo.day_of_week),
      }),
    });
    fetchSchedule();
  };

  const handleDeleteDispo = async (id: string) => {
    await fetch(`http://localhost:1234/api/schedule/availabilities/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchSchedule();
  };

  // --- HANDLER UPDATE PROFIL ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-6">
        <div className="font-bold text-2xl text-blue-500 mb-10 flex items-center gap-2">
          <LayoutDashboard /> FreelanceOS
        </div>

        <nav className="space-y-2 flex-1">
          <TabButton
            icon={<User size={20} />}
            label="Profil"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            icon={<LinkIcon size={20} />}
            label="Liens"
            active={activeTab === "links"}
            onClick={() => setActiveTab("links")}
          />
          <TabButton
            icon={<Clock size={20} />}
            label="Disponibilités"
            active={activeTab === "availabilities"}
            onClick={() => setActiveTab("availabilities")}
          />
          <TabButton
            icon={<Calendar size={20} />}
            label="Rendez-vous"
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
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
                target="_blank"
                className="text-xs text-blue-400 hover:underline"
              >
                Voir ma page
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 capitalize">
            {activeTab === "availabilities" ? "Mes Disponibilités" : activeTab}
          </h1>

          {/* --- ONGLET PROFIL --- */}
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
                  <label htmlFor="text_area" className="text-sm font-semibold text-slate-400">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2"
                  >
                    <Save size={18} /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- ONGLET LIENS --- */}
          {activeTab === "links" && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <form onSubmit={handleAddLink} className="flex gap-4">
                  <input
                    placeholder="Titre"
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    value={newLink.title}
                    onChange={(e) =>
                      setNewLink({ ...newLink, title: e.target.value })
                    }
                    required
                  />
                  <input
                    placeholder="URL"
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.target.value })
                    }
                    required
                  />
                  <button
                    type="submit"
                    disabled={addingLink}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-500"
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
                {user.links?.map((link: any) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <LinkIcon className="text-slate-400" size={20} />
                      <p className="font-bold text-white">{link.title}</p>
                    </div>
                    <button
                    type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- ONGLET DISPONIBILITÉS --- */}
          {activeTab === "availabilities" && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <h3 className="text-white font-bold mb-4">
                  Ajouter une plage horaire
                </h3>
                <form
                  onSubmit={handleAddDispo}
                  className="flex gap-4 items-end"
                >
                  <div className="space-y-1">
                    <label htmlFor="select" className="text-xs text-slate-400">Jour</label>
                    <select
                      className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white outline-none"
                      value={newDispo.day_of_week}
                      onChange={(e) =>
                        setNewDispo({
                          ...newDispo,
                          day_of_week: Number(e.target.value),
                        })
                      }
                    >
                      {DAYS.map((d, i) => (
                        <option key={d} value={i}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="" className="text-xs text-slate-400">Début</label>
                    <input
                      type="time"
                      className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      value={newDispo.start_time}
                      onChange={(e) =>
                        setNewDispo({ ...newDispo, start_time: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="" className="text-xs text-slate-400">Fin</label>
                    <input
                      type="time"
                      className="px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                      value={newDispo.end_time}
                      onChange={(e) =>
                        setNewDispo({ ...newDispo, end_time: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-500 mb-[1px]"
                  >
                    Ajouter
                  </button>
                </form>
              </div>

              <div className="grid gap-3">
                {availabilities.map((dispo: any) => (
                  <div
                    key={dispo.id}
                    className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="text-green-500" size={20} />
                      <span className="font-bold text-white w-24">
                        {DAYS[dispo.day_of_week]}
                      </span>
                      <span className="text-slate-400">
                        {dispo.start_time.slice(0, 5)} -{" "}
                        {dispo.end_time.slice(0, 5)}
                      </span>
                    </div>
                    <button
                    type="button"
                      onClick={() => handleDeleteDispo(dispo.id)}
                      className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {availabilities.length === 0 && (
                  <p className="text-slate-500 italic">
                    Aucune disponibilité définie.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* --- ONGLET RENDEZ-VOUS --- */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              {appointments.map((appt: any) => (
                <div
                  key={appt.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between bg-slate-900 border ${appt.status === "cancelled" ? "border-red-900/30 opacity-50" : "border-slate-800"} p-5 rounded-xl`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Calendar className="text-blue-500" size={18} />
                      <span className="font-bold text-white">
                        {format(new Date(appt.start_date), "EEEE d MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {format(new Date(appt.start_date), "HH:mm")} -{" "}
                        {format(new Date(appt.end_date), "HH:mm")}
                      </span>
                      {appt.status === "cancelled" && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                          Annulé
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300">
                      {appt.client_name}{" "}
                      <span className="text-slate-500">
                        &lt;{appt.client_email}&gt;
                      </span>
                    </p>
                  </div>
                  {appt.status !== "cancelled" && (
                    <button
                    type="button"
                      onClick={async () => {
                        if (!confirm("Annuler ce RDV ?")) return;
                        await fetch(
                          `http://localhost:1234/api/schedule/appointments/${appt.id}/cancel`,
                          { method: "PATCH", credentials: "include" },
                        );
                        fetchSchedule();
                      }}
                      className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-900/30 px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition"
                    >
                      <XCircle size={16} /> Annuler le RDV
                    </button>
                  )}
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-slate-500 italic text-center py-10">
                  Aucun rendez-vous planifié.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: any) {
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

function InputGroup({ label, value, onChange }: any) {
  const id = useId();
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
        className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
      />
    </div>
  );
}
