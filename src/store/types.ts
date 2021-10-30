// Getters
export const THEME_GET = 'THEME_GET';
export const MENU_GET = 'MENU_GET';
export const TOKEN_GET = 'TOKEN_GET';

// Mutations
export const LOGOUT = 'LOGOUT';
export const THEME_SET = 'THEME_SET';
export const USER_SET = 'USER_SET';
export const TOKEN_SET = 'TOKEN_SET';
export const OBJECTS_SET = 'OBJECTS_SET';

// Actions
export const LOGIN = 'LOGIN';
export const OBJECTS_FETCH = 'OBJECTS_FETCH';

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

// Files

export interface File {
  _id: string,
  type: 'audio' | 'model',
  fileName: string,
  url: string,
  assetBundle?: string
}

// Objects

export interface Point {
  _id?: string,
  lat: number,
  lng: number,
}

export interface Area {
  _id?: string,
  points: Point[],
}

export interface BaseObject {
  _id?: string,
  name: string,
  type: 'text' | 'audio' | 'object' | 'excursion',
  position: Point,
  areas: Area[],
  status?: number,

  // Type-dependent fields
  description?: string,
  files?: File[],
  fileName?: string,
  url?: string,
}

export interface TextObject extends BaseObject {
  type: 'text',
  description: string,
}

export interface AudioObject extends BaseObject {
  type: 'audio',
  files: File[],
}

export interface ModelObject extends BaseObject {
  type: 'audio',
  files: File[],
}

export interface ExcursionObject extends BaseObject {
  type: 'excursion',
  description: string,
  files: File[],
}

// State
export interface State {
  settings: SystemSettings,
  objects: BaseObject[],
  accessToken: string,
  user: UserData,
}
