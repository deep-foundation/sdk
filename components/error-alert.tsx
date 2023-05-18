import { Alert, AlertIcon, AlertTitle, AlertDescription, Text } from "@chakra-ui/react";

export function ErrorAlert({ error }: { error: Error }) {
   return (
     <Alert status="error">
       <AlertIcon />
       <AlertTitle>Something went wrong!</AlertTitle>
       <AlertDescription>{error.message}</AlertDescription>
     </Alert>
   );
 }