export type NotificationType =
  | 'INTEREST_RECEIVED'
  | 'INTEREST_ACCEPTED'
  | 'INTEREST_REJECTED'
  | 'POST_UPDATED'
  | 'POST_COMPLETED';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}