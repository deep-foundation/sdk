import { LocalStoreProvider } from "@deep-foundation/store/local";
import { QueryStoreProvider } from "@deep-foundation/store/query";

export function StoreProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return <QueryStoreProvider>
    <LocalStoreProvider>
      {children}
    </LocalStoreProvider>
  </QueryStoreProvider>
}