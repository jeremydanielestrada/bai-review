import { reviewerSubjects, type ReviewSubject } from "~/data/subjects"

interface PersistedReviewerState {
  version: 1
  selectedSubjectId: string
  questionIndexes: Record<string, number>
  selectedAnswers: Record<string, string>
  submittedAnswers: Record<string, boolean>
}

const STORAGE_KEY = "reviewer-progress-v1"

function getMaxUnlockedIndex(subject: ReviewSubject, submittedAnswers: Record<string, boolean>) {
  const firstUnsubmitted = subject.questions.findIndex(
    (question) => !submittedAnswers[question.id],
  )
  return firstUnsubmitted < 0
    ? subject.questions.length - 1
    : firstUnsubmitted
}

export function useReviewer() {
  const selectedSubjectId = useState("reviewer-selected-subject", () => "mathematics")
  const questionIndex = useState("reviewer-question-index", () => 0)
  const subjectQuestionIndexes = useState<Record<string, number>>("reviewer-subject-question-indexes", () => ({}))
  const selectedAnswers = useState<Record<string, string>>("reviewer-selected-answers", () => ({}))
  const submittedAnswers = useState<Record<string, boolean>>("reviewer-submitted-answers", () => ({}))
  const persistenceReady = useState("reviewer-persistence-ready", () => false)
  const persistenceWatcherInstalled = useState("reviewer-persistence-watcher-installed", () => false)

  const selectedSubject = computed<ReviewSubject>(
    () => reviewerSubjects.find((subject) => subject.id === selectedSubjectId.value) ?? reviewerSubjects[0],
  )

  const currentQuestion = computed(
    () => selectedSubject.value.questions[questionIndex.value] ?? null,
  )

  const maxUnlockedIndex = computed(() =>
    getMaxUnlockedIndex(selectedSubject.value, submittedAnswers.value),
  )

  function persistProgress() {
    if (!persistenceReady.value || !import.meta.client) return

    const state: PersistedReviewerState = {
      version: 1,
      selectedSubjectId: selectedSubjectId.value,
      questionIndexes: subjectQuestionIndexes.value,
      selectedAnswers: selectedAnswers.value,
      submittedAnswers: submittedAnswers.value,
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error("Unable to save reviewer progress to localStorage.", error)
    }
  }

  function installPersistenceWatcher() {
    if (persistenceWatcherInstalled.value) return

    watch(
      [selectedSubjectId, questionIndex, subjectQuestionIndexes, selectedAnswers, submittedAnswers],
      persistProgress,
      { deep: true },
    )
    persistenceWatcherInstalled.value = true
  }

  function initializePersistence() {
    if (!import.meta.client || persistenceReady.value) return

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const state = JSON.parse(saved) as Partial<PersistedReviewerState>
        if (state.version === 1) {
          const subjectExists = reviewerSubjects.some(
            (subject) => subject.id === state.selectedSubjectId,
          )
          if (subjectExists && state.selectedSubjectId) {
            selectedSubjectId.value = state.selectedSubjectId
          }
          if (state.questionIndexes && typeof state.questionIndexes === "object") {
            subjectQuestionIndexes.value = state.questionIndexes
          }
          if (state.selectedAnswers && typeof state.selectedAnswers === "object") {
            selectedAnswers.value = state.selectedAnswers
          }
          if (state.submittedAnswers && typeof state.submittedAnswers === "object") {
            submittedAnswers.value = state.submittedAnswers
          }
        }
      }

      const subject = reviewerSubjects.find(
        (item) => item.id === selectedSubjectId.value,
      ) ?? reviewerSubjects[0]
      const savedIndex = subjectQuestionIndexes.value[subject.id] ?? 0
      const maximumIndex = getMaxUnlockedIndex(subject, submittedAnswers.value)
      questionIndex.value = Math.max(0, Math.min(savedIndex, maximumIndex))
      subjectQuestionIndexes.value = {
        ...subjectQuestionIndexes.value,
        [subject.id]: questionIndex.value,
      }
      persistenceReady.value = true
    } catch (error) {
      console.error("Unable to load reviewer progress from localStorage.", error)
      persistenceReady.value = true
    }

    installPersistenceWatcher()
  }

  onMounted(initializePersistence)

  function selectSubject(subjectId: string) {
    if (subjectId === selectedSubjectId.value) return
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: questionIndex.value,
    }
    selectedSubjectId.value = subjectId
    const nextSubject = reviewerSubjects.find((subject) => subject.id === subjectId)
    const savedIndex = subjectQuestionIndexes.value[subjectId] ?? 0
    questionIndex.value = nextSubject
      ? Math.max(
          0,
          Math.min(savedIndex, getMaxUnlockedIndex(nextSubject, submittedAnswers.value)),
        )
      : 0
  }

  function selectAnswer(questionId: string, key: string) {
    if (submittedAnswers.value[questionId]) return
    selectedAnswers.value = { ...selectedAnswers.value, [questionId]: key }
  }

  function submitAnswer(questionId: string) {
    if (!selectedAnswers.value[questionId]) return
    submittedAnswers.value = { ...submittedAnswers.value, [questionId]: true }
    const submittedIndex = selectedSubject.value.questions.findIndex(
      (question) => question.id === questionId,
    )
    if (submittedIndex === questionIndex.value) {
      const nextIndex = Math.min(
        selectedSubject.value.questions.length - 1,
        submittedIndex + 1,
      )
      subjectQuestionIndexes.value = {
        ...subjectQuestionIndexes.value,
        [selectedSubjectId.value]: nextIndex,
      }
    }
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
      maxUnlockedIndex.value,
      questionIndex.value + 1,
    )
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: questionIndex.value,
    }
  }

  function goToQuestion(index: number) {
    const targetIndex = Math.max(
      0,
      Math.min(maxUnlockedIndex.value, index),
    )
    questionIndex.value = targetIndex
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: questionIndex.value,
    }
  }

  function resetProgress() {
    const questionIds = new Set(
      selectedSubject.value.questions.map((question) => question.id),
    )
    const remainingSelectedAnswers = { ...selectedAnswers.value }
    const remainingSubmittedAnswers = { ...submittedAnswers.value }

    for (const questionId of questionIds) {
      delete remainingSelectedAnswers[questionId]
      delete remainingSubmittedAnswers[questionId]
    }

    questionIndex.value = 0
    subjectQuestionIndexes.value = {
      ...subjectQuestionIndexes.value,
      [selectedSubjectId.value]: 0,
    }
    selectedAnswers.value = remainingSelectedAnswers
    submittedAnswers.value = remainingSubmittedAnswers
    persistProgress()
  }

  return {
    selectedSubjectId,
    selectedSubject,
    questionIndex,
    currentQuestion,
    maxUnlockedIndex,
    selectedAnswers,
    submittedAnswers,
    selectSubject,
    selectAnswer,
    submitAnswer,
    previousQuestion,
    nextQuestion,
    goToQuestion,
    resetProgress,
  }
}
