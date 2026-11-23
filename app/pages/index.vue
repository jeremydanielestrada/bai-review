<script setup lang="ts">
definePageMeta({
  layout: "app-layout",
});

const selectedAnswer = ref<number | null>(null)
const showAnswer = ref(false)

const answers = [
  { letter: "A", text: "A system of living organisms and their environment" },
  { letter: "B", text: "A community of plants and animals only" },
  { letter: "C", text: "The physical environment without living organisms" },
  { letter: "D", text: "A collection of weather patterns over time" },
]

function selectAnswer(index: number) {
  if (!showAnswer.value) selectedAnswer.value = index
}

function submitAnswer() {
  if (selectedAnswer.value !== null) showAnswer.value = true
}
</script>

<template>
  <div class="mx-auto w-full max-w-[750px] px-4 py-6 sm:px-6 sm:py-8">
    <div class="mb-5 flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">Question 1 of 20</p>
        <div class="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
          <div class="h-full w-[5%] rounded-full bg-indigo-600" />
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600">
        <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        </svg>
        14:32
      </div>
    </div>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-8">
      <div class="flex items-start gap-3">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">1</span>
        <h2 class="pt-0.5 text-lg font-bold leading-7 text-slate-950 sm:text-xl sm:leading-8">
          Which of the following best describes an ecosystem?
        </h2>
      </div>

      <div class="mt-7 space-y-3" role="radiogroup" aria-label="Answer choices">
        <button
          v-for="(answer, index) in answers"
          :key="answer.letter"
          type="button"
          role="radio"
          :aria-checked="selectedAnswer === index"
          class="group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors sm:px-4 sm:py-3.5"
          :class="selectedAnswer === index
            ? 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'"
          @click="selectAnswer(index)"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors"
            :class="selectedAnswer === index
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-300'"
          >
            {{ answer.letter }}
          </span>
          <span class="text-sm font-medium leading-6 text-slate-700 sm:text-[15px]">{{ answer.text }}</span>
        </button>
      </div>

      <div v-if="showAnswer" class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
        <div class="flex items-start gap-2.5">
          <svg viewBox="0 0 24 24" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" />
          </svg>
          <div>
            <p class="text-sm font-bold text-emerald-900">Correct answer: A</p>
            <p class="mt-1 text-sm leading-6 text-emerald-800">
              An ecosystem includes both the living organisms and their physical environment, and the interactions between them.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
        <button type="button" class="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-400" disabled>
          Previous
        </button>
        <button
          v-if="!showAnswer"
          type="button"
          class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          :disabled="selectedAnswer === null"
          @click="submitAnswer"
        >
          Submit answer
        </button>
        <button v-else type="button" class="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800">
          Next question
        </button>
      </div>
    </article>
  </div>
</template>
