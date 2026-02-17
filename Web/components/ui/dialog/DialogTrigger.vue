
<template>
  <DialogTrigger
    :as-child="props.asChild"
    :class="cn('outline-none', props.class)"
  >
    <slot />
  </DialogTrigger>
</template>
