import { CapacitorStoreProvider } from "@deep-foundation/store/capacitor";
import { CookiesStoreProvider } from "@deep-foundation/store/cookies";
import { LocalStoreProvider } from "@deep-foundation/store/local";
import { QueryStoreProvider } from "@deep-foundation/store/query";

export function StoreProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <CapacitorStoreProvider>
      <QueryStoreProvider>
        <CookiesStoreProvider>
          <LocalStoreProvider>{children}</LocalStoreProvider>
        </CookiesStoreProvider>
      </QueryStoreProvider>
    </CapacitorStoreProvider>
  );
}
