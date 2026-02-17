<template>
  <div 
    :class="cn(
      'inline-flex items-center justify-center font-semibold',
      variantClasses[variant],
      sizeClasses[size],
      className
    )"
  >
    <slot />
  </div>
</template>

