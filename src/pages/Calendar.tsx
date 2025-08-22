import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import {
  Box,
  Heading,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Wrap,
  WrapItem,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const legend = [
  { name: "Leane", color: "#E53E3E" }, // rouge
  { name: "Beau", color: "#38A169" }, // vert
  { name: "Carla", color: "#D69E2E" }, // jaune
  { name: "Pepito", color: "#805AD5" }, // violet
  { name: "Anaelle", color: "#F6AD55" }, // orange
  { name: "Malik", color: "#2B6CB0" }, // bleu foncé
  { name: "Lolo", color: "#ED8936" }, // orange clair
  { name: "Axel", color: "#4FD1C5" }, // turquoise
];

const activities = [
  { title: "Club enfants", duration: 90 }, // en minutes
  { title: "Club ados avec Malik", duration: 90 },
  { title: "Tournoi de foot", duration: 120 },
  { title: "Fitness avec Anaelle", duration: 60 },
  { title: "Aquagym avec Anaelle", duration: 60 },
  { title: "Beach Volley avec Axel", duration: 90 },
  { title: "Soirée Karaoké", duration: 180 },
  { title: "Mini Disco avec Leane", duration: 60 },
  { title: "Spectacle de magie avec Pepito", duration: 60 },
  { title: "Atelier créatif avec Carla", duration: 60 },
];

const DnDCalendar = withDragAndDrop<EventType, object>(Calendar);

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
  const [selectedActivity, setSelectedActivity] = useState<null | {
    title: string;
    duration: number;
  }>(null);

  useEffect(() => {
    if (!team) return;

    const unsubscribe = onSnapshot(
      collection(db, `events-${team}`),
      (snapshot) => {
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
      }
    );

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
    setTitle("");
    setStart("");
    setEnd("");
  };

  const handleSlotDrop = async (slotInfo: any) => {
    const activityData = slotInfo.boxEvent?.dataTransfer?.getData("activity"); // récupère l'activité
    if (!activityData || !team) return;

    const act = JSON.parse(activityData);
    const startDate = new Date(slotInfo.start);
    const endDate = new Date(startDate.getTime() + act.duration * 60000);

    await addDoc(collection(db, `events-${team}`), {
      title: act.title,
      start: Timestamp.fromDate(startDate),
      end: Timestamp.fromDate(endDate),
    });
  };

  // Déplacement d’un événement (drag & drop)
  const handleEventDrop = async ({ event, start, end }: any) => {
    if (!team || !event.id) return;
    const ref = doc(db, `events-${team}`, event.id);
    await updateDoc(ref, {
      start: Timestamp.fromDate(new Date(start)),
      end: Timestamp.fromDate(new Date(end)),
    });
  };

  // Redimensionnement (changement de durée)
  const handleEventResize = async ({ event, start, end }: any) => {
    if (!team || !event.id) return;
    const ref = doc(db, `events-${team}`, event.id);
    await updateDoc(ref, {
      start: Timestamp.fromDate(new Date(start)),
      end: Timestamp.fromDate(new Date(end)),
    });
  };

  return (
    <Box p={6}>
      <Heading mb={6}>Planning {team ? `de l’équipe ${team}` : ""}</Heading>

      <Flex>
        {/* Légende */}
        <Box flex="1.5" ml={6}>
          <Heading size="md" mb={4}>
            Légende Animateurs
          </Heading>
          {legend.map((l) => (
            <Flex key={l.name} align="center" mb={2}>
              <Box w="16px" h="16px" borderRadius="full" bg={l.color} mr={2} />
              <Text>{l.name}</Text>
            </Flex>
          ))}
          {/* Panneau d’activités repliable + scrollable */}
          <Accordion allowToggle mt={6} defaultIndex={[0]}>
            <AccordionItem
              border="1px solid #eee"
              borderRadius="md"
              overflow="hidden"
            >
              <AccordionButton _expanded={{ bg: "gray.100" }}>
                <Box
                  as="span"
                  flex="1"
                  textAlign="left"
                  fontWeight="semibold"
                  maxH="220px"
                >
                  📌 Activités disponibles
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel p={3}>
                <Box
                  maxH="220px"
                  overflowY="auto"
                  pr={1}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={2}
                  bg="white"
                >
                  <Wrap spacing={2}>
                    {activities.map((act) => {
                      const isActive = selectedActivity?.title === act.title;
                      return (
                        <WrapItem key={act.title}>
                          <Button
                            size="sm"
                            variant={isActive ? "solid" : "outline"}
                            colorScheme={isActive ? "blue" : "gray"}
                            onClick={() =>
                              setSelectedActivity(isActive ? null : act)
                            }
                            title={`${act.duration} min`}
                          >
                            {act.title}
                          </Button>
                        </WrapItem>
                      );
                    })}
                  </Wrap>
                </Box>

                <Text mt={3} fontSize="sm" color="gray.600">
                  1) Cliquez une activité • 2) Sélectionnez un créneau dans le
                  calendrier (cliquer/glisser) • 3) L’événement est créé.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
        {/* Calendrier */}
        <Box flex="5">
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor={(event: EventType) => event.start}
            endAccessor={(event: EventType) => event.end}
            style={{ height: 632 }}
            defaultView="week"
            // views={["week", "day"]}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onSelectSlot={(slotInfo) => handleSlotDrop(slotInfo)}
            min={new Date(1970, 1, 1, 10, 0)} // ⏰ commence à 10h
            max={new Date(1970, 1, 1, 23, 0)} // ⏰ finit à 23h
            messages={{
              today: "Aujourd'hui",
              next: "Suivant",
              previous: "Précédent",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
              agenda: "Agenda",
            }}
            slotPropGetter={(date) => {
              const hour = date.getHours();

              // matin : 10h → 12h30
              if (hour >= 10 && hour < 13) {
                return { style: { backgroundColor: "#fde3e3ff" } }; // très léger rouge clair
              }

              // après-midi : 15h → 18h30
              if (hour >= 15 && hour < 19) {
                return { style: { backgroundColor: "#e2f9e2ff" } }; // léger vert clair
              }

              // soir : 21h → 23h
              if (hour >= 21 && hour < 23) {
                return { style: { backgroundColor: "#e2e2f8ff" } }; // léger bleu clair
              }

              // autres heures (non utilisées) → blanc
              return { style: { backgroundColor: "white" } };
            }}
          />
        </Box>
      </Flex>

      {/* Petit formulaire rapide */}
      <Box mt={6}>
        <input
          type="text"
          placeholder="Titre (nom de l’animateur)"
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
