import { useGraphQlUrl } from "../hooks/use-gql-path";

export function WithGraphQlUrl(options: WithGraphQlUrlOptions) {
  const [graphQlUrl, setGraphQlUrl] = useGraphQlUrl();
  return options.renderChildren({
    graphQlUrl,
    setGraphQlUrl
  });
}

export interface WithGraphQlUrlOptions {
  renderChildren: (param: { graphQlUrl: string, setGraphQlUrl: (newGraphQl: string) => void }) => JSX.Element;
}