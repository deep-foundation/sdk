import { useAddDebugFieldsToWindow } from "../hooks/use-add-debug-fields-to-window"

export function WithAddDebugFieldsToWindow({ children = null }: { children?: JSX.Element|null}) {
  useAddDebugFieldsToWindow()
  return children
}