import html2canvas from 'html2canvas'
import { marked } from 'marked'
import type { Question } from '@/types/question'

export async function exportQuestionImage(question: Question): Promise<void> {
  const container = document.createElement('div')
  container.style.cssText = 'padding:24px;background:white;width:360px;font-family:system-ui;'
  container.innerHTML = `
    <div style="font-size:16px;color:#333;margin-bottom:12px">${question.questionText}</div>
    <div style="font-size:14px;color:#16a34a;margin-bottom:8px">答案：${marked.parse(question.answerText)}</div>
    <div style="font-size:12px;color:#999;text-align:right">Smart Study</div>
  `
  document.body.appendChild(container)

  const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' })
  document.body.removeChild(container)

  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => { if (b) resolve(b) }, 'image/png'))
  const file = new File([blob], `错题-${question.id}.png`, { type: 'image/png' })

  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: '错题分享' })
  } else {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `错题-${question.id}.png`
    a.click()
    URL.revokeObjectURL(url)
  }
}