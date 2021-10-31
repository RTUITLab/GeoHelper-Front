import { Store } from 'vuex';
import Notifications from '@/components/notifications';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store,
    $notifications: Notifications
  }
}
