<template>
  <div class="px-4 pb-6">
    <!-- Reply Preview -->
    <div v-if="replyTo" class="bg-bg-secondary rounded-t-lg px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-text-secondary">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
        </svg>
        <span class="font-medium">{{ replyTo.author.username }}</span>
        <span class="truncate">{{ replyTo.content }}</span>
      </div>
      
      <button 
        class="text-text-muted hover:text-text-primary transition-colors"
        @click="emit('cancel-reply')"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </button>
    </div>
    
    <!-- Input Area -->
    <div 
      :class="cn(
        'bg-bg-secondary flex items-end gap-2 px-4 py-3',
        replyTo ? 'rounded-b-lg' : 'rounded-lg'
      )"
    >
      <!-- Attach Button -->
      <button 
        class="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors shrink-0"
        @click="openFilePicker"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
      
      <!-- Text Input -->
      <div class="flex-1">
        <textarea
          ref="inputRef"
          v-model="message"
          :placeholder="placeholder"
          class="w-full bg-transparent text-text-primary placeholder:text-text-muted resize-none outline-none max-h-[200px] min-h-[24px]"
          rows="1"
          @input="handleInput"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.shift.enter.exact="handleNewLine"
        />
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center gap-1 shrink-0">
        <!-- Emoji Button -->
        <button 
          class="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          @click="openEmojiPicker"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- File input (hidden) -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      multiple
      @change="handleFileSelect"
    />
  </div>
</template>

