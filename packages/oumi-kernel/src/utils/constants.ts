export enum PluginType {
  Preset = 'Preset',
  Plugin = 'Plugin'
}

export const IS_EVENT_HOOK = /^on/;
export const IS_ADD_HOOK = /^add/;
export const IS_MODIFY_HOOK = /^modify/;
