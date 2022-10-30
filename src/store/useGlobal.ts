import create from 'zustand'

interface GlobalState {
    isDrawerOpen: boolean
    setDrawerOpen: (isDrawerOpen: boolean) => void,
  }

const useGlobal = create<GlobalState>(set => ({
    isDrawerOpen: false,
    setDrawerOpen: (isDrawerOpen) => set(state => ({ isDrawerOpen: isDrawerOpen })),
}))

export default useGlobal
