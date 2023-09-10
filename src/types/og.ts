export const Themes = {
  default: 'Default',
  jshine: 'JShine',
  azure_pop: 'Azure pop',
  king_yna: 'King yna',
  quepal: 'Quepal',
  sublime_vivid: 'Sublime vivid',
} as const;
export type Theme = keyof typeof Themes;

export const backgroundTemplate = {
  default: 'linear-gradient(to bottom, #69009e, #2cdfdf)',
  jshine: 'linear-gradient(to bottom, #12c2e9, #c471ed,#f64f59)',
  azure_pop: 'linear-gradient(to bottom, #ef32d9, #89fffd)',
  king_yna: 'linear-gradient(to bottom, #1a2a6c, #b21f1f, #fdbb2d)',
  quepal: 'linear-gradient(to bottom, #11998e, #38ef7d)',
  sublime_vivid: 'linear-gradient(to bottom, #FC466B, #3F5EFB)',
} as const;
