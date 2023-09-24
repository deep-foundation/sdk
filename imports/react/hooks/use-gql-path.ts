import { useLocalStore } from "@deep-foundation/store/local";
import { processEnvs } from "../../process-envs";
import { CapacitorStoreKeys } from "../../capacitor-store-keys";

export function useGraphQlUrl(defaultValue: string = processEnvs.graphQlUrl) {
  return useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.GraphQlUrl], defaultValue)
}