<script setup lang="ts">
definePageMeta({
  layout: "app-layout",
})

const {
  selectedSubject,
  questionIndex,
  currentQuestion,
  maxUnlockedIndex,
  selectedAnswers,
  submittedAnswers,
  selectAnswer,
  submitAnswer,
  previousQuestion,
  nextQuestion,
  goToQuestion,
  resetProgress,
} = useReviewer()

function confirmResetProgress() {
  const subjectName = selectedSubject.value.name
  if (!window.confirm(`Reset saved progress for ${subjectName}? This cannot be undone.`)) return
  resetProgress()
}

const answeredQuestionNumbers = computed(() =>
  selectedSubject.value.questions
    .map((question, index) => (selectedAnswers.value[question.id] ? index + 1 : null))
    .filter((number): number is number => number !== null),
)

const submittedQuestionNumbers = computed(() =>
  selectedSubject.value.questions
    .map((question, index) => (submittedAnswers.value[question.id] ? index + 1 : null))
    .filter((number): number is number => number !== null),
)
</script>

<template>
  <ReviewQuestionCard
    v-if="currentQuestion"
    :key="currentQuestion.id"
    :question="currentQuestion"
    :position="questionIndex + 1"
    :total="selectedSubject.totalQuestions"
    :max-unlocked-index="maxUnlockedIndex"
    :selected-key="selectedAnswers[currentQuestion.id]"
    :submitted="Boolean(submittedAnswers[currentQuestion.id])"
    :answered-questions="answeredQuestionNumbers"
    :submitted-questions="submittedQuestionNumbers"
    @select="(key) => selectAnswer(currentQuestion!.id, key)"
    @submit="submitAnswer(currentQuestion!.id)"
    @previous="previousQuestion"
    @next="nextQuestion"
    @go-to="goToQuestion"
    @reset="confirmResetProgress"
  />
  <Card v-else class="mx-4 mt-6 max-w-[750px] gap-0 py-8 text-center sm:mx-auto">
    <CardContent class="text-sm text-slate-500">
      No questions are available for this subject.
    </CardContent>
  </Card>
</template>
