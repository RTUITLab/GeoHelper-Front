import { ActionTree } from 'vuex';
import axios from 'axios';
import {
  BaseObject,
  LOGIN,
  OBJECTS_FETCH, OBJECTS_SET,
  State,
  TOKEN_SET,
  USER_SET,
  UserData,
} from '@/store/types';

const actions: ActionTree<State, any> = {
  [LOGIN]: async ({ commit }, { credentials, remember }) => {
    try {
      const userData = (await axios.post('auth', credentials)).data as { foundUser: UserData, token: string };
      if (remember) {
        localStorage.setItem('ACCESS_TOKEN', userData.token);
      }

      commit(USER_SET, userData.foundUser);
      commit(TOKEN_SET, userData.token);

      return true;
    } catch (err) {
      console.log(LOGIN, err);
      return false;
    }
  },
  [OBJECTS_FETCH]: async ({ commit }) => {
    try {
      const objects: BaseObject[] = (await axios.get('objects')).data;

      if (objects) {
        commit(OBJECTS_SET, objects);
      }

      return objects;
    } catch (err) {
      console.log(LOGIN, err);
      return null;
    }
  },
};

export default actions;
