// src/pages/PlanningAnimation.tsx
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, HStack, Circle } from "@chakra-ui/react";

export default function PlanningAnimation() {
  // 🔹 Légende des animateurs
  const animators = [
    { name: "Leane", color: "pink.400" },
    { name: "Tiff", color: "yellow.400" },
    { name: "Beau", color: "cyan.400" },
    { name: "Carla", color: "red.400" },
    { name: "Pepito", color: "teal.400" },
    { name: "Anaelle", color: "green.400" },
    { name: "Malik", color: "blue.400" },
    { name: "Lolo", color: "orange.400" },
  ];

  // 🔹 Jours de la semaine
  const days = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  // 🔹 Créneaux horaires
  const slots = ["Matin", "Après-midi", "Soirée"];

  // 🔹 Exemple d’activités statiques
  const activities: Record<string, Record<string, string>> = {
    Matin: {
      Samedi: "Aquagym 🩷 Leane",
      Dimanche: "Cross Fit 🟢 Anaelle",
      Lundi: "Circuit Training 🟢 Anaelle",
      Mardi: "Basket 🟢 Anaelle",
      Mercredi: "Beach Volley 🔵 Malik",
      Jeudi: "Badminton 🟠 Lolo",
      Vendredi: "Tennis 🔴 Carla",
    },
    "Après-midi": {
      Samedi: "Water Polo 🔵 Malik",
      Dimanche: "Volley 🟠 Lolo",
      Lundi: "Aquasplash 🩷 Leane",
      Mardi: "Foot 🟢 Anaelle",
      Mercredi: "Aquasplash 🔵 Malik",
      Jeudi: "Water Volley 🟠 Lolo",
      Vendredi: "Pétanque 🔴 Carla",
    },
    Soirée: {
      Samedi: "Karaoke 🎤 Tous",
      Dimanche: "Cabaret 🎭 Anaelle",
      Lundi: "Mini Disco 🟢 Anaelle",
      Mardi: "Flying D 🎪 Malik",
      Mercredi: "Big Game 🎲 Tous",
      Jeudi: "Foam Party 💦 Malik",
      Vendredi: "Soirée Pirates 🏴‍☠️ Tous",
    },
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Programme d’animations – Semaine du 09 au 15 août
      </Text>

      {/* 🔹 Légende animateurs */}
      <HStack spacing={6} mb={6}>
        {animators.map((a) => (
          <HStack key={a.name}>
            <Circle size="12px" bg={a.color} />
            <Text fontSize="sm">{a.name}</Text>
          </HStack>
        ))}
      </HStack>

      {/* 🔹 Tableau des activités */}
      <Table variant="simple" size="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>Créneau</Th>
            {days.map((day) => (
              <Th key={day}>{day}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {slots.map((slot) => (
            <Tr key={slot}>
              <Td fontWeight="bold">{slot}</Td>
              {days.map((day) => (
                <Td key={day} textAlign="center">
                  {activities[slot][day] || "-"}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
