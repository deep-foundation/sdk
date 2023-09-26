import { useEffect } from "react";
import { useDeepToken } from "./use-token";
import { useGraphQlUrl } from "./use-gql-path";
import { useDeep } from "@deep-foundation/deeplinks/imports/client";

export function useAddDebugFieldsToWindow() { 
  const [graphQlUrl,setGraphQlUrl] = useGraphQlUrl()
  const [deepToken,setDeepToken] = useDeepToken()
  const deep = useDeep();

  useEffect(() => {
    self['graphQlUrl'] = graphQlUrl
    self['setGraphQlUrl'] = setGraphQlUrl

    self['deepToken'] = deepToken
    self['setDeepToken'] = setDeepToken

    self['deep'] = deep
  })
}