// import { NotificationPayload } from "firebase/messaging";
// import { NotificationPayload } from "firebase/messaging/dist/esm/messaging/index";

// export type PushNotification = Omit<NotificationPayload, 'icon' | 'image'>;
export type { NotificationPayload as PushNotification } from '@firebase/messaging';

