import { DeepClient, useDeep } from "@deep-foundation/deeplinks/imports/client";
import { useState, useEffect } from "react";
import { Login } from "./login";
import { useToast } from "@chakra-ui/react";
import { useLocalStore } from "@deep-foundation/store/local";
import { CapacitorStoreKeys } from "../../capacitor-store-keys";
import { processEnvs } from "../../process-envs";
import { useDeepToken } from "../hooks/use-token";
import { useGraphQlUrl } from "../hooks/use-gql-path";
import { generateApolloClient } from "@deep-foundation/hasura/client";
import { logPackage } from "../../logPackage";
import debug from "debug";
debug.enable("@deep-foundation/deep-memo-app:WithLogin");

export function WithLogin({ children }: { children: JSX.Element }) {
  const log = logPackage.extend(WithLogin.name);
  const [graphQlUrl, setGraphQlUrl] = useGraphQlUrl();
  const [deepToken, setDeepToken] = useDeepToken();
  const deep = useDeep();

  const [isAuthorized, setIsAuthorized] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    log({ graphQlUrl, deepToken, deep });
    log({ deepLinkId: deep.linkId });
    console.log("!deep.linkId && graphQlUrl && deepToken", Boolean(!deep.linkId && graphQlUrl && deepToken))
    if(!deep.linkId && graphQlUrl && deepToken) {
      window.location.reload();
    } 
    if(deep.linkId) {
      setIsAuthorized(true);
    }
  }, [deep]);

  useEffect(() => {
    self["graphQlUrl"] = graphQlUrl;
    self["setGraphQlUrl"] = setGraphQlUrl;
    self["deepToken"] = deepToken;
    self["setDeepToken"] = setDeepToken;
    self["deep"] = deep;
  });

  return isAuthorized ? (
    children
  ) : (
    <Login
      onSubmit={async (arg) => {
        setGraphQlUrl(arg.gqlPath);
        setDeepToken(arg.token);
      }}
    />
  );
}
