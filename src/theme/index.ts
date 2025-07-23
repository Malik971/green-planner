// src/theme/index.ts
import { extendTheme } from "@chakra-ui/theme-utils";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f5fbe9",
      100: "#e0f1c8",
      200: "#c9e5a4",
      300: "#b0d980",
      400: "#96ce5d",
      500: "#7cb544",     // 💚 Vert forêt (principal)
      600: "#639031",
      700: "#496c1e",
      800: "#2f490c",
      900: "#152700",
      gold: "#d4af37",     // ✨ Doré
    },
  },
  fonts: {
    heading: `'Segoe UI', sans-serif`,
    body: `'Segoe UI', sans-serif`,
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
        gold: {
          bg: "brand.gold",
          color: "black",
          _hover: {
            bg: "yellow.400",
          },
        },
      },
    },
  },
});

export default theme;
