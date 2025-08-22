import { type ReactNode } from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

type LayoutProps = {
  children: ReactNode;
  logoSrc?: string;
};

export default function Layout({ children, logoSrc }: LayoutProps) {
  const navigate = useNavigate();
  const { user, role, employee, signOutApp } = useAuth();

  return (
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      <Box as="header" bg="sandaya.doré" color="white" py={4} px={8} shadow="sm">
        <Flex justify="space-between" align="center">
          <Flex align="center" cursor="pointer" onClick={() => navigate("/")}>
            {
              <Text fontSize="xl" fontWeight="bold">
                Sandaya – Plein Air des Chênes <Image
                src={logoSrc} 
                alt="Logo Sandaya"
                height="30px"
                mr={3}
                objectFit="contain"
              />
              </Text>
              
            }
          </Flex>

          {/* Navigation */}
          <HStack spacing={4}>
            <Button
              variant="ghost"
              color="white"
              _hover={{ bg: "sandaya.jaune" }}
              onClick={() => navigate("/")}
            >
              Accueil
            </Button>

            {/* Menu déroulant Planning */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color="white"
                _hover={{ bg: "sandaya.jaune" }}
              >
                Planning
              </MenuButton>
              <MenuList bg="sandaya.doré" color="white">
                <MenuItem
                  onClick={() => navigate("/calendar/animation")}
                  bg="sandaya.doré"
                  color="white"
                  _hover={{ bg: "sandaya.jaune" }}
                >
                  Animation
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/calendar/bar")}
                  bg="sandaya.doré"
                  color="white"
                  _hover={{ bg: "sandaya.jaune" }}
                >
                  Bar
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/calendar/pool")}
                  bg="sandaya.doré"
                  color="white"
                  _hover={{ bg: "sandaya.jaune" }}
                >
                  Surveillance de baignade
                </MenuItem>
                <MenuItem
                  onClick={() => navigate("/calendar/reception")}
                  bg="sandaya.doré"
                  color="white"
                  _hover={{ bg: "sandaya.jaune" }}
                >
                  Réception
                </MenuItem>
              </MenuList>
            </Menu>

            {/* Connexion / Déconnexion */}
            {!user ? (
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "sandaya.jaune" }}
                onClick={() => navigate("/login")}
              >
                Connexion
              </Button>
            ) : (
              <>
                <Text fontSize="sm" color="white">
                  <strong>{employee ?? "Utilisateur"}</strong>
                  {role ? ` (${role})` : ""}
                </Text>
                <Button
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "sandaya.jaune" }}
                  onClick={async () => {
                    await signOutApp();
                    navigate("/");
                  }}
                >
                  Déconnexion
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Main content */}
      <Box as="main" flex="1" px={8} py={6} bg="whiteAlpha.900">
        {children}
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        bg="sandaya.doré"
        color="white"
        py={3}
        px={6}
        textAlign="center"
      >
        <Text fontSize="sm">
          © {new Date().getFullYear()} Sandaya – Plein Air des Chênes
        </Text>
      </Box>
    </Flex>
  );
}
