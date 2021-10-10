import { createStore } from 'vuex';
import mutations from '@/store/mutations';
import { State, SystemTheme, UserData } from './types';
import getters from '@/store/getters';
import actions from '@/store/actions';

let token = localStorage.getItem('ACCESS_TOKEN') || '';
const user: UserData = {
  _id: '',
  username: '',
  role: '',
};

if (token) {
  try {
    const payload: any = atob(token.split('.')[1]);
    user.username = payload.user;
    user.role = payload.role;
  } catch (e) {
    token = '';
    localStorage.setItem('ACCESS_TOKEN', '');
  }
}

export const CState: State = {
  settings: {
    theme: SystemTheme.Light,
  },
  accessToken: token,
  user,
};

export default createStore({
  state: CState,
  mutations,
  getters,
  actions,
});
