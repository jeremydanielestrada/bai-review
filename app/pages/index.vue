<script setup lang="ts">
definePageMeta({
  layout: "app-layout",
})

const {
  selectedSubject,
  questionIndex,
  currentQuestion,
  selectedAnswers,
  submittedAnswers,
  selectAnswer,
  submitAnswer,
  previousQuestion,
  nextQuestion,
} = useReviewer()
</script>

<template>
  <ReviewQuestionCard
    v-if="currentQuestion"
    :key="currentQuestion.id"
    :question="currentQuestion"
    :position="questionIndex + 1"
    :total="selectedSubject.totalQuestions"
    :selected-key="selectedAnswers[currentQuestion.id]"
    :submitted="Boolean(submittedAnswers[currentQuestion.id])"
    @select="(key) => selectAnswer(currentQuestion!.id, key)"
    @submit="submitAnswer(currentQuestion!.id)"
    @previous="previousQuestion"
    @next="nextQuestion"
  />
  <Card v-else class="mx-4 mt-6 max-w-[750px] gap-0 py-8 text-center sm:mx-auto">
    <CardContent class="text-sm text-slate-500">
      No questions are available for this subject.
    </CardContent>
  </Card>
</template>
