import { withDevTools } from 'store/middleware';
import { StateCreator, create } from 'zustand';

export enum FeatureTabKey {
  'SHARE_LINK' = 'SHARE_LINK',
  'SHARE_FILE' = 'SHARE_FILE',
  'SHARE_TEXT' = 'SHARE_TEXT',
}

export interface UtilitySlice {
  featureTab: FeatureTabKey;
  setFeatureTab: (tab: string) => void;
  country: string;
  setCountry: (value: string) => void;
}

const slice: StateCreator<UtilitySlice> = (set, get) => ({
  featureTab: '' as any,
  setFeatureTab: (tab) => set({ featureTab: tab as FeatureTabKey }),
  country: '',
  setCountry: (value) => set({ country: value }),
});

const utilitySlice = create(withDevTools(slice, { anonymousActionType: 'UtilitySlice' }));

export default utilitySlice;
