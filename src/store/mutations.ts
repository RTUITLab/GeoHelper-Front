import { MutationTree } from 'vuex';
import {
  State,
  THEME_SET,
  USER_SET,
  TOKEN_SET,
  UserData,
  LOGOUT,
  OBJECTS_SET,
  BaseObject,
} from './types';

const mutations: MutationTree<State> = {
  [THEME_SET]: (state, theme) => {
    state.settings.theme = theme;
    localStorage.setItem('THEME', theme);
  },
  [TOKEN_SET]: (state, token: string) => {
    state.accessToken = token;
  },
  [USER_SET]: (state, user: UserData) => {
    state.user = user;
  },
  [LOGOUT]: (state, cb) => {
    state.user.username = '';
    state.user._id = '';
    state.user.role = '';
    state.accessToken = '';

    localStorage.removeItem('ACCESS_TOKEN');
    cb();
  },
  [OBJECTS_SET]: (state, objects: BaseObject[]) => {
    state.objects = objects;
  },
};

export default mutations;
