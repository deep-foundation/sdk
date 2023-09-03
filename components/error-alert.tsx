import { Alert, AlertIcon, AlertTitle, AlertDescription, HStack, VStack } from "@chakra-ui/react"

export function ErrorAlert(options: ErrorAlertOptions) {
  const { title, description } = options;
  return (
    <Alert status="error">
      <HStack spacing={4} alignItems="center" flex="1">
        <AlertIcon />
        <VStack spacing={1} width={"100%"}>
          <AlertTitle>{title}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
        </VStack>
      </HStack>
    </Alert>
  );
}

export interface ErrorAlertOptions {
  title: JSX.Element | string;
  description?: JSX.Element | string;
}
