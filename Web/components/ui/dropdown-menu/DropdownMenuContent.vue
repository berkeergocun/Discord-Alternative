
<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :side-offset="props.sideOffset"
      :align="props.align"
      :class="
        cn(
          'z-[100] min-w-[14rem] overflow-hidden rounded-md bg-bg-floating shadow-xl py-1.5',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=top]:slide-in-from-bottom-2',
          props.class
        )
      "
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
