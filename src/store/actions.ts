import { ActionTree } from 'vuex';
import axios from 'axios';
import {
  BaseObject,
  LOGIN, OBJECT_DELETE, OBJECT_REMOVE,
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
      throw new Error(err.response.data.message || 'Неизвестная ошибка сервера');
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
      throw new Error('Не удалось получить объекты с сервера. Попробуте позже');
    }
  },
  [OBJECT_DELETE]: async ({ commit }, _id) => {
    try {
      await axios.request({
        url: 'object',
        method: 'delete',
        data: { _id },
      });

      commit(OBJECT_REMOVE, _id);
    } catch (err) {
      console.log(OBJECT_DELETE, err);
      throw new Error('Не получилось удалить объект');
    }
  },
};

export default actions;
