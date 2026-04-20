export interface Question {
  id: string
  questionText: string
  answerText: string
  imageUrl?: string
  mastered: boolean
  reviewCount: number
  lastReviewedAt?: number
  createdAt: number
  updatedAt: number
}