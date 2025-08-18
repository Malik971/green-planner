import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    sandaya: {
      doré: "#AC9B6A",       // teinte dorée Sandaya
      jaune: "#fbbb21",     // vert nature (Chakra vert foncé)
      ciel: "#3182CE",        // bleu doux pour accents
    },
  },
  styles: {
    global: {
      "body": {
        bg: "whiteAlpha.50",
        color: "gray.800",
      },
      "header, footer": {
        bg: "sandaya.doré",
        color: "white",
      },
    },
  },
  components: {
    Button: {
      variants: {
        doré: {
          bg: "sandaya.doré",
          color: "white",
          _hover: { bg: "sandaya.végétal" },
        },
        ciel: {
          bg: "sandaya.ciel",
          color: "white",
          _hover: { bg: "blue.600" },
        },
      },
    },
  },
});

export default theme;
