import { create } from 'zustand'

type Store = {
  // Stencil ID
  stencilId: string
  setStencilId: (stencilId: string) => void

  // Image File
  imageFile: Blob | undefined
  setImageFile: (imageFile: Blob | undefined) => void
  getImageSrc: () => string | undefined
}

const usePaintStore = create<Store>((set, get) => ({
  // Stencil ID
  stencilId: 'glass-1',
  setStencilId: (stencilId: string) => set({ stencilId }),

  // Image File
  imageFile: undefined,
  setImageFile: (imageFile: Blob | undefined) => set({ imageFile }),
  getImageSrc: () => {
    const imageFile = get().imageFile
    return imageFile ? URL.createObjectURL(imageFile) : undefined
  },
}))

export default usePaintStore
