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
import withDragAndDrop, {
  type DragFromOutsideItemArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const locales = { fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const legend = [
  { name: "Leane", color: "#E53E3E" },
  { name: "Beau", color: "#38A169" },
  { name: "Carla", color: "#D69E2E" },
  { name: "Pepito", color: "#805AD5" },
  { name: "Anaelle", color: "#F6AD55" },
  { name: "Malik", color: "#2B6CB0" },
  { name: "Lolo", color: "#ED8936" },
  { name: "Axel", color: "#4FD1C5" },
];

const activities = [
  { title: "Club enfants", duration: 90 },
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
  const { team } = useParams();
  const [events, setEvents] = useState<EventType[]>([]);
  // ← “prototype” en cours de drag (pas un event final)
  const [draggedActivity, setDraggedActivity] = useState<{
    title: string;
    duration: number;
  } | null>(null);

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

  // 👇 mapping pratique animateur → couleur
  const legendMap: Record<string, string> = legend.reduce(
    (acc, l) => ({ ...acc, [l.name]: l.color }),
    {}
  );

  // Déplacement d’un event déjà existant
  const handleEventDrop = async ({
    event,
    start,
    end,
  }: {
    event: EventType;
    start: Date;
    end: Date;
  }) => {
    if (!team || !event.id) return;
    const ref = doc(db, `events-${team}`, event.id);
    await updateDoc(ref, {
      start: Timestamp.fromDate(new Date(start)),
      end: Timestamp.fromDate(new Date(end)),
    });
  };

  // Redimensionnement (changer durée)
  const handleEventResize = async ({ event, start, end }: any) => {
    if (!team || !event.id) return;
    const ref = doc(db, `events-${team}`, event.id);
    await updateDoc(ref, {
      start: Timestamp.fromDate(new Date(start)),
      end: Timestamp.fromDate(new Date(end)),
    });
  };

  // ✅ Quand je lâche une bulle dans le calendrier
  const handleDropFromOutside = (args: { start: Date | string }) => {
    if (!team || !draggedActivity) return;

    // Ensure start is a Date object
    const startDate =
      typeof args.start === "string" ? new Date(args.start) : args.start;

    const event: EventType = {
      title: draggedActivity.title,
      start: startDate,
      end: new Date(startDate.getTime() + draggedActivity.duration * 60000),
    };

    addDoc(collection(db, `events-${team}`), {
      title: event.title,
      start: Timestamp.fromDate(event.start),
      end: Timestamp.fromDate(event.end),
    });

    setDraggedActivity(null);
  };

  // ✅ Ce que le calendrier affiche pendant le drag
  const dragFromOutsideItem = (): EventType => {
    const now = new Date();
    if (!draggedActivity) {
      // Provide a fallback event to satisfy the type
      return {
        title: "",
        start: now,
        end: now,
      };
    }
    return {
      title: draggedActivity.title,
      start: now,
      end: new Date(now.getTime() + draggedActivity.duration * 60000),
    };
  };

  // Composant Bulle draggable (react-dnd v14 : utiliser `item` + `end`)
  const ActivityBubble = ({
    activity,
  }: {
    activity: { title: string; duration: number };
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ACTIVITY",
      // quand on commence à dragger, on mémorise le prototype
      item: () => {
        setDraggedActivity(activity);
        return activity;
      },
      end: () => {
        // fin de drag (réussi ou non) → on nettoie
        setDraggedActivity(null);
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <Box
        ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
        p={2}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        bg="white"
        cursor="grab"
        opacity={isDragging ? 0.5 : 1}
      >
        {activity.title}
      </Box>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={6}>
        <Heading mb={6}>Planning {team ? `de l’équipe ${team}` : ""}</Heading>

        <Flex>
          {/* Légende + activités */}
          <Box flex="1.5" ml={6}>
            <Heading size="md" mb={4}>
              Légende Animateurs
            </Heading>
            {legend.map((l) => (
              <Flex key={l.name} align="center" mb={2}>
                <Box
                  w="16px"
                  h="16px"
                  borderRadius="full"
                  bg={l.color}
                  mr={2}
                />
                <Text>{l.name}</Text>
              </Flex>
            ))}

            {/* Activités */}
            <Accordion allowToggle mt={6} defaultIndex={[0]}>
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "gray.100" }}>
                  <Box flex="1" textAlign="left" fontWeight="semibold">
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
                      {activities.map((act) => (
                        <WrapItem key={act.title}>
                          <ActivityBubble activity={act} />
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                  <Text mt={3} fontSize="sm" color="gray.600">
                    Glissez une activité et déposez-la dans le calendrier.
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
              startAccessor="start"
              endAccessor="end"
              style={{ height: 632 }}
              defaultView="week"
              resizable
              draggableAccessor={() => true}
              onEventDrop={handleEventDrop as any}
              onEventResize={handleEventResize}
              dragFromOutsideItem={dragFromOutsideItem as any}
              onDropFromOutside={handleDropFromOutside}
              onDragOver={(e) => e.preventDefault()}
              min={new Date(1970, 1, 1, 10, 0)}
              max={new Date(1970, 1, 1, 23, 0)}
              messages={{
                today: "Aujourd'hui",
                next: "Suivant",
                previous: "Précédent",
                month: "Mois",
                week: "Semaine",
                day: "Jour",
                agenda: "Agenda",
              }}
              // ✅ Formats FR : heures et jours
              formats={{
                timeGutterFormat: (date, culture, localizer) =>
                  localizer ? localizer.format(date, "HH'h'", culture) : "", // ex: 10h, 11h
                dayFormat: (date, culture, localizer) =>
                  localizer ? localizer.format(date, "EEE dd", culture) : "", // ex: lun 18, mar 19
              }}
              slotPropGetter={(date) => {
                const hour = date.getHours();
                if (hour >= 10 && hour < 13)
                  return { style: { backgroundColor: "#fde3e3ff" } };
                if (hour >= 15 && hour < 19)
                  return { style: { backgroundColor: "#e2f9e2ff" } };
                if (hour >= 21 && hour < 23)
                  return { style: { backgroundColor: "#e2e2f8ff" } };
                return { style: { backgroundColor: "white" } };
              }}
              // 👇 coloration des événements
              eventPropGetter={(event) => {
                // on cherche si le titre contient le nom d’un animateur connu
                const found = Object.keys(legendMap).find((name) =>
                  event.title.toLowerCase().includes(name.toLowerCase())
                );

                const color = found ? legendMap[found] : "#3182CE"; // bleu par défaut
                return {
                  style: {
                    backgroundColor: color,
                    color: "white",
                    borderRadius: "6px",
                    padding: "2px 4px",
                    border: "none",
                  },
                };
              }}
            />
          </Box>
        </Flex>
      </Box>
    </DndProvider>
  );
}
