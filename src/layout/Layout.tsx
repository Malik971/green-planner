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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      <Box
        as="header"
        bg="sandaya.doré"
        color="white"
        py={4}
        px={8}
        shadow="sm"
      >
        <Flex justify="space-between" align="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            Sandaya – Plein Air des Chênes 🌴
          </Text>

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
