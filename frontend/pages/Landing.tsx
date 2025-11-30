import { ArrowRight, Calendar, CheckCircle } from "lucide-react";
import { useId } from "react";
import { Link } from "react-router-dom";

export function Landing() {
  const section_id = useId();
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="font-bold text-xl text-slate-900 flex items-center gap-2 tracking-tight">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Calendar size={20} strokeWidth={3} />
            </div>
            CalendarFreelance
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-200"
            >
              S'inscrire gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Nouveau pour les freelances
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Gérez vos rendez-vous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              sans friction.
            </span>
          </h1>

          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Une page de profil unique pour présenter vos offres et permettre à
            vos clients de réserver un créneau automatiquement. Fini les
            échanges d'emails interminables.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-xl shadow-blue-200"
            >
              Créer ma page
              <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition"
            >
              Voir la démo
            </a>
          </div>

          {/* --- UI Mockup (Visuel Abstrait) --- */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-violet-500/20 blur-3xl -z-10 rounded-full opacity-50" />
            <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-2 md:p-4 overflow-hidden">
              <div className="bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
                  alt="Interface Dashboard"
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <section
        id={section_id}
        className="py-24 bg-slate-50 border-t border-slate-200"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <Feature
              title="Profil Customisable"
              desc="Affichez votre bio, votre photo et vos liens (LinkedIn, Malt, Portfolio) en un seul endroit."
            />
            <Feature
              title="Calendrier Synchronisé"
              desc="Définissez vos disponibilités. Les créneaux réservés disparaissent automatiquement."
            />
            <Feature
              title="Notifications Auto"
              desc="Vous et votre client recevez un email de confirmation instantanément après la réservation."
            />
          </div>
        </div>
      </section>

      {/* --- Footer Simple --- */}
      <footer className="bg-white py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          © 2025 CalendarFreelance. Fait avec ❤️ pour les indépendants.
        </p>
      </footer>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-start text-left group">
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition duration-300">
        <CheckCircle className="text-blue-600" size={24} />
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
