<script setup lang="ts">
const sidebarOpen = ref(false)
const selectedSubject = ref("Science")

const subjects = [
  { name: "Mathematics", icon: "calculator" },
  { name: "Science", icon: "science" },
  { name: "English", icon: "book" },
  { name: "Filipino", icon: "language" },
  { name: "Social Studies", icon: "globe" },
  { name: "Information Technology", icon: "code" },
]

function selectSubject(subject: string) {
  selectedSubject.value = subject
  sidebarOpen.value = false
}
</script>

<template>
  <div class="h-[100dvh] overflow-hidden bg-slate-50 text-slate-900">
    <button
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
      aria-label="Close navigation"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-[250px] -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0"
      :class="{ 'translate-x-0': sidebarOpen }"
      aria-label="Subject navigation"
    >
      <div class="flex h-16 shrink-0 items-center border-b border-slate-100 px-5">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
          R
        </div>
        <div class="ml-3">
          <p class="text-sm font-bold leading-tight">Reviewer App</p>
          <p class="mt-0.5 text-xs text-slate-500">Learning library</p>
        </div>
        <button
          class="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close navigation"
          @click="sidebarOpen = false"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Subjects</p>
        <div class="space-y-1">
          <button
            v-for="subject in subjects"
            :key="subject.name"
            type="button"
            class="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors"
            :class="selectedSubject === subject.name
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'"
            :aria-current="selectedSubject === subject.name ? 'page' : undefined"
            @click="selectSubject(subject.name)"
          >
            <span
              class="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              :class="selectedSubject === subject.name ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-100 text-slate-500'"
            >
              <svg v-if="subject.icon === 'calculator'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="4" y="2.5" width="16" height="19" rx="2" /><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 18h2M14 18h2" />
              </svg>
              <svg v-else-if="subject.icon === 'science'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M9 3h6M10 3v6l-5 9.5A1.5 1.5 0 0 0 6.3 21h11.4a1.5 1.5 0 0 0 1.3-2.5L14 9V3M7.5 16h9" />
              </svg>
              <svg v-else-if="subject.icon === 'book'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5v-16Z" />
              </svg>
              <svg v-else-if="subject.icon === 'language'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 5h10M9 3v2M6 9c1.8 3.5 4.7 5.8 8 7M14 5c-1 5-4 9-8 11M13 20l4-10 4 10M14.5 16h5" />
              </svg>
              <svg v-else-if="subject.icon === 'globe'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
              </svg>
            </span>
            {{ subject.name }}
          </button>
        </div>
      </nav>

      <div class="shrink-0 border-t border-slate-100 p-3">
        <button class="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">
          <span class="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L7.6 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 6.4 14h-.2v-2.6h.2A1.7 1.7 0 0 0 8 10.4a1.7 1.7 0 0 0-.3-1.9L7.6 8l1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 12.4 5v-.2H15V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14H21a1.7 1.7 0 0 0-1.6 1Z" />
            </svg>
          </span>
          Settings
        </button>
      </div>
    </aside>

    <section class="flex h-dvh min-w-0 flex-col lg:ml-[250px]">
      <header class="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-4 sm:px-6">
        <button
          class="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open subject navigation"
          @click="sidebarOpen = true"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div class="min-w-0">
          <h1 class="truncate text-base font-bold text-slate-950">Reviewer App</h1>
          <p class="truncate text-xs text-slate-500">{{ selectedSubject }}</p>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <button class="hidden h-10 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex">
            Exit review
          </button>
          <button class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white" aria-label="User profile">
            JE
          </button>
        </div>
      </header>

      <main class="min-h-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </section>
  </div>
</template>
