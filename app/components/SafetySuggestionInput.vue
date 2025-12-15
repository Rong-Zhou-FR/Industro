<template>
  <div class="safety-suggestion-input">
    <label v-if="label">{{ label }}</label>
    <div class="input-controls">
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
      <button class="btn-select-list" @click="openModal">
        📋 Select from List
      </button>
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

    <!-- Modal for hierarchical selection -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ label || 'Select Items' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="groupedSuggestions.length > 0" class="hierarchy-tree">
            <div v-for="group in groupedSuggestions" :key="group.key" class="category-group">
              <div class="category-header">
                <input
                  :id="`category-${group.key}`"
                  type="checkbox"
                  :checked="isCategorySelected(group)"
                  :indeterminate.prop="isCategoryIndeterminate(group)"
                  @change="toggleCategory(group, $event)"
                >
                <label :for="`category-${group.key}`">
                  {{ group.categoryLabel }}
                </label>
              </div>
              <div class="category-items">
                <div
                  v-for="item in group.items"
                  :key="item.id || item.name"
                  class="checkbox-item"
                >
                  <input
                    :id="`item-${item.id || item.name}`"
                    type="checkbox"
                    :checked="isItemSelected(item)"
                    @change="toggleItem(item, $event)"
                  >
                  <label :for="`item-${item.id || item.name}`">
                    {{ item.name }}
                    <div v-if="item.badges" class="suggestion-badges">
                      <span
                        v-for="badge in item.badges"
                        :key="badge.text"
                        :class="['badge', badge.class]"
                      >
                        {{ badge.text }}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-suggestions">
            No items available for selection
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="cancelSelection">Cancel</button>
          <button class="btn-apply" @click="applySelection">Apply Selection</button>
        </div>
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
const showModal = ref(false)
const tempSelectedItems = ref<SuggestionItem[]>([])

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

// Group all suggestions for modal (not filtered)
const groupedSuggestions = computed((): GroupedMatch[] => {
  if (!props.groupBy || props.suggestions.length === 0) {
    return props.suggestions.length > 0
      ? [{
          key: 'all',
          categoryLabel: 'All Items',
          items: props.suggestions
        }]
      : []
  }
  
  const grouped: Record<string, GroupedMatch> = {}
  props.suggestions.forEach((item) => {
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

// Modal functions
const openModal = () => {
  tempSelectedItems.value = [...selectedItems.value]
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  tempSelectedItems.value = []
}

const cancelSelection = () => {
  closeModal()
}

const applySelection = () => {
  selectedItems.value = [...tempSelectedItems.value]
  closeModal()
}

const isItemSelected = (item: SuggestionItem): boolean => {
  return tempSelectedItems.value.some(selected => selected.name === item.name)
}

const toggleItem = (item: SuggestionItem, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    if (!tempSelectedItems.value.some(selected => selected.name === item.name)) {
      tempSelectedItems.value = [...tempSelectedItems.value, item]
    }
  } else {
    tempSelectedItems.value = tempSelectedItems.value.filter(selected => selected.name !== item.name)
  }
}

const isCategorySelected = (group: GroupedMatch): boolean => {
  return group.items.every(item => isItemSelected(item))
}

const isCategoryIndeterminate = (group: GroupedMatch): boolean => {
  const selectedCount = group.items.filter(item => isItemSelected(item)).length
  return selectedCount > 0 && selectedCount < group.items.length
}

const toggleCategory = (group: GroupedMatch, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    // Add all items from this category that aren't already selected
    const newItems = group.items.filter(item => 
      !tempSelectedItems.value.some(selected => selected.name === item.name)
    )
    tempSelectedItems.value = [...tempSelectedItems.value, ...newItems]
  } else {
    // Remove all items from this category
    tempSelectedItems.value = tempSelectedItems.value.filter(
      selected => !group.items.some(item => item.name === selected.name)
    )
  }
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

.input-controls {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.suggestion-input-container {
  position: relative;
  flex: 1;
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

.btn-select-list {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-select-list:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 2px solid #e0f2fe;
}

.modal-header h3 {
  margin: 0;
  color: #667eea;
  font-size: 1.5em;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2em;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #fee2e2;
  color: #ef4444;
  transform: rotate(90deg);
}

.modal-body {
  padding: 20px 25px;
  overflow-y: auto;
  flex: 1;
}

.hierarchy-tree {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-group {
  background: #f8fafc;
  border-radius: 10px;
  padding: 15px;
  border: 2px solid #e0f2fe;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0f2fe;
}

.category-header input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.category-header label {
  font-size: 1.1em;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  margin: 0;
}

.category-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  padding-left: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.checkbox-item:hover {
  background: #e0f2fe;
  border-color: #667eea;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
  flex-shrink: 0;
}

.checkbox-item label {
  cursor: pointer;
  margin: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.95em;
  color: #334155;
}

.no-suggestions {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  font-size: 1.1em;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 25px;
  border-top: 2px solid #e0f2fe;
}

.btn-cancel,
.btn-apply {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.btn-apply {
  background: #10b981;
  color: white;
}

.btn-apply:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .input-controls {
    flex-direction: column;
  }

  .btn-select-list {
    width: 100%;
  }

  .category-items {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-width: 95%;
  }
}
</style>
