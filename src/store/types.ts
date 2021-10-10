// Getters
export const THEME_GET = 'THEME_GET';
export const MENU_GET = 'MENU_GET';

// Mutations
export const THEME_SET = 'THEME_SET';
export const USER_SET = 'USER_SET';
export const TOKEN_SET = 'TOKEN_SET';

// Actions
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// System settings
export enum SystemTheme {
  Light = 'light',
  Dark = 'dark'
}

export interface SystemSettings {
  theme: SystemTheme
}

// User
export interface UserData {
  _id: string,
  username: string,
  role: string,
}

// State
export interface State {
  settings: SystemSettings,
  accessToken: string,
  user: UserData,
}
