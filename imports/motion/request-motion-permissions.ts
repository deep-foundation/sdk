export async function requestMotionPermissions() {
  if ('requestPermission' in DeviceMotionEvent) {
    // @ts-ignore
    await DeviceMotionEvent.requestPermission();
  }
}
