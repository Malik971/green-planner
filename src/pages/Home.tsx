import { Button, Heading, Text, VStack, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={12} px={6}>
      <VStack spacing={6} maxW="lg" mx="auto">
        <Heading as="h1" size="2xl">
          Bienvenue sur <span style={{ color: "#38A169" }}>GreenPlanner</span>
        </Heading>

        <Text fontSize="lg" color="gray.600">
          Une application pour gérer simplement et efficacement vos parcs et espaces verts 🏞️
        </Text>

        <Text fontSize="md" color="gray.500">
          Créez, planifiez et suivez vos interventions directement depuis votre navigateur.
        </Text>

        <Button
          colorScheme="green"
          size="lg"
          onClick={() => navigate("/calendar")}
        >
          Accéder au planning
        </Button>
      </VStack>
    </Box>
  );
}
