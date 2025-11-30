import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Pour le calendrier en français
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Style de base du calendrier

// API URL en dur pour aller vite (à adapter si ton port change)
const API_URL = "http://localhost:1234/api";

interface BookingCalendarProps {
  username: string;
}

export function BookingCalendar({ username }: BookingCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // 1. Charger les créneaux quand la date change
  useEffect(() => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      setLoading(true);
      setSlots([]); // Reset slots

      fetch(`${API_URL}/${username}/slots?date=${dateStr}`)
        .then((res) => res.json())
        .then((data) => {
          setSlots(data.slots || []);
        })
        .catch((err) => console.error("Erreur slots:", err))
        .finally(() => setLoading(false));
    }
  }, [date, username]);

  // 2. Gérer la réservation
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedSlot) return;

    setBookingStatus("loading");

    try {
      const res = await fetch(`${API_URL}/${username}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: formData.name,
          client_email: formData.email,
          date: format(date, "yyyy-MM-dd"),
          time: selectedSlot,
        }),
      });

      if (!res.ok) throw new Error("Erreur réservation");
      setBookingStatus("success");
    } catch (err) {
      console.error(err);
      setBookingStatus("error");
    }
  };

  if (bookingStatus === "success") {
    return (
      <div className="bg-green-50 p-8 rounded-xl text-center border border-green-200">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-800">RDV Confirmé !</h3>
        <p className="text-green-700 mt-2">
          Un email de confirmation vous a été envoyé.
        </p>
        <button
          type="button"
          onClick={() => {
            setBookingStatus("idle");
            setSelectedSlot(null);
          }}
          className="mt-6 text-sm font-semibold text-green-700 hover:underline"
        >
          Réserver un autre créneau
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Réserver un créneau</h2>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* Colonne 1 : Calendrier */}
        <div className="flex justify-center">
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={fr}
            disabled={{ before: new Date() }} // Pas de date passée
            classNames={{
              day_selected:
                "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
              day_today: "font-bold text-blue-600",
            }}
          />
        </div>

        {/* Colonne 2 : Créneaux & Formulaire */}
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">
            Horaires disponibles le {date && format(date, "dd/MM/yyyy")}
          </h3>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="animate-spin" /> Chargement...
            </div>
          ) : slots.length === 0 ? (
            <p className="text-slate-400 text-sm italic">
              Aucun créneau disponible ce jour.
            </p>
          ) : !selectedSlot ? (
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className="px-3 py-2 text-sm border border-blue-100 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            // Formulaire affiché une fois l'heure choisie
            <form
              onSubmit={handleBooking}
              className="space-y-4 animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-900">
                  {selectedSlot}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Modifier
                </button>
              </div>

              <input
                type="text"
                placeholder="Votre Nom"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Votre Email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <button
                type="submit"
                disabled={bookingStatus === "loading"}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {bookingStatus === "loading" && (
                  <Loader2 className="animate-spin" size={18} />
                )}
                Confirmer le RDV
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
