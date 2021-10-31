import NotificationProvider from './NotificationProvider.vue';

interface Notification {
  id?: number,
  type: 'info' | 'warning',
  title: string,
  message: string
}

export default class Notifications {
  private idCounter = 0;

  public stack: Notification[] = [];

  public push(notification: Notification): void {
    notification.id = this.idCounter;
    this.stack.unshift(notification);

    setTimeout(() => this.remove(notification.id!), 3000);
    this.idCounter += 1;
  }

  public remove(id: number): void {
    this.stack = this.stack.filter((item) => item.id !== id);
  }
}

export const Provider = NotificationProvider;
