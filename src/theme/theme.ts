import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    sandaya: {
      gold: "#C6A560",     // Doré Sandaya
      green: "#006644",    // Vert profond
      beige: "#F5F2EB",    // Fond clair
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Poppins', sans-serif",
  },
});

export default theme;
