import { GetterTree } from 'vuex';
import { MENU_GET, State, THEME_GET } from '@/store/types';

const getters: GetterTree<State, any> = {
  [THEME_GET]: (state) => state.settings.theme,
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
};

export default getters;
