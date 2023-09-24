import { useGraphQlUrl } from "../hooks/use-gql-path";
import { useDeepToken } from "../hooks/use-token";

export function WithDeepToken(options: WithDeepTokenOptions) {
  const [deepToken, setDeepToken] = useDeepToken();
  return options.renderChildren({
    deepToken,
    setDeepToken
  });
}

export interface WithDeepTokenOptions {
  renderChildren: (param: { deepToken: string, setDeepToken: (newDeepToken: string) => void }) => JSX.Element;
}