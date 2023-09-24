import { useLocalStore } from "@deep-foundation/store/local";
import { processEnvs } from "../../process-envs";
import { CapacitorStoreKeys } from "../../capacitor-store-keys";

export function useGqlPath(defaultValue: string = processEnvs.graphQlPath) {
  return useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.GraphQlPath], defaultValue)
}