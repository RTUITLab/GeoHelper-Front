import { MutationTree } from 'vuex';
import {
  State,
  THEME_SET,
  USER_SET,
  TOKEN_SET,
  UserData,
} from './types';

const mutations: MutationTree<State> = {
  [THEME_SET]: (state, theme) => {
    state.settings.theme = theme;
    localStorage.setItem('THEME', theme);
    console.log(state, 'theme');
  },
  [TOKEN_SET]: (state, token: string) => {
    state.accessToken = token;
  },
  [USER_SET]: (state, user: UserData) => {
    state.user = user;
  },
};

export default mutations;
