import { GetterTree } from 'vuex';
import { State, SystemTheme, THEME_GET } from '@/store/types';

const getters: GetterTree<State, any> = {
  [THEME_GET]: (state) => state.settings.theme,
};

export default getters;
