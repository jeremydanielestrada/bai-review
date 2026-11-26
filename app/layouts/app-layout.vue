<script setup lang="ts">
import {
  BookOpen,
  BrainCircuit,
  Calculator,
  GitBranch,
  Landmark,
  Languages,
  Menu,
  Moon,
  Settings,
  Sun,
  X,
} from "@lucide/vue";
import qrCodeImage from "~/assets/images/my qr.jpg";
import { reviewerSubjects } from "~/data/subjects";

const sidebarOpen = ref(false);
const { selectedSubjectId, submittedAnswers, selectSubject } = useReviewer();
const { isDark, toggleTheme } = useTheme();
const completedCountsBySubject = computed(() =>
  Object.fromEntries(
    reviewerSubjects.map((subject) => [
      subject.id,
      subject.questions.filter(
        (question) => submittedAnswers.value[question.id],
      ).length,
    ]),
  ),
);

const icons = {
  calculator: Calculator,
  sigma: Calculator,
  book: BookOpen,
  languages: Languages,
  brain: BrainCircuit,
  "git-branch": GitBranch,
  landmark: Landmark,
};

function select(subjectId: string) {
  selectSubject(subjectId);
  sidebarOpen.value = false;
}
</script>

<template>
  <div
    class="h-[100dvh] overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
  >
    <Button
      v-if="sidebarOpen"
      variant="ghost"
      class="fixed inset-0 z-40 h-full w-full rounded-none bg-slate-950/40 hover:bg-slate-950/40 lg:hidden"
      aria-label="Close navigation"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[250px] -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0"
      :class="{ 'translate-x-0': sidebarOpen }"
      aria-label="Subject navigation"
    >
      <div
        class="flex h-16 shrink-0 items-center border-b border-slate-100 px-5 dark:border-slate-800"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm"
        >
          R
        </div>
        <div class="ml-3">
          <p class="text-sm font-bold leading-tight">Bai Review</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="ml-auto text-slate-500 dark:text-slate-400 lg:hidden"
          aria-label="Close navigation"
          @click="sidebarOpen = false"
        >
          <X class="h-5 w-5" />
        </Button>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <p
          class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
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
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:shadow-none'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white'
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
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              "
            >
              <component :is="icons[subject.icon]" class="h-4 w-4" />
            </span>
            <span class="min-w-0 truncate">{{ subject.name }}</span>
            <span
              class="ml-auto shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500"
            >
              <span class="font-bold text-indigo-500 dark:text-slate-400">
                {{ completedCountsBySubject[subject.id] ?? 0 }}
              </span>
              /
              {{ subject.totalQuestions }}
            </span>
          </Button>
        </div>
      </nav>

      <div class="shrink-0 border-t border-slate-100 p-3 dark:border-slate-800">
        <div class="flex flex-col items-center gap-2">
          <img
            :src="qrCodeImage"
            alt="InstaPay QR code"
            class="h-24 w-24 rounded-md object-contain"
          />
          <p class="text-center text-sm">
            By: <span class="font-bold">Jeremy</span>
          </p>
          <p class="text-center text-xs text-slate-500 dark:text-slate-400">
            Pang kape lang po, salamat! <br />
          </p>
        </div>
      </div>
    </aside>

    <section class="flex h-dvh min-w-0 flex-col lg:ml-[250px]">
      <header
        class="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900"
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
          <h1
            class="truncate text-base font-bold text-slate-950 dark:text-slate-100"
          >
            {{
              reviewerSubjects.find(
                (subject) => subject.id === selectedSubjectId,
              )?.name
            }}
          </h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          class="ml-auto shrink-0 border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :aria-pressed="isDark"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </Button>
      </header>

      <main class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </section>
  </div>
</template>
