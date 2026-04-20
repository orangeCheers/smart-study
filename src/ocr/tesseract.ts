export async function recognizeWithTesseract(imageData: string): Promise<string> {
  const Tesseract = await import('tesseract.js')
  const result = await Tesseract.recognize(imageData, 'eng+chi_sim')
  return result.data.text
}