<script setup lang="ts">
import { CheckCircle2, XCircle } from "@lucide/vue"
import type { ReviewQuestion } from "~/data/subjects"

defineProps<{
  question: ReviewQuestion
  isCorrect: boolean
}>()
</script>

<template>
  <Alert
    class="mt-5"
    :class="isCorrect
      ? 'border-emerald-200 bg-emerald-50'
      : 'border-rose-200 bg-rose-50'"
  >
    <div class="flex items-start gap-2.5">
      <CheckCircle2 v-if="isCorrect" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      <XCircle v-else class="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
      <div>
        <AlertTitle class="text-sm font-bold" :class="isCorrect ? 'text-emerald-900' : 'text-rose-900'">
          {{ isCorrect ? "Correct" : "Incorrect" }}
          <span class="font-semibold">
            — Answer: {{ question.answer_text || question.answer.toUpperCase() }}
          </span>
        </AlertTitle>
        <AlertDescription
          v-if="question.explanation || question.rationale"
          class="mt-1 text-sm leading-6"
          :class="isCorrect ? 'text-emerald-800' : 'text-rose-800'"
        >
          {{ question.explanation || question.rationale }}
        </AlertDescription>
      </div>
    </div>
  </Alert>
</template>
