import { Notification } from './notification';

// Generic response wrapper for notification endpoints.
// GET /notifications returns Notification[] directly, so this
// covers the single-item responses (read, delete) and can be
// extended if the backend ever wraps list responses too.
export interface NotificationResponse {
  message?: string;
  notification?: Notification;
}