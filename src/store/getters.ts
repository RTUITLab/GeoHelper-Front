import { GetterTree } from 'vuex';
import {
  MENU_GET, OBJECTS_GET,
  State,
  THEME_GET,
  TOKEN_GET,
} from '@/store/types';

const getters: GetterTree<State, any> = {
  [THEME_GET]: (state) => state.settings.theme,
  [TOKEN_GET]: (state) => state.accessToken,
  [MENU_GET]: () => [
    [
      { title: 'Новый объект', path: '/objects/new', name: 'NewObject' },
      { title: 'Объекты', path: '/objects', name: 'Objects' },
      // { title: '', path: '' },
      { title: 'Карта', path: '/map', name: 'Map' },
    ],
    [
      { title: 'Настройки', path: '/settings', name: 'Settings' },
    ],
  ],
  [OBJECTS_GET]: (state) => state.objects,
};

export default getters;
