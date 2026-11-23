import { reviewerSubjects, type ReviewSubject } from "~/data/subjects"

export function useReviewer() {
  const selectedSubjectId = useState("reviewer-selected-subject", () => "mathematics")
  const questionIndex = useState("reviewer-question-index", () => 0)
  const selectedAnswers = useState<Record<string, string>>("reviewer-selected-answers", () => ({}))
  const submittedAnswers = useState<Record<string, boolean>>("reviewer-submitted-answers", () => ({}))

  const selectedSubject = computed<ReviewSubject>(
    () => reviewerSubjects.find((subject) => subject.id === selectedSubjectId.value) ?? reviewerSubjects[0],
  )

  const currentQuestion = computed(
    () => selectedSubject.value.questions[questionIndex.value] ?? null,
  )

  function selectSubject(subjectId: string) {
    if (subjectId === selectedSubjectId.value) return
    selectedSubjectId.value = subjectId
    questionIndex.value = 0
  }

  function selectAnswer(questionId: string, key: string) {
    if (submittedAnswers.value[questionId]) return
    selectedAnswers.value = { ...selectedAnswers.value, [questionId]: key }
  }

  function submitAnswer(questionId: string) {
    if (!selectedAnswers.value[questionId]) return
    submittedAnswers.value = { ...submittedAnswers.value, [questionId]: true }
  }

  function previousQuestion() {
    questionIndex.value = Math.max(0, questionIndex.value - 1)
  }

  function nextQuestion() {
    questionIndex.value = Math.min(
      selectedSubject.value.questions.length - 1,
      questionIndex.value + 1,
    )
  }

  return {
    selectedSubjectId,
    selectedSubject,
    questionIndex,
    currentQuestion,
    selectedAnswers,
    submittedAnswers,
    selectSubject,
    selectAnswer,
    submitAnswer,
    previousQuestion,
    nextQuestion,
  }
}
