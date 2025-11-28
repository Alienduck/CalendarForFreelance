import { addMinutes, format, isAfter, isBefore, parse, set } from "date-fns";

export const SLOT_DURATION = 30; // Durée en minutes

/**
 * Génère les créneaux disponibles en soustrayant les RDV des disponibilités
 */
export function calculateFreeSlots(
  dateStr: string, // "YYYY-MM-DD"
  availabilities: { start_time: string; end_time: string }[],
  appointments: { start_date: Date; end_date: Date }[],
): string[] {
  const requestedDate = parse(dateStr, "yyyy-MM-dd", new Date());
  const now = new Date();
  const freeSlots: string[] = [];

  // Pour chaque plage de disponibilité du freelance (ex: 09:00 -> 12:00)
  for (const dispo of availabilities) {
    // On construit les objets Date complets pour le début et la fin de la dispo
    let slotStart = parseTime(dateStr, dispo.start_time);
    const slotEnd = parseTime(dateStr, dispo.end_time);

    // Si c'est aujourd'hui, on ne propose pas les créneaux passés
    if (isSameDay(requestedDate, now)) {
      const nextSlot = roundToNextSlot(now, SLOT_DURATION);
      if (isAfter(nextSlot, slotStart)) {
        slotStart = nextSlot;
      }
    }

    // On avance de 30min en 30min tant qu'on est dans la plage horaire
    while (
      isBefore(addMinutes(slotStart, SLOT_DURATION), slotEnd) ||
      slotStart.getTime() === slotEnd.getTime()
    ) {
      const currentSlotEnd = addMinutes(slotStart, SLOT_DURATION);

      // Si le créneau dépasse la fin de dispo, on arrête
      if (isAfter(currentSlotEnd, slotEnd)) break;

      // Vérification de conflit avec un RDV existant
      const isBooked = appointments.some((apt) => {
        // Chevauchement : (DebutA < FinB) et (FinA > DebutB)
        return (
          isBefore(slotStart, apt.end_date) &&
          isAfter(currentSlotEnd, apt.start_date)
        );
      });

      if (!isBooked) {
        freeSlots.push(format(slotStart, "HH:mm"));
      }

      // On passe au créneau suivant
      slotStart = addMinutes(slotStart, SLOT_DURATION);
    }
  }

  return freeSlots;
}

// Helpers
function parseTime(dateStr: string, timeStr: string): Date {
  return parse(`${dateStr} ${timeStr}`, "yyyy-MM-dd HH:mm:ss", new Date());
}

function isSameDay(d1: Date, d2: Date) {
  return format(d1, "yyyy-MM-dd") === format(d2, "yyyy-MM-dd");
}

function roundToNextSlot(date: Date, durationMinutes: number): Date {
  const minutes = date.getMinutes();
  const remainder = minutes % durationMinutes;
  const add = durationMinutes - remainder;
  return set(addMinutes(date, add), { seconds: 0, milliseconds: 0 });
}
