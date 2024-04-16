import { Box, Button, Card, CardBody, CardHeader, Code, FormControl, FormLabel, HStack, Heading, Input, SimpleGrid } from "@chakra-ui/react";
import { AutoGuest } from "@deep-foundation/deepcase/imports/auto-guest";
import { useDeep } from "@deep-foundation/deeplinks/imports/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeepPath, useDeepToken } from "./provider";

export function Connection() {
  const { t } = useTranslation();
  const deep = useDeep();

  const [path, setPath] = useDeepPath();
  const [token, setToken] = useDeepToken();

  const [_path, _setPath] = useState<string|undefined>(path);
  const [_token, _setToken] = useState<string|undefined>(token);

  // useEffect(() => {
  //   if(!deep.linkId && connection && deepToken) {
  //     window.location.reload();
  //   }
  // }, [deep]);

  // useEffect(() => {
  //   self["connection"] = connection;
  //   self["setConnection"] = setConnection;
  //   self["deepToken"] = deepToken;
  //   self["setDeepToken"] = setDeepToken;
  //   self["deep"] = deep;
  // });

  const [autoGuest, setAutoGuest] = useState(false);

  return (
    <Card maxWidth={'100%'}>
      <CardHeader>
        <Heading>
          {t('connection')}
        </Heading>
      </CardHeader>
      <CardBody>
        <FormControl id="gql-path">
          <FormLabel>GraphQL Path</FormLabel>
          <Input type="text"
            defaultValue={path}
            onChange={(e) => _setPath(e.target.value)}
          />
        </FormControl>
        <FormControl id="token" >
          <FormLabel>Token</FormLabel>
          <Input type="text"
            defaultValue={token}
            onChange={(e) => _setToken(e.target.value)}
          />
        </FormControl>
        <SimpleGrid pt={3} spacing={3} minChildWidth='150px'>
          <Button onClick={() => {
            console.log({ _token, _path });
            if(!_path || !_token) return;
            setToken(_token);
            setPath(_path);
          }}>
            Submit
          </Button>
          <Button onClick={() => {
            setToken(null);
          }}>
            setDeepToken(null)
          </Button>
          <Button colorScheme={autoGuest ? 'blue' : undefined} onClick={() => {
            setAutoGuest(ag => !ag);
          }}>
            {`<AutoGuest/>`}
          </Button>
          {!!autoGuest && <AutoGuest><></></AutoGuest>}
        </SimpleGrid>
      </CardBody>
      <CardBody>
        <Code wordBreak={'break-all'}>useDeepPath()[0] // {path || ''}</Code>
        <Code wordBreak={'break-all'}>useDeepToken()[0] // {token || ''}</Code>
        <Code wordBreak={'break-all'}>useDeep() // {typeof(deep)}</Code>
        {!!deep && <Box>
          <Code wordBreak={'break-all'}>useDeep().linkId // {deep?.linkId}</Code>
          <Code wordBreak={'break-all'}>useDeep().token // {deep?.token}</Code>
        </Box>}
      </CardBody>
    </Card>
  );
}
