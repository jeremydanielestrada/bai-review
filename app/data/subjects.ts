import abstractReasoningData from "./abstract_reasoning.json"
import englishData from "./english.json"
import filipinoData from "./filipino.json"
import inductiveReasoningData from "./inductive_reasoning.json"
import mathematicsData from "./mathematics.json"
import constitutionData from "./philippine_constitution.json"

export interface ReviewOption {
  key: string
  text: string | null
  image?: string
}

export interface ReviewQuestion {
  id: string
  number: number
  question: string
  italicized?: string
  bold_italicized?: string
  image?: string
  options: ReviewOption[]
  answer: string
  answer_text?: string
  items?: string[]
  passage?: string
  note?: string
  is_example?: boolean
  statement_1?: string
  statement_2?: string
  review_flag?: string
  explanation?: string
  rationale?: string
  sectionName: string
  sectionDirections?: string
}

export interface ReviewSubject {
  id: string
  name: string
  icon: "calculator" | "book" | "languages" | "brain" | "landmark" | "sigma"
  totalQuestions: number
  questions: ReviewQuestion[]
}

interface RawQuestion extends Omit<ReviewQuestion, "sectionName" | "sectionDirections"> {}

interface RawSection {
  name: string
  directions?: string
  questions: RawQuestion[]
}

interface RawDataset {
  subject: string
  total_questions: number
  sections: RawSection[]
}

function normalizeDataset(
  id: string,
  name: string,
  icon: ReviewSubject["icon"],
  dataset: RawDataset,
): ReviewSubject {
  const questions = dataset.sections.flatMap((section) =>
    section.questions.map((question) => ({
      ...question,
      sectionName: section.name,
      sectionDirections: section.directions,
    })),
  )

  return {
    id,
    name,
    icon,
    totalQuestions: dataset.total_questions,
    questions,
  }
}

export const reviewerSubjects: ReviewSubject[] = [
  normalizeDataset("mathematics", "Mathematics", "sigma", mathematicsData as unknown as RawDataset),
  normalizeDataset("english", "English", "book", englishData as unknown as RawDataset),
  normalizeDataset("filipino", "Filipino", "languages", filipinoData as unknown as RawDataset),
  normalizeDataset("inductive-reasoning", "Inductive Reasoning", "brain", inductiveReasoningData as unknown as RawDataset),
  normalizeDataset("abstract-reasoning", "Abstract Reasoning", "brain", abstractReasoningData as unknown as RawDataset),
  normalizeDataset("philippine-constitution", "Philippine Constitution", "landmark", constitutionData as unknown as RawDataset),
]
