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
          <Progress
            :model-value="Math.max(5, (position / total) * 100)"
            class="mt-2 h-1.5 w-32 bg-indigo-100"
          />
      </div>
      <Badge variant="outline" class="gap-2 rounded-full px-3 py-1.5 text-sm text-slate-600">
        <Clock3 class="h-4 w-4 text-slate-400" />
        14:32
      </Badge>
    </div>

    <Card class="gap-0 rounded-2xl border-slate-200 py-0 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <CardHeader class="px-5 pt-5 sm:px-8 sm:pt-8">
        <CardDescription v-if="question.sectionName" class="text-xs font-semibold text-slate-500">
          {{ question.sectionName }}
        </CardDescription>
        <div v-if="question.sectionDirections" class="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-600">
          {{ question.sectionDirections }}
        </div>
      </CardHeader>

      <CardContent class="px-5 pb-5 sm:px-8 sm:pb-8">

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
        <Button
          type="button"
          variant="ghost"
          class="text-slate-500"
          :disabled="position <= 1"
          @click="emit('previous')"
        >
          Previous
        </Button>
        <Button
          v-if="!submitted"
          type="button"
          class="bg-indigo-600 text-white hover:bg-indigo-700"
          :disabled="!selectedKey"
          @click="emit('submit')"
        >
          Submit answer
        </Button>
        <Button
          v-else
          type="button"
          class="bg-slate-900 text-white hover:bg-slate-800"
          :disabled="position >= total"
          @click="emit('next')"
        >
          Next question
        </Button>
      </div>
      </CardContent>
    </Card>
  </div>
</template>
