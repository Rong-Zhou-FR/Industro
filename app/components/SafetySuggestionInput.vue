<template>
  <div class="safety-suggestion-input">
    <label v-if="label">{{ label }}</label>
    <div class="suggestion-input-container">
      <input
        v-model="query"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        @input="handleInput"
        @keydown.enter.prevent="addCustomItem"
        @keydown.escape="hideSuggestions"
      >
      <div v-if="showSuggestions && groupedMatches.length > 0" class="suggestions-dropdown">
        <template v-for="group in groupedMatches" :key="group.key">
          <div class="suggestion-category">{{ group.categoryLabel }}</div>
          <div
            v-for="item in group.items"
            :key="item.id || item.name"
            class="suggestion-item"
            @click="selectItem(item)"
          >
            <span class="suggestion-name">{{ item.name }}</span>
            <div v-if="item.badges" class="suggestion-badges">
              <span
                v-for="badge in item.badges"
                :key="badge.text"
                :class="['badge', badge.class]"
              >
                {{ badge.text }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-if="selectedItems.length > 0" class="selected-items-list">
      <div
        v-for="(item, index) in selectedItems"
        :key="index"
        class="selected-item-tag"
      >
        <span class="tag-name">{{ item.name }}</span>
        <div v-if="item.badges" class="suggestion-badges">
          <span
            v-for="badge in item.badges"
            :key="badge.text"
            :class="['badge', badge.class]"
          >
            {{ badge.text }}
          </span>
        </div>
        <span class="tag-remove" @click="removeItem(index)">×</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Badge {
  text: string
  class: string
}

interface SuggestionItem {
  id?: string
  name: string
  badges?: Badge[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface GroupedMatch {
  key: string
  categoryLabel: string
  items: SuggestionItem[]
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: any[]
  suggestions: SuggestionItem[]
  label?: string
  placeholder?: string
  minQueryLength?: number
  groupBy?: (item: SuggestionItem) => { key: string; label: string }
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Start typing to see suggestions...',
  minQueryLength: 2,
  groupBy: undefined
})

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'update:modelValue': [value: any[]]
}>()

const query = ref('')
const showSuggestions = ref(false)

const selectedItems = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Filter suggestions based on query
const filteredSuggestions = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (q.length < props.minQueryLength) return []
  
  return props.suggestions.filter(item => 
    item.name.toLowerCase().includes(q)
  )
})

// Group filtered suggestions
const groupedMatches = computed((): GroupedMatch[] => {
  if (!props.groupBy) {
    // No grouping, return as single group
    return filteredSuggestions.value.length > 0
      ? [{
          key: 'all',
          categoryLabel: '',
          items: filteredSuggestions.value
        }]
      : []
  }
  
  const grouped: Record<string, GroupedMatch> = {}
  filteredSuggestions.value.forEach((item) => {
    const { key, label } = props.groupBy!(item)
    if (!grouped[key]) {
      grouped[key] = { key, categoryLabel: label, items: [] }
    }
    grouped[key].items.push(item)
  })
  
  return Object.values(grouped)
})

const handleInput = () => {
  showSuggestions.value = filteredSuggestions.value.length > 0
}

const hideSuggestions = () => {
  showSuggestions.value = false
}

const selectItem = (item: SuggestionItem) => {
  // Check if item already exists
  if (selectedItems.value.some(selected => selected.name === item.name)) {
    return
  }
  
  selectedItems.value = [...selectedItems.value, item]
  query.value = ''
  hideSuggestions()
}

const addCustomItem = () => {
  const customValue = query.value.trim()
  if (customValue) {
    selectItem({ name: customValue })
  }
}

const removeItem = (index: number) => {
  selectedItems.value = selectedItems.value.filter((_, i) => i !== index)
}

// Click outside handler
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.suggestion-input-container')) {
    hideSuggestions()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.safety-suggestion-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-input-container {
  position: relative;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e0f2fe;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
}

.suggestion-category {
  padding: 10px 15px;
  background: #e0f2fe;
  font-weight: 600;
  color: #2563eb;
  border-bottom: 1px solid #cbd5e1;
}

.suggestion-item {
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background: #e0f2fe;
}

.suggestion-name {
  flex: 1;
}

.suggestion-badges {
  display: flex;
  gap: 5px;
}

.badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: 600;
  color: white;
}

.badge-ppe {
  background: #64748b;
}

.badge-cpe {
  background: #475569;
}

.badge-electrical {
  background: #eab308;
}

.badge-mechanical {
  background: #92400e;
}

.badge-common {
  background: #dc2626;
}

.selected-items-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  min-height: 40px;
}

.selected-item-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 2px solid #e0f2fe;
  border-radius: 8px;
  font-size: 0.9em;
}

.tag-name {
  color: #1e293b;
  font-weight: 500;
}

.tag-remove {
  cursor: pointer;
  color: #ef4444;
  font-weight: bold;
  padding: 0 5px;
  transition: transform 0.2s;
}

.tag-remove:hover {
  transform: scale(1.2);
}
</style>
