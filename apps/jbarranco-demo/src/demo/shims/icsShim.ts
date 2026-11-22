export interface EventAttributes {
  title?: string;
  description?: string;
  start: [number, number, number, number?, number?];
  end: [number, number, number, number?, number?];
  location?: string;
  status?: string;
  busyStatus?: string;
  organizer?: { name?: string; email?: string };
}

function formatIcsTuple(tuple: [number, number, number, number?, number?]): string {
  const [y, m, d, hh = 9, mm = 0] = tuple;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
}

function buildVEvent(ev: EventAttributes, idx: number): string {
  const dtStart = formatIcsTuple(ev.start);
  const dtEnd = formatIcsTuple(ev.end);
  const summary = (ev.title || "Servicio J.Barranco Demo").replace(/\r?\n/g, " ");
  const desc = (ev.description || "").replace(/\r?\n/g, "\\n");
  const loc = (ev.location || "").replace(/\r?\n/g, " ");
  return [
    "BEGIN:VEVENT",
    `UID:demo-event-${Date.now()}-${idx}@jbarranco-demo.local`,
    `DTSTAMP:${dtStart}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    `STATUS:${ev.status || "CONFIRMED"}`,
    "END:VEVENT",
  ].join("\r\n");
}

export function createEvent(event: EventAttributes): { error: Error | null; value: string } {
  return createEvents([event]);
}

export function createEvents(events: EventAttributes[]): { error: Error | null; value: string } {
  const body = events.map((ev, i) => buildVEvent(ev, i)).join("\r\n");
  const value = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//J.Barranco ERP Demo//ES",
    "CALSCALE:GREGORIAN",
    body,
    "END:VCALENDAR",
  ].join("\r\n");
  return { error: null, value };
}
