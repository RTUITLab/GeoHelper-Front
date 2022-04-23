// ******
//  STORE
// ******

// Getters
export const CHECK_AUTH = 'CHECK_AUTH'
export const GET_TOKEN = 'GET_TOKEN'
export const GET_OBJECTS = 'GET_OBJECTS'
export const GET_OBJECT_ONE = 'GET_OBJECT_ONE'

// Mutations
export const INIT_APP = 'INIT_APP'
export const LOGOUT = 'LOGOUT'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_OBJECTS = 'SET_OBJECTS'
export const REMOVE_OBJECT = 'REMOVE_OBJECT'

// Actions
export const LOGIN = 'LOGIN'
export const FETCH_OBJECTS = 'FETCH_OBJECTS'
export const UPDATE_OBJECT = 'UPDATE_OBJECT'
export const DELETE_OBJECT = 'DELETE_OBJECT'
export const UPLOAD_FILE = 'UPLOAD_FILE'

// *******
//  EVENTS
// *******

export const CREATE_SNACHBAR = 'CREATE_SNACHBAR'

// *******
//  ENUMS
// *******

export const ENTITY_TYPES = {
  TEXT: 'text',
  AUDIO: 'audio',
  OBJECT: 'object',
  EXCURSION: 'excursion'
}

export const BEHAVIORS_TYPES = {
  EXCURSION: 'EXCURSION',
  ROUTE: 'ROUTE'
}

export const BEHAVIORS_CONDITIONS_TYPES = {
  CLICK: 'CLICK',
  VOLUME: 'VOLUME'
}

export const TARGETS = {
  MARKER: 'MARKER',
  AREA: 'AREA',
  ROUTE: 'ROUTE',
  LINE: 'LINE',
  MAP: 'MAP'
}

export const CHANGE_TYPES = {
  INSERT: 'INSERT',
  REMOVE: 'REMOVE',
  SET: 'SET'
}
