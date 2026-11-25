type Theme = "light" | "dark"

const THEME_STORAGE_KEY = "reviewer-theme"

export function useTheme() {
  const theme = useState<Theme>("reviewer-theme", () => "light")
  const isDark = computed(() => theme.value === "dark")

  function applyTheme() {
    if (!import.meta.client) return
    document.documentElement.classList.toggle("dark", isDark.value)
    document.documentElement.style.colorScheme = theme.value
  }

  function toggleTheme() {
    theme.value = isDark.value ? "light" : "dark"
    applyTheme()

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme.value)
    } catch (error) {
      console.error("Unable to save the theme preference to localStorage.", error)
    }
  }

  onMounted(() => {
    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (savedTheme === "light" || savedTheme === "dark") {
        theme.value = savedTheme
      }
    } catch (error) {
      console.error("Unable to load the theme preference from localStorage.", error)
    }

    applyTheme()
  })

  return { isDark, toggleTheme }
}
