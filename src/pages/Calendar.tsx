import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { Box, Heading, Input, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";
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
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const fetchedEvents: EventType[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          title: data.title,
          start: data.start?.toDate?.() || new Date(),
          end: data.end?.toDate?.() || new Date(),
        };
      });
      setEvents(fetchedEvents);
    });

    return () => unsubscribe();
  }, []);

  const handleAddEvent = async () => {
    if (!title || !start || !end) {
      alert("Remplis tous les champs !");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        title,
        start: Timestamp.fromDate(new Date(start)),
        end: Timestamp.fromDate(new Date(end)),
      });

      // Réinitialise les champs
      setTitle("");
      setStart("");
      setEnd("");
    } catch (error) {
      console.error("Erreur ajout événement :", error);
    }
  };

  return (
    <Box p={6}>
      <Heading mb={6}>Planning des espaces verts</Heading>

      {/* Calendrier */}
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

            {/* Formulaire d'ajout */}
      <VStack spacing={3} mb={6} p={8} align="start">
        <Input
          placeholder="Titre de l'événement"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <Button colorScheme="green" onClick={handleAddEvent}>
          Ajouter
        </Button>
      </VStack>
    </Box>
  );
}
