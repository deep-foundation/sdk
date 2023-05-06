import { useDeep } from "@deep-foundation/deeplinks/imports/client";
import { useState, useEffect } from "react";
import { Login } from "./login";

export function LoginOrContent({ gqlPath, setGqlPath, children }: { gqlPath: string | undefined, setGqlPath: (gqlPath: string | undefined) => void, children: JSX.Element }) {
  const deep = useDeep();
  const [isAuthorized, setIsAuthorized] = useState(undefined);

  useEffect(() => {
    self["deep"] = deep
    if (deep.linkId !== 0) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [deep]);

  console.log({ isAuthorized, gqlPath })

  return isAuthorized && gqlPath ? children : (
    <Login
      onSubmit={(arg) => {
        console.log({ arg })
        setGqlPath(arg.gqlPath);
        deep.login({
          token: arg.token
        })
      }}
    />
  );
}