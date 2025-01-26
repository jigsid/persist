import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
      },
      defaultProps: {
        colorScheme: "blue",
      },
    },
    Progress: {
      defaultProps: {
        colorScheme: "blue",
        size: "sm",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "blue.500",
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "blue.500",
      },
    },
    Tabs: {
      defaultProps: {
        colorScheme: "blue",
      },
    },
  },
});

export default theme;
