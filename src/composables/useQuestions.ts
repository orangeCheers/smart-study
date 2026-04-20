import { db } from '@/db'
import type { Question } from '@/types/question'

export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useQuestions() {
  async function addQuestion(q: Omit<Question, 'id' | 'mastered' | 'reviewCount' | 'createdAt' | 'updatedAt'>) {
    const now = Date.now()
    return db.questions.add({
      ...q,
      id: generateId(),
      mastered: false,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now
    })
  }

  async function updateQuestion(id: string, updates: Partial<Question>) {
    return db.questions.update(id, { ...updates, updatedAt: Date.now() })
  }

  async function deleteQuestion(id: string) {
    return db.questions.delete(id)
  }

  async function getRecentQuestions(limit = 5) {
    return db.questions.orderBy('createdAt').reverse().limit(limit).toArray()
  }

  async function getAllQuestions() {
    return db.questions.orderBy('createdAt').reverse().toArray()
  }

  async function getUnmasteredQuestions() {
    return db.questions.where('mastered').equals(0).toArray()
  }

  async function markMastered(id: string) {
    return updateQuestion(id, { mastered: true })
  }

  async function incrementReview(id: string) {
    const q = await db.questions.get(id)
    if (q) {
      return updateQuestion(id, {
        reviewCount: q.reviewCount + 1,
        lastReviewedAt: Date.now()
      })
    }
  }

  async function getCount() {
    return db.questions.count()
  }

  async function getMasteredCount() {
    return db.questions.where('mastered').equals(1).count()
  }

  return {
    addQuestion, updateQuestion, deleteQuestion,
    getRecentQuestions, getAllQuestions,
    getUnmasteredQuestions, markMastered, incrementReview,
    getCount, getMasteredCount
  }
}