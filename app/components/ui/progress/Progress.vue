<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "cn"

const props = withDefaults(
  defineProps<{
    modelValue?: number
    class?: HTMLAttributes["class"]
  }>(),
  {
    modelValue: 0,
  },
)
</script>

<template>
  <div
    data-slot="progress"
    role="progressbar"
    :aria-valuenow="props.modelValue"
    aria-valuemin="0"
    aria-valuemax="100"
    :class="cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', props.class)"
  >
    <div
      data-slot="progress-indicator"
      class="bg-primary h-full transition-all"
      :style="{ width: `${props.modelValue}%` }"
    />
  </div>
</template>
