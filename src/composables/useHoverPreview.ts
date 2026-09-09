import { ref } from 'vue'

export function useHoverPreview() {
  const previewSrc = ref<string | null>(null)
  const previewEl = ref<HTMLImageElement | null>(null)

  function position(e: MouseEvent) {
    if (previewEl.value) {
      previewEl.value.style.left = e.clientX + 'px'
      previewEl.value.style.top = e.clientY + 'px'
    }
  }

  function show(src: string, e?: MouseEvent) {
    previewSrc.value = src
    if (e) position(e)
  }

  function hide() {
    previewSrc.value = null
  }

  return { previewSrc, previewEl, show, hide, position }
}
