import { type ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Flex direction="column" minHeight="100vh">
      {/* Header */}
      <Box as="header" bg="green.600" color="white" py={4} px={6}>
        <Text fontSize="xl" fontWeight="bold">GreenPlanner 🌱</Text>
      </Box>

      {/* Main content */}
      <Box as="main" flex="1" px={6} py={4}>
        {children}
      </Box>

      {/* Footer */}
      <Box as="footer" bg="gray.100" py={3} px={6} textAlign="center">
        <Text fontSize="sm">© {new Date().getFullYear()} Malik Ibo</Text>
      </Box>
    </Flex>
  );
}
