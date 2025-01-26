import {
  Container,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  type ThemingProps,
} from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { ChakraProvider } from "./providers/ChakraProvider";
import { LoadingSpinner } from "./components/LoadingSpinner";

const MusicVideoGenerator = lazy(
  () => import("./components/MusicVideoGenerator")
);
const TikTokGenerator = lazy(() => import("./components/TikTokGenerator"));

function App() {
  const tabProps: ThemingProps = {
    colorScheme: "blue",
    variant: "enclosed",
  };

  return (
    <ChakraProvider>
      <Container maxW="container.lg" py={10}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">Video Generation Studio</Heading>

          <Tabs isFitted {...tabProps} width="100%">
            <TabList>
              <Tab>Music Video Generator</Tab>
              <Tab>TikTok Video Generator</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Suspense
                  fallback={
                    <LoadingSpinner message="Loading Music Video Generator..." />
                  }
                >
                  <MusicVideoGenerator />
                </Suspense>
              </TabPanel>
              <TabPanel>
                <Suspense
                  fallback={
                    <LoadingSpinner message="Loading TikTok Video Generator..." />
                  }
                >
                  <TikTokGenerator />
                </Suspense>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
