<script setup lang="ts">
import type { ReviewOption } from "~/data/subjects";

const props = defineProps<{
  option: ReviewOption;
  selected: boolean;
  submitted: boolean;
  correct: boolean;
  disabled?: boolean;
  horizontal?: boolean;
}>();

const stateClass = computed(() => {
  if (!props.submitted) {
    return props.selected
      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 shadow-sm dark:bg-indigo-950/60"
      : "border-slate-300 bg-white shadow-sm hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800";
  }
  if (props.correct)
    return "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 shadow-sm dark:bg-emerald-950/50";
  if (props.selected)
    return "border-rose-400 bg-rose-50 ring-1 ring-rose-400 shadow-sm dark:bg-rose-950/50";
  return "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800";
});

const badgeClass = computed(() => {
  if (!props.submitted) {
    return props.selected
      ? "border-indigo-600 bg-indigo-600 text-white"
      : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
  if (props.correct) return "border-emerald-600 bg-emerald-600 text-white";
  if (props.selected) return "border-rose-500 bg-rose-500 text-white";
  return "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300";
});
</script>

<template>
  <Button
    type="button"
    role="radio"
    :aria-checked="selected"
    :disabled="disabled"
    variant="ghost"
    class="flex h-auto min-h-0 items-center gap-3 rounded-xl border px-3 py-3 text-left whitespace-normal disabled:cursor-default sm:px-4 sm:py-3.5"
    :class="[
      stateClass,
      horizontal
        ? 'flex-col justify-center text-center'
        : 'justify-start text-center',
      horizontal
        ? 'min-h-20 min-w-0 flex-1 basis-[calc(50%-0.375rem)] sm:basis-[calc(25%-0.5625rem)]'
        : 'w-full',
    ]"
  >
    <span
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold"
      :class="badgeClass"
    >
      {{ option.key.toUpperCase() }}
    </span>
    <span
      v-if="option.text"
      class="text-sm font-medium leading-6 text-slate-700 dark:text-slate-200 sm:text-[15px]"
      :class="{ 'text-center': horizontal }"
    >
      {{ option.text }}
    </span>
  </Button>
</template>
