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
import { debug } from "../../debug";

export function WithLogin({ children }: { children: JSX.Element }) {
  const log = debug.extend(WithLogin.name);
  const toast = useToast();
  const [isAuthorized, setIsAuthorized] = useState(undefined);
  const [graphQlUrl, setGraphQlUrl] = useGraphQlUrl();
  const [deepToken, setDeepToken] = useDeepToken();
  const deep = useDeep();

  return isAuthorized ? (
    children
  ) : (
    <Login
      onSubmit={async (arg) => {
        const gqlPathUrl = new URL(arg.gqlPath);
        setGraphQlUrl(
          gqlPathUrl.host +
            gqlPathUrl.pathname +
            gqlPathUrl.search +
            gqlPathUrl.hash
        );
        setDeepToken(arg.token);
      }}
    />
  );
}
