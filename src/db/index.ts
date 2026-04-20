import Dexie, { type Table } from 'dexie'
import type { Question } from '@/types/question'

export class SmartStudyDB extends Dexie {
  questions!: Table<Question, string>

  constructor() {
    super('SmartStudyDB')
    this.version(2).stores({
      questions: 'id, mastered, createdAt, updatedAt'
    })
  }
}

export const db = new SmartStudyDB()