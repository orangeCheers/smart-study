import { db } from '@/db'

export function useSearch() {
  async function searchQuestions(query: string) {
    if (!query.trim()) return []
    const all = await db.questions.toArray()
    const q = query.toLowerCase()
    return all.filter(item =>
      item.questionText.toLowerCase().includes(q) ||
      item.answerText.toLowerCase().includes(q)
    )
  }

  return { searchQuestions }
}