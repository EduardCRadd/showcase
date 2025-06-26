import { create } from 'zustand'

type Store = {
  showMenu: boolean
  setShowMenu: (showMenu: boolean) => void
  showMenuButton: boolean
  setShowMenuButton: (showMenuButton: boolean) => void
  showFooter: boolean
  setShowFooter: (showFooter: boolean) => void
}

const useLayoutStore = create<Store>((set) => ({
  showMenu: false,
  setShowMenu: (showMenu: boolean) => {
    set({
      showMenu,
    })
  },
  showMenuButton: false,
  setShowMenuButton: (showMenuButton: boolean) => {
    set({
      showMenuButton,
    })
  },
  showFooter: false,
  setShowFooter: (showFooter: boolean) => {
    set({
      showFooter,
    })
  },
}))

export default useLayoutStore
