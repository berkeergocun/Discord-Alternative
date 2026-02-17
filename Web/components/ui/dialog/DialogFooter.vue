
<template>
  <div
    :class="
      cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-6 pt-4',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
