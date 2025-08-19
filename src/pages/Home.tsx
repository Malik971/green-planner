import { Button, Heading, Text, VStack, Box, SimpleGrid, Card, CardBody, Icon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaGlassMartiniAlt, FaSwimmer, FaUmbrellaBeach, FaConciergeBell } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const plannings = [
    { name: "Animation", icon: FaUmbrellaBeach, path: "/calendar/animation" },
    { name: "Bar", icon: FaGlassMartiniAlt, path: "/calendar/bar" },
    { name: "Surveillance de baignade", icon: FaSwimmer, path: "/calendar/pool" },
    { name: "Réception", icon: FaConciergeBell, path: "/calendar/reception" },
  ];

  return (
    <Box textAlign="center" py={12} px={6}>
      <VStack spacing={6} maxW="5xl" mx="auto">
        {/* Titre principal */}
        <Heading as="h1" size="2xl" color="sandaya.gold">
          Sandaya Planning Manager
        </Heading>

        <Text fontSize="lg" color="gray.700">
          Gérez facilement les plannings de vos équipes au camping 🏕️
        </Text>

        <Text fontSize="md" color="gray.600">
          Animation, bar, piscine, réception… chaque service dispose de son espace dédié.  
          Les chefs d’équipe peuvent modifier, les membres consultent.
        </Text>

        {/* Liste des plannings */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mt={8} w="full">
          {plannings.map((planning) => (
            <Card
              key={planning.name}
              border="1px solid"
              borderColor="sandaya.doré"
              shadow="sm"
              _hover={{ shadow: "md", cursor: "pointer", transform: "scale(1.02)" }}
              transition="all 0.2s"
              onClick={() => navigate(planning.path)}
            >
              <CardBody textAlign="center">
                <Icon as={planning.icon} boxSize={10} color="sandaya.gold" mb={4} />
                <Heading size="md" color="sandaya.green">
                  {planning.name}
                </Heading>
                <Text mt={2} color="gray.600">
                  Accéder au planning de l’équipe {planning.name.toLowerCase()}.
                </Text>
                <Button
                  mt={4}
                  size="md"
                  bg="sandaya.gold"
                  color="white"
                  _hover={{ bg: "sandaya.green" }}
                >
                  Voir le planning
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Ajouter un planning */}
        <Button
          mt={10}
          size="lg"
          bg="sandaya.gold"
          color="white"
          backgroundColor="sandaya.green"
          _hover={{ bg: "sandaya.green" }}
          onClick={() => navigate("/calendar/new")}
        >
          ➕ Ajouter un nouveau planning
        </Button>
      </VStack>
    </Box>
  );
}
