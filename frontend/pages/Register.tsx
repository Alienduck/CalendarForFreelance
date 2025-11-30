import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // C'est ici que tu brancheras ta future route Backend
      const res = await fetch("http://localhost:1234/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirection vers le profil créé ou le login
        navigate(`/u/${formData.username}`);
      } else {
        alert("Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const full_name_id = useId();
  const username_id = useId();
  const email_id = useId();
  const password_id = useId();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-200">Créer un compte</h2>
          <p className="text-slate-500 mt-2">Rejoignez CalendarFreelance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={full_name_id} className="block text-sm font-medium text-slate-900 mb-1">
              Nom complet
            </label>
            <input
              id={full_name_id}
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Jean Dupont"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor={username_id} className="block text-sm font-medium text-slate-900 mb-1">
              Nom d'utilisateur (URL)
            </label>
            <input
              id={username_id}
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="jeandupont"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor={email_id} className="block text-sm font-medium text-slate-900 mb-1">
              Email
            </label>
            <input
              id={email_id}
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="jean@exemple.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor={password_id} className="block text-sm font-medium text-slate-900 mb-1">
              Mot de passe
            </label>
            <input
              id={password_id}
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-slate font-bold rounded-lg hover:bg-blue-700 transition flex justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" />}
            S'inscrire
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-200">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
