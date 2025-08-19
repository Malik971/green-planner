import { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

type Shift = {
  id: string;
  employee: string;
  day: string;
  start: Date;
  end: Date;
  color?: string;
};

const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export default function PlanningBar() {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "planning_bar"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          employee: d.employee,
          day: d.day,
          start: d.start.toDate(),
          end: d.end.toDate(),
          color: d.color || "#3182CE",
        } as Shift;
      });
      setShifts(data);
    });

    return () => unsubscribe();
  }, []);

  // Récupérer la liste unique des salariés
  const employees = Array.from(new Set(shifts.map((s) => s.employee)));

  return (
    <Box p={6}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Planning du Bar 🍹
      </Text>

      <Table variant="simple" size="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>Jour</Th>
            {employees.map((emp) => (
              <Th key={emp}>{emp}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {days.map((day) => (
            <Tr key={day}>
              <Td fontWeight="bold">{day}</Td>
              {employees.map((emp) => {
                const shift = shifts.find((s) => s.employee === emp && s.day === day);
                return (
                  <Td key={emp} textAlign="center">
                    {shift ? (
                      <Box
                        bg={shift.color}
                        color="white"
                        borderRadius="md"
                        p={1}
                        fontSize="xs"
                      >
                        {shift.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                        -{" "}
                        {shift.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Box>
                    ) : (
                      "-"
                    )}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
