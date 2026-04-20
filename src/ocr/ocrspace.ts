const OCR_SPACE_API_KEY = 'K840923688' // free tier public key

export async function recognizeWithOCRSpace(imageData: string): Promise<string> {
  const base64 = imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`
  const res = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: { 'apikey': OCR_SPACE_API_KEY },
    body: JSON.stringify({
      base64Image: base64,
      language: 'chseng',
      isOverlayRequired: false
    })
  })
  const data = await res.json()
  return data.ParsedResults?.[0]?.ParsedText ?? ''
}