import { NotificationPayload } from "firebase/messaging";

export type PushNotification = Omit<NotificationPayload, 'icon' | 'image'>;
