<script setup lang="ts">
import { CheckCircle2, XCircle } from "@lucide/vue"
import type { ReviewQuestion } from "~/data/subjects"

defineProps<{
  question: ReviewQuestion
  isCorrect: boolean
}>()
</script>

<template>
  <div
    class="mt-5 rounded-xl border px-4 py-3.5"
    :class="isCorrect
      ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/50'
      : 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/50'"
  >
    <div class="flex items-start gap-2.5">
      <CheckCircle2 v-if="isCorrect" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <XCircle v-else class="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
      <div>
        <p class="text-sm font-bold" :class="isCorrect ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'">
          {{ isCorrect ? "Correct" : "Incorrect" }}
          <span class="font-semibold">
            — Answer: {{ question.answer_text || question.answer.toUpperCase() }}
          </span>
        </p>
        <p
          v-if="question.explanation || question.rationale"
          class="mt-1 text-sm leading-6"
          :class="isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'"
        >
          {{ question.explanation || question.rationale }}
        </p>
      </div>
    </div>
  </div>
</template>
