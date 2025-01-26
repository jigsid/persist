import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
  Progress,
  type BoxProps,
  type ButtonProps,
  type SelectProps,
  type InputProps,
} from "@chakra-ui/react";
import { generateMusicVideo } from "../services/api";

export default function MusicVideoGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState("abstract");
  const [effects, setEffects] = useState("default");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await generateMusicVideo(file, theme, effects);
      setVideoUrl(response.video_url);
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

  const boxProps: BoxProps = {
    w: "100%",
    p: 6,
    borderWidth: 1,
    borderRadius: "lg",
  };

  const selectProps: SelectProps = {
    focusBorderColor: "blue.500",
  };

  const buttonProps: ButtonProps = {
    colorScheme: "blue",
    width: "100%",
    isLoading: loading,
    loadingText: "Generating...",
  };

  const inputProps: InputProps = {
    focusBorderColor: "blue.500",
  };

  return (
    <Box w="100%">
      <Box {...boxProps}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Upload Song</FormLabel>
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                {...inputProps}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Visual Theme</FormLabel>
              <Select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                {...selectProps}
              >
                <option value="realistic">Realistic</option>
                <option value="animated">Animated</option>
                <option value="abstract">Abstract</option>
                <option value="nature">Nature</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Effects</FormLabel>
              <Select
                value={effects}
                onChange={(e) => setEffects(e.target.value)}
                {...selectProps}
              >
                <option value="default">Default</option>
                <option value="intense">Intense</option>
                <option value="subtle">Subtle</option>
              </Select>
            </FormControl>

            <Button type="submit" {...buttonProps}>
              Generate Video
            </Button>
          </VStack>
        </form>
      </Box>

      {loading && (
        <Box w="100%" mt={4}>
          <Text mb={2}>Generating video... This may take a few minutes.</Text>
          <Progress size="xs" isIndeterminate colorScheme="blue" />
        </Box>
      )}

      {videoUrl && (
        <Box w="100%" mt={4}>
          <Heading size="md" mb={4}>
            Generated Video
          </Heading>
          <video
            controls
            width="100%"
            src={videoUrl}
            style={{ borderRadius: "8px" }}
          />
        </Box>
      )}
    </Box>
  );
}
