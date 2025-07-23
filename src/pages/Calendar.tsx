import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type EventType = {
  title: string;
  start: Date;
  end: Date;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const fetchedEvents: EventType[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          title: data.title,
          start: data.start.toDate(),
          end: data.end.toDate(),
        };
      });
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  return (
    <Box p={6}>
      <Heading mb={6}>Planning des espaces verts</Heading>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        messages={{
          today: "Aujourd'hui",
          next: "Suivant",
          previous: "Précédent",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
        }}
      />
    </Box>
  );
}
