import { useDeep } from "@deep-foundation/deeplinks/imports/client";
import { useState, useEffect } from "react";
import { Login } from "./login";
import { useToast } from "@chakra-ui/react";
import { useLocalStore } from "@deep-foundation/store/local";
import { CapacitorStoreKeys } from "../../capacitor-store-keys";
import { processEnvs } from "../../process-envs";
import { useToken } from "../hooks/use-token";
import { useGqlPath } from "../hooks/use-gql-path";

export function WithLogin({ children }: { children: JSX.Element }) {
  const toast = useToast();
  const deep = useDeep();
  const [isAuthorized, setIsAuthorized] = useState(undefined);
  const [gqlPath, setGqlPath] = useGqlPath();
  const [token, setToken] = useToken();

  useEffect(() => {
    if (gqlPath || token) {
      deep.login({ token });
    }
  }, [token]);

  useEffect(() => {
    new Promise(async () => {
      if (deep.linkId === 0) {
        setIsAuthorized(false);
      } else {
        try {
          await deep.select({ id: 1 });
          setIsAuthorized(true);
        } catch (error) {
          setGqlPath(undefined);
          setToken(undefined);
          await deep.logout();
          toast({
            title: "Login failed",
            description: error.message,
            status: "error",
            duration: null,
            isClosable: true,
          });
        }
      }
    });
  }, [deep]);

  return isAuthorized ? (
    children
  ) : (
    <Login
      onSubmit={async (arg) => {
        const gqlPathUrl = new URL(arg.gqlPath);
        setGqlPath(
          gqlPathUrl.host +
            gqlPathUrl.pathname +
            gqlPathUrl.search +
            gqlPathUrl.hash
        );
        setToken(arg.token);
      }}
    />
  );
}
