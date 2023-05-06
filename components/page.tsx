import { ProvidersAndLoginOrContent } from "./providers-and-login-or-content";
import { StoreProvider } from "./store-provider";

export function Page({ children }: { children: JSX.Element }) {
  return <StoreProvider>
    <ProvidersAndLoginOrContent>
      {children}
    </ProvidersAndLoginOrContent>
  </StoreProvider>
}