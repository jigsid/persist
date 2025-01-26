import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

interface Props {
  message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: Props) {
  return (
    <Center py={8}>
      <VStack spacing={4}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text color="gray.600">{message}</Text>
      </VStack>
    </Center>
  );
}
