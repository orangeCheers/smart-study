import { ref } from 'vue'

type OCRMode = 'native-paste' | 'tesseract' | 'ocrspace'

const OCR_MODE_KEY = 'smart-study-ocr-mode'

export function useOCR() {
  const mode = ref<OCRMode>(
    (localStorage.getItem(OCR_MODE_KEY) as OCRMode) || 'native-paste'
  )

  function setMode(m: OCRMode) {
    mode.value = m
    localStorage.setItem(OCR_MODE_KEY, m)
  }

  async function recognize(imageData: string): Promise<{ text: string; source: string }> {
    switch (mode.value) {
      case 'native-paste':
        return { text: '', source: 'native' }
      case 'tesseract':
        const { recognizeWithTesseract } = await import('@/ocr/tesseract')
        const text = await recognizeWithTesseract(imageData)
        return { text, source: 'tesseract' }
      case 'ocrspace':
        const { recognizeWithOCRSpace } = await import('@/ocr/ocrspace')
        const text2 = await recognizeWithOCRSpace(imageData)
        return { text: text2, source: 'ocrspace' }
    }
  }

  return { mode, setMode, recognize }
}