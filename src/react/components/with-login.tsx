import { useDeep } from "@deep-foundation/deeplinks/imports/client";
import { useState, useEffect } from "react";
import { Login } from "./login";
import { useDeepToken } from "../hooks/use-token";
import { useGraphQlUrl } from "../hooks/use-gql-path";
import { logPackage } from "../../logPackage";

export function WithLogin({ children }: { children: JSX.Element }) {
  const log = logPackage.extend(WithLogin.name);
  const [graphQlUrl, setGraphQlUrl] = useGraphQlUrl();
  const [deepToken, setDeepToken] = useDeepToken();
  const deep = useDeep();

  const [isAuthorized, setIsAuthorized] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    log({ graphQlUrl, deepToken, deep });
    log({ deepLinkId: deep.linkId });
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
