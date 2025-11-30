import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parse,
  set,
} from "date-fns";

export const SLOT_DURATION = 30; // Durée en minutes

/**
 * Génère les créneaux disponibles
 */
export function calculateFreeSlots(
  date: Date, // "YYYY-MM-DD"
  availabilities: { start_time: string; end_time: string }[],
  appointments: { start_date: Date; end_date: Date }[],
): string[] {
  const dateStr = date.toString();
  const requestedDate = parse(dateStr, "yyyy-MM-dd", new Date());
  const now = new Date();
  const freeSlots: string[] = [];

  // Pour chaque plage de disponibilité (ex: 09:00 -> 12:00)
  for (const dispo of availabilities) {
    let slotStart = parseTime(dateStr, dispo.start_time);
    const slotEnd = parseTime(dateStr, dispo.end_time);

    // Si c'est aujourd'hui, on ne propose pas les heures passées
    if (isSameDay(requestedDate, now)) {
      const nextSlot = roundToNextSlot(now, SLOT_DURATION);
      if (isAfter(nextSlot, slotStart)) {
        slotStart = nextSlot;
      }
    }

    // On avance de 30min en 30min
    while (
      isBefore(addMinutes(slotStart, SLOT_DURATION), slotEnd) ||
      slotStart.getTime() === slotEnd.getTime()
    ) {
      const currentSlotEnd = addMinutes(slotStart, SLOT_DURATION);

      // Arrêt si on dépasse la fin de dispo
      if (isAfter(currentSlotEnd, slotEnd)) break;

      // Vérif conflit RDV
      const isBooked = appointments.some((apt) => {
        return (
          isBefore(slotStart, apt.end_date) &&
          isAfter(currentSlotEnd, apt.start_date)
        );
      });

      if (!isBooked) {
        freeSlots.push(format(slotStart, "HH:mm"));
      }

      slotStart = addMinutes(slotStart, SLOT_DURATION);
    }
  }

  return freeSlots;
}

// Helpers
function parseTime(dateStr: string, timeStr: string): Date {
  return parse(`${dateStr} ${timeStr}`, "yyyy-MM-dd HH:mm:ss", new Date());
}

function roundToNextSlot(date: Date, durationMinutes: number): Date {
  const minutes = date.getMinutes();
  const remainder = minutes % durationMinutes;
  const add = durationMinutes - remainder;
  return set(addMinutes(date, add), { seconds: 0, milliseconds: 0 });
}
