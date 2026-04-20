import jsPDF from 'jspdf'
import type { Question } from '@/types/question'

export async function exportQuestionsPDF(questions: Question[]): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // For CJK support, we'll use a simple approach - encode as Unicode
  // jsPDF doesn't natively support CJK without font embedding
  // For a proper solution, we'd need to embed NotoSansSC font
  // For now, use the built-in font with UTF-8 encoding workaround

  let y = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin

  doc.setFontSize(16)
  doc.text('Smart Study - 错题集', pageWidth / 2, y, { align: 'center' })
  y += 10

  for (const q of questions) {
    if (y > 270) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(10)
    doc.setTextColor(100)
    const header = `复习${q.reviewCount}次${q.mastered ? ' | 已掌握' : ''}`
    doc.text(header, margin, y)
    y += 5

    doc.setFontSize(12)
    doc.setTextColor(30)
    const questionLines = doc.splitTextToSize(`Q: ${q.questionText}`, contentWidth)
    doc.text(questionLines, margin, y)
    y += questionLines.length * 5 + 3

    doc.setFontSize(11)
    doc.setTextColor(0, 128, 0)
    const answerLines = doc.splitTextToSize(`A: ${q.answerText}`, contentWidth)
    doc.text(answerLines, margin, y)
    y += answerLines.length * 5 + 8
  }

  const blob = doc.output('blob')
  const file = new File([blob], 'smart-study-错题集.pdf', { type: 'application/pdf' })

  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Smart Study 错题集' })
  } else {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'smart-study-错题集.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }
}