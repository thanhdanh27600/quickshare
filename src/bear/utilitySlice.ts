import { withDevTools } from 'bear/middleware';
import { StateCreator, create } from 'zustand';

export enum FeatureTabKey {
  'SHARE_LINK' = 'SHARE_LINK',
  'SHARE_TEXT' = 'SHARE_TEXT',
}

export interface UtilitySlice {
  featureTab: FeatureTabKey;
  setFeatureTab: (tab: string) => void;
}

const slice: StateCreator<UtilitySlice> = (set, get) => ({
  featureTab: FeatureTabKey.SHARE_LINK,
  setFeatureTab: (tab) => set({ featureTab: tab as FeatureTabKey }),
});

const utilitySlice = create(withDevTools(slice, { anonymousActionType: 'UtilitySlice' }));

export default utilitySlice;
