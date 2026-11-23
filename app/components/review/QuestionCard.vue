<script setup lang="ts">
import { Clock3 } from "@lucide/vue"
import type { ReviewQuestion } from "~/data/subjects"

const props = defineProps<{
  question: ReviewQuestion
  position: number
  total: number
  selectedKey: string | undefined
  submitted: boolean
}>()

const emit = defineEmits<{
  select: [key: string]
  submit: []
  previous: []
  next: []
}>()

const isCorrect = computed(
  () => props.selectedKey?.toLowerCase() === props.question.answer.toLowerCase(),
)
</script>

<template>
  <div class="mx-auto w-full max-w-[750px] px-4 py-6 sm:px-6 sm:py-8">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
          Question {{ position }} of {{ total }}
        </p>
        <div class="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
          <div
            class="h-full rounded-full bg-indigo-600 transition-[width]"
            :style="{ width: `${Math.max(5, (position / total) * 100)}%` }"
          />
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600">
        <Clock3 class="h-4 w-4 text-slate-400" />
        14:32
      </div>
    </div>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-8">
      <p v-if="question.sectionName" class="mb-3 text-xs font-semibold text-slate-500">
        {{ question.sectionName }}
      </p>
      <p v-if="question.sectionDirections" class="mb-5 rounded-lg bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-600">
        {{ question.sectionDirections }}
      </p>

      <div v-if="question.items?.length" class="mb-5 space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p v-for="item in question.items" :key="item">{{ item }}</p>
      </div>

      <p v-if="question.passage" class="mb-5 whitespace-pre-line rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {{ question.passage }}
      </p>

      <div v-if="question.statement_1 || question.statement_2" class="mb-5 space-y-2 rounded-lg border border-slate-200 p-4 text-sm text-slate-700">
        <p v-if="question.statement_1"><span class="font-bold">Statement 1:</span> {{ question.statement_1 }}</p>
        <p v-if="question.statement_2"><span class="font-bold">Statement 2:</span> {{ question.statement_2 }}</p>
      </div>

      <p v-if="question.note" class="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm leading-6 text-amber-800">
        {{ question.note }}
      </p>

      <div class="flex items-start gap-3">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">
          {{ position }}
        </span>
        <h2 class="pt-0.5 text-lg font-bold leading-7 text-slate-950 sm:text-xl sm:leading-8">
          {{ question.question }}
        </h2>
      </div>

      <figure v-if="question.image" class="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <img
          :src="question.image"
          :alt="`Figure for question ${position}`"
          class="block h-auto w-full"
          loading="eager"
        />
      </figure>

      <div class="mt-7 space-y-3" role="radiogroup" :aria-label="`Answer choices for question ${position}`">
        <ReviewAnswerOption
          v-for="option in question.options"
          :key="option.key"
          :option="option"
          :selected="selectedKey?.toLowerCase() === option.key.toLowerCase()"
          :submitted="submitted"
          :correct="question.answer.toLowerCase() === option.key.toLowerCase()"
          :disabled="submitted"
          @click="emit('select', option.key)"
        />
      </div>

      <ReviewAnswerFeedback
        v-if="submitted"
        :question="question"
        :is-correct="isCorrect"
      />

      <div class="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          type="button"
          class="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          :disabled="position <= 1"
          @click="emit('previous')"
        >
          Previous
        </button>
        <button
          v-if="!submitted"
          type="button"
          class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          :disabled="!selectedKey"
          @click="emit('submit')"
        >
          Submit answer
        </button>
        <button
          v-else
          type="button"
          class="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          :disabled="position >= total"
          @click="emit('next')"
        >
          Next question
        </button>
      </div>
    </article>
  </div>
</template>
