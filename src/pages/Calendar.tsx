import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type EventType = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
};

export default function CalendarPage() {
  const { team } = useParams(); // ← récupère animation / bar / reception
  const [events, setEvents] = useState<EventType[]>([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (!team) return;

    const unsubscribe = onSnapshot(collection(db, `events-${team}`), (snapshot) => {
      const fetchedEvents: EventType[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: data.start?.toDate?.() || new Date(),
          end: data.end?.toDate?.() || new Date(),
        };
      });
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, [team]);

  // Ajout d’un événement
  const handleAddEvent = async () => {
    if (!team || !title || !start || !end) return;
    await addDoc(collection(db, `events-${team}`), {
      title,
      start: Timestamp.fromDate(new Date(start)),
      end: Timestamp.fromDate(new Date(end)),
    });
    setTitle(""); setStart(""); setEnd("");
  };

  return (
    <Box p={6}>
      <Heading mb={6}>
        Planning {team ? `de l’équipe ${team}` : ""}
      </Heading>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />

      {/* Petit formulaire rapide */}
      <Box mt={6}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={handleAddEvent}>Ajouter</button>
      </Box>
    </Box>
  );
}
