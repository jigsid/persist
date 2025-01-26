import {
  ChakraProvider as ChakraUIProvider,
  type ChakraProviderProps,
} from "@chakra-ui/react";
import theme from "../theme";

interface Props {
  children: React.ReactNode;
}

export function ChakraProvider({ children }: Props) {
  const providerProps: ChakraProviderProps = {
    theme,
    resetCSS: true,
  };

  return <ChakraUIProvider {...providerProps}>{children}</ChakraUIProvider>;
}
