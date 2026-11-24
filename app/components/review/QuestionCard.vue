<script setup lang="ts">
import { Clock3 } from "@lucide/vue"
import type { ReviewQuestion } from "~/data/subjects"

const props = defineProps<{
  question: ReviewQuestion
  position: number
  total: number
  selectedKey: string | undefined
  submitted: boolean
  answeredQuestions: number[]
  submittedQuestions: number[]
}>()

const emit = defineEmits<{
  select: [key: string]
  submit: []
  previous: []
  next: []
  goTo: [index: number]
}>()

const isCorrect = computed(
  () => props.selectedKey?.toLowerCase() === props.question.answer.toLowerCase(),
)

const questionSegments = computed(() => {
  const question = props.question.question
  const emphasized = props.question.bold_italicized || props.question.italicized
  if (!emphasized) return [{ text: question, style: "" }]

  const index = question.toLowerCase().indexOf(emphasized.toLowerCase())
  if (index < 0) return [{ text: question, style: "" }]

  const style = props.question.bold_italicized ? "bold-italic" : "italic"

  return [
    { text: question.slice(0, index), style: "" },
    { text: question.slice(index, index + emphasized.length), style },
    { text: question.slice(index + emphasized.length), style: "" },
  ].filter((segment) => segment.text.length > 0)
})

const paginationItems = computed<(number | "ellipsis")[]>(() => {
  const total = props.total
  if (total <= 12) return Array.from({ length: total }, (_, index) => index + 1)

  const current = props.position
  const start = Math.max(2, current - 4)
  const end = Math.min(total - 1, current + 4)
  const items: (number | "ellipsis")[] = [1]

  if (start > 2) items.push("ellipsis")
  for (let number = start; number <= end; number += 1) items.push(number)
  if (end < total - 1) items.push("ellipsis")
  items.push(total)

  return items
})

function paginationClass(number: number) {
  if (number === props.position) {
    return "border-indigo-600 bg-indigo-600 text-white shadow-sm"
  }
  if (props.submittedQuestions.includes(number)) {
    return "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
  }
  if (props.answeredQuestions.includes(number)) {
    return "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
  }
  return "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
}
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
      <Badge variant="outline" class="gap-2 rounded-full px-3 py-1.5 text-sm text-slate-600">
        <Clock3 class="h-4 w-4 text-slate-400" />
        14:32
      </Badge>
    </div>

    <Card class="gap-0 rounded-2xl border-slate-200 px-5 pt-5 pb-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:px-8 sm:pt-8 sm:pb-8">
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
          <template v-for="(segment, index) in questionSegments" :key="index">
            <strong v-if="segment.style === 'bold-italic'" class="font-bold italic">{{ segment.text }}</strong>
            <em v-else-if="segment.style === 'italic'" class="underline decoration-indigo-500 decoration-2 underline-offset-3">{{ segment.text }}</em>
            <template v-else>{{ segment.text }}</template>
          </template>
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
        <Button
          type="button"
          variant="ghost"
          class="h-10 rounded-lg px-3 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          :disabled="position <= 1"
          @click="emit('previous')"
        >
          Previous
        </Button>
        <Button
          v-if="!submitted"
          type="button"
          variant="default"
          class="h-10 rounded-lg bg-indigo-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          :disabled="!selectedKey"
          @click="emit('submit')"
        >
          Submit answer
        </Button>
        <Button
          v-else
          type="button"
          variant="default"
          class="h-10 rounded-lg bg-slate-900 px-5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
          :disabled="position >= total"
          @click="emit('next')"
        >
          Next question
        </Button>
      </div>
    </Card>

    <nav
      class="mt-4 flex w-full items-center justify-center gap-1.5 overflow-x-auto py-1"
      aria-label="Question pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        class="shrink-0"
        :disabled="position <= 1"
        aria-label="Go to previous question"
        @click="emit('previous')"
      >
        ‹
      </Button>
      <template v-for="item in paginationItems" :key="item">
        <span
          v-if="item === 'ellipsis'"
          class="flex h-8 w-5 shrink-0 items-center justify-center text-xs text-slate-400"
        >
          …
        </span>
        <Button
          v-else
          type="button"
          variant="outline"
          size="icon-sm"
          class="h-8 w-8 shrink-0 rounded-lg p-0 text-xs"
          :class="paginationClass(item)"
          :aria-current="item === position ? 'page' : undefined"
          :aria-label="`Go to question ${item}`"
          @click="emit('goTo', item - 1)"
        >
          {{ item }}
        </Button>
      </template>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        class="shrink-0"
        :disabled="position >= total"
        aria-label="Go to next question"
        @click="emit('next')"
      >
        ›
      </Button>
    </nav>
  </div>
</template>
