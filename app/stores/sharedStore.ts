import { atom } from "nanostores";

type GlobalLoadingState = {
  active: boolean;
  label?: string;
};

export const $globalLoading = atom<GlobalLoadingState>({
  active: false,
  label: undefined,
});

export function showGlobalLoading(label?: string) {
  $globalLoading.set({ active: true, label });
}

export function hideGlobalLoading() {
  $globalLoading.set({ active: false, label: undefined });
}
