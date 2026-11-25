<script setup lang="ts">
import {
  BookOpen,
  BrainCircuit,
  Calculator,
  Landmark,
  Languages,
  Menu,
  Settings,
  X,
} from "@lucide/vue";
import { reviewerSubjects } from "~/data/subjects";

const sidebarOpen = ref(false);
const { selectedSubjectId, selectSubject } = useReviewer();

const icons = {
  calculator: Calculator,
  sigma: Calculator,
  book: BookOpen,
  languages: Languages,
  brain: BrainCircuit,
  landmark: Landmark,
};

function select(subjectId: string) {
  selectSubject(subjectId);
  sidebarOpen.value = false;
}
</script>

<template>
  <div class="h-[100dvh] overflow-hidden bg-slate-50 text-slate-900">
    <Button
      v-if="sidebarOpen"
      variant="ghost"
      class="fixed inset-0 z-40 h-full w-full rounded-none bg-slate-950/40 hover:bg-slate-950/40 lg:hidden"
      aria-label="Close navigation"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[250px] -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0"
      :class="{ 'translate-x-0': sidebarOpen }"
      aria-label="Subject navigation"
    >
      <div
        class="flex h-16 shrink-0 items-center border-b border-slate-100 px-5"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm"
        >
          R
        </div>
        <div class="ml-3">
          <p class="text-sm font-bold leading-tight">Reviewer App</p>
          <p class="mt-0.5 text-xs text-slate-500">Learning library</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="ml-auto text-slate-500 lg:hidden"
          aria-label="Close navigation"
          @click="sidebarOpen = false"
        >
          <X class="h-5 w-5" />
        </Button>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <p
          class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Subjects
        </p>
        <div class="space-y-1">
          <Button
            v-for="subject in reviewerSubjects"
            :key="subject.id"
            type="button"
            variant="ghost"
            class="flex h-auto w-full items-center justify-start rounded-lg border px-3 py-2.5 text-left text-sm font-medium shadow-sm"
            :class="
              selectedSubjectId === subject.id
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-indigo-100'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950'
            "
            :aria-current="
              selectedSubjectId === subject.id ? 'page' : undefined
            "
            @click="select(subject.id)"
          >
            <span
              class="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              :class="
                selectedSubjectId === subject.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'bg-slate-100 text-slate-500'
              "
            >
              <component :is="icons[subject.icon]" class="h-4 w-4" />
            </span>
            <span class="min-w-0 truncate">{{ subject.name }}</span>
            <span class="ml-auto shrink-0 text-xs font-medium text-slate-400">
              {{ subject.totalQuestions }}
            </span>
          </Button>
        </div>
      </nav>

      <div class="shrink-0 border-t border-slate-100 p-3">
        <Button
          variant="ghost"
          class="h-auto w-full justify-start rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-200 hover:bg-slate-50"
        >
          <span
            class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100"
          >
            <Settings class="h-4 w-4" />
          </span>
          Settings
        </Button>
      </div>
    </aside>

    <section class="flex h-dvh min-w-0 flex-col lg:ml-[250px]">
      <header
        class="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6"
      >
        <Button
          variant="outline"
          size="icon"
          class="mr-3 shrink-0 lg:hidden"
          aria-label="Open subject navigation"
          @click="sidebarOpen = true"
        >
          <Menu class="h-5 w-5" />
        </Button>
        <div class="min-w-0">
          <h1 class="truncate text-base font-bold text-slate-950">
            {{
              reviewerSubjects.find(
                (subject) => subject.id === selectedSubjectId,
              )?.name
            }}
          </h1>
        </div>
      </header>

      <main class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </section>
  </div>
</template>
