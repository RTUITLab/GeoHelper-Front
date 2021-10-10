import { ActionTree } from 'vuex';
import axios from 'axios';
import {
  LOGIN,
  State,
  TOKEN_SET,
  USER_SET,
  UserData,
} from '@/store/types';

const actions: ActionTree<State, any> = {
  [LOGIN]: async ({ commit }, { credentials, remember }) => {
    console.log(remember);
    try {
      const userData = (await axios.post('auth', credentials)).data as { foundUser: UserData, token: string };
      if (remember) {
        localStorage.setItem('ACCESS_TOKEN', userData.token);
      }

      commit(USER_SET, userData.foundUser);
      commit(TOKEN_SET, userData.token);

      return userData;
    } catch (err) {
      console.log(LOGIN, err);
      return (err);
    }
  },
};

export default actions;
