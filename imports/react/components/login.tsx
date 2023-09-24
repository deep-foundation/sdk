import { Card, CardHeader, Heading, CardBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useGqlPath } from "../hooks/use-gql-path";
import { useToken } from "../hooks/use-token";

export function Login(arg: { onSubmit: (arg: { gqlPath: string, token: string }) => void }) {
  const [gqlPath, setGqlPath] = useGqlPath(undefined);
  const [token, setToken] = useToken(undefined);
  return <Card>
    <CardHeader>
      <Heading>
        Login
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