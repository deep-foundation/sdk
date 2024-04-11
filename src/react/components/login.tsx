import { Card, CardHeader, Heading, CardBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "next-i18next";

export function Login(arg: { onSubmit: (arg: { gqlPath: string, token: string }) => void }) {
  const [gqlPath, setGqlPath] = useState<string|undefined>(undefined);
  const [token, setToken] = useState<string|undefined>(undefined);
  const { t } = useTranslation();
  return <Card>
    <CardHeader>
      <Heading>
        {t('connection')}
      </Heading>
    </CardHeader>
    <CardBody>
      <FormControl id="gql-path">
        <FormLabel>GraphQL Path</FormLabel>
        <Input type="text" onChange={(newGqlPath) => {
          setGqlPath(newGqlPath.target.value)
        }} />
      </FormControl>
      <FormControl id="token" >
        <FormLabel>Token</FormLabel>
        <Input type="text" onChange={(newToken) => {
          setToken(newToken.target.value)
        }} />
      </FormControl>
      <Button onClick={() => {
        if(gqlPath === undefined || token === undefined) {
          return;
          // TODO: Show toast
        }
        arg.onSubmit({
          gqlPath,
          token
        })
      }}>
        Submit
      </Button>
    </CardBody>
  </Card>
}