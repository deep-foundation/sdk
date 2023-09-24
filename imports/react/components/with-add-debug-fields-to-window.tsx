import { useAddDebugFieldsToWindow } from "../hooks/use-add-debug-fields-to-window"

export function WithAddDebugFieldsToWindow({ children }: { children: JSX.Element}) {
  useAddDebugFieldsToWindow()
  return children
}