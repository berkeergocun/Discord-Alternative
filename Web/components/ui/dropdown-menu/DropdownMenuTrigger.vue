
<template>
  <DropdownMenuTrigger
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('outline-none', props.class)"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
