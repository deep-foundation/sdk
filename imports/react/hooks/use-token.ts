import { useTokenController } from "@deep-foundation/deeplinks/imports/react-token";
import { processEnvs } from "../../process-envs";

export function useToken(defaultValut: string = processEnvs.deepToken) {
  return useTokenController(defaultValut);
}