<script setup lang="ts">
import baiReviewLogo from "~/assets/images/bai-review-logo.png"

useHead({
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: baiReviewLogo,
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
