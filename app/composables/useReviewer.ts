import { reviewerSubjects, type ReviewSubject } from "~/data/subjects"

export function useReviewer() {
  const selectedSubjectId = useState("reviewer-selected-subject", () => "mathematics")
  const questionIndex = useState("reviewer-question-index", () => 0)
  const subjectQuestionIndexes = useState<Record<string, number>>("reviewer-subject-question-indexes", () => ({}))
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
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: questionIndex.value,
    }
    selectedSubjectId.value = subjectId
    const nextSubject = reviewerSubjects.find((subject) => subject.id === subjectId)
    const savedIndex = subjectQuestionIndexes.value[subjectId] ?? 0
    questionIndex.value = Math.min(
      savedIndex,
      (nextSubject?.questions.length ?? 1) - 1,
    )
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
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: questionIndex.value,
    }
  }

  function nextQuestion() {
    questionIndex.value = Math.min(
      selectedSubject.value.questions.length - 1,
      questionIndex.value + 1,
    )
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: questionIndex.value,
    }
  }

  function goToQuestion(index: number) {
    questionIndex.value = Math.max(
      0,
      Math.min(selectedSubject.value.questions.length - 1, index),
    )
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: questionIndex.value,
    }
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
    goToQuestion,
  }
}
