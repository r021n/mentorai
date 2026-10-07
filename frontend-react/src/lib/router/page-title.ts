import { create } from 'zustand'

interface PageTitleState {
  title: string
  setTitle: (title: string) => void
}

const usePageTitleStore = create<PageTitleState>((set) => ({
  title: 'Dashboard',
  setTitle: (title) => set({ title }),
}))

/**
 * Declares the heading rendered by the dashboard shell for the active route.
 * Called from `beforeLoad` so the title is set before the layout paints.
 */
export function setPageTitle(title: string): void {
  usePageTitleStore.getState().setTitle(title)
  document.title = `${title} | MentorAI`
}

export function useCurrentPageTitle(): string {
  return usePageTitleStore((state) => state.title)
}
