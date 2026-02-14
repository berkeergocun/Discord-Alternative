<template>
  <Suspense>
    <template #default>
      <div class="bg-bg-secondary flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div class="p-4 space-y-4">
          <div v-for="section in memberSections" :key="section.role">
            <MemberSection
              :role="section.role"
              :count="section.members.length"
              :color="section.color"
            />
            
            <div class="space-y-1 mt-2">
              <MemberItem
                v-for="member in section.members"
                :key="member.id"
                :member="member"
                @click="emit('member-click', member.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <MemberListSkeleton />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
interface Member {
  id: string
  username: string
  displayName?: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
  bot?: boolean
  mobile?: boolean
  roles: string[]
  activity?: string
}

interface MemberSection {
  role: string
  color?: string
  members: Member[]
}

interface Props {
  members: Member[]
  roles: Array<{ id: string, name: string, color?: string }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'member-click': [memberId: string]
}>()

const memberSections = computed(() => {
  const sections: MemberSection[] = []
  
  // Group members by their highest role
  const roleMap = new Map<string, Member[]>()
  
  for (const member of props.members) {
    const highestRole = member.roles[0] || '@everyone'
    
    if (!roleMap.has(highestRole)) {
      roleMap.set(highestRole, [])
    }
    
    roleMap.get(highestRole)!.push(member)
  }
  
  // Create sections from role map
  for (const role of props.roles) {
    const members = roleMap.get(role.id)
    if (members && members.length > 0) {
      sections.push({
        role: role.name,
        color: role.color,
        members: members.sort((a, b) => a.username.localeCompare(b.username))
      })
    }
  }
  
  return sections
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1A1B1E;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #2E3035;
}
</style>
