import { useState } from "react";
import {
  Box,
  VStack,
  Textarea,
  Button,
  Text,
  useToast,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Select,
  FormControl,
  FormLabel,
  type BoxProps,
  type ButtonProps,
  type SelectProps,
  type SliderProps,
} from "@chakra-ui/react";
import { generateTikTokVideo } from "../services/api";
import type { TikTokGenerationRequest } from "../services/api";

export default function TikTokGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<{
    video_url: string;
    script: string;
  } | null>(null);
  const [textPosition, setTextPosition] = useState("middle");
  const [voiceStyle, setVoiceStyle] = useState("default");
  const [visualStyle, setVisualStyle] = useState("realistic");
  const [textSize, setTextSize] = useState(50);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const request: TikTokGenerationRequest = {
        prompt: prompt.trim(),
        text_position: textPosition,
        voice_style: voiceStyle,
        visual_style: visualStyle,
      };

      const response = await generateTikTokVideo(request);
      setGeneratedVideo(response);
      toast({
        title: "Video generated successfully!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error generating video",
        description:
          error instanceof Error ? error.message : "Please try again",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    toast({
      title: "Sharing coming soon!",
      status: "info",
      duration: 3000,
    });
  };

  const boxProps: BoxProps = {
    w: "100%",
    p: 6,
    borderWidth: 1,
    borderRadius: "lg",
  };

  const buttonProps: ButtonProps = {
    colorScheme: "blue",
    width: "100%",
    isLoading: loading,
    loadingText: "Generating...",
  };

  const selectProps: SelectProps = {
    focusBorderColor: "blue.500",
  };

  const sliderProps: SliderProps = {
    focusThumbOnChange: false,
    min: 0,
    max: 100,
    step: 1,
  };

  return (
    <Box w="100%">
      <Box {...boxProps}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Enter your video idea</FormLabel>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video idea..."
              size="lg"
              rows={4}
              focusBorderColor="blue.500"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Visual Style</FormLabel>
            <Select
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              {...selectProps}
            >
              <option value="realistic">Realistic</option>
              <option value="animated">Animated</option>
              <option value="stylized">Stylized</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Text Position</FormLabel>
            <Select
              value={textPosition}
              onChange={(e) => setTextPosition(e.target.value)}
              {...selectProps}
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Voice Style</FormLabel>
            <Select
              value={voiceStyle}
              onChange={(e) => setVoiceStyle(e.target.value)}
              {...selectProps}
            >
              <option value="default">Default</option>
              <option value="energetic">Energetic</option>
              <option value="professional">Professional</option>
            </Select>
          </FormControl>

          <Button onClick={handleSubmit} {...buttonProps}>
            Generate Video
          </Button>
        </VStack>
      </Box>

      {loading && (
        <Box w="100%" mt={4}>
          <Text mb={2}>
            Generating your TikTok video... This may take a few minutes.
          </Text>
          <Progress size="xs" isIndeterminate colorScheme="blue" />
        </Box>
      )}

      {generatedVideo && (
        <Box w="100%" mt={6}>
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Preview</Tab>
              <Tab>Script</Tab>
              <Tab>Customize</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box
                  maxW="sm"
                  mx="auto"
                  aspectRatio={9 / 16}
                  overflow="hidden"
                  borderRadius="lg"
                  bg="gray.100"
                >
                  <video
                    controls
                    src={generatedVideo.video_url}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <VStack mt={4} spacing={2}>
                  <Button colorScheme="green" onClick={handleShare}>
                    Share
                  </Button>
                  <Button
                    as="a"
                    href={generatedVideo.video_url}
                    download
                    colorScheme="blue"
                    variant="outline"
                  >
                    Download
                  </Button>
                </VStack>
              </TabPanel>

              <TabPanel>
                <Box p={4} borderWidth={1} borderRadius="md">
                  <Text whiteSpace="pre-wrap">{generatedVideo.script}</Text>
                </Box>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Text Size</FormLabel>
                    <Slider
                      value={textSize}
                      onChange={setTextSize}
                      {...sliderProps}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {textSize}%
                    </Text>
                  </FormControl>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </Box>
  );
}
