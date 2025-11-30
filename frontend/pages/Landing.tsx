import { Calendar, Share2, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar simple */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <Calendar /> CalendarFreelance
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Gérez vos rendez-vous freelance <br />
          <span className="text-blue-600">simplement.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Une page unique pour présenter vos liens et permettre à vos prospects
          de réserver un créneau automatiquement.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Créer ma page gratuitement
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-500" />}
            title="Profil Professionnel"
            desc="Un lien unique regroupant votre bio, vos réseaux et votre expertise."
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-purple-500" />}
            title="Réservation 24/7"
            desc="Fini les allers-retours par mail. Vos clients réservent selon vos disponibilités."
          />
          <FeatureCard
            icon={<Share2 className="w-8 h-8 text-green-500" />}
            title="Partage Facile"
            desc="Ajoutez votre lien en signature de mail ou sur LinkedIn."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 transition">
      <div className="mb-4 bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
