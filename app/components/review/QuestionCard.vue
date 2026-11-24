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

const questionSegments = computed(() => {
  const question = props.question.question
  const emphasized = props.question.italicized
  if (!emphasized) return [{ text: question, emphasized: false }]

  const index = question.toLowerCase().indexOf(emphasized.toLowerCase())
  if (index < 0) return [{ text: question, emphasized: false }]

  return [
    { text: question.slice(0, index), emphasized: false },
    { text: question.slice(index, index + emphasized.length), emphasized: true },
    { text: question.slice(index + emphasized.length), emphasized: false },
  ].filter((segment) => segment.text.length > 0)
})
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
            <em v-if="segment.emphasized" class="underline decoration-indigo-500 decoration-2 underline-offset-3">{{ segment.text }}</em>
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
  </div>
</template>
