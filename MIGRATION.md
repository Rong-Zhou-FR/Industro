# Safety Data Migration Guide

## Overview

This document describes the ongoing migration of hardcoded safety data in the Industro application to JSON-based, bilingual data files.

## Completed Work

### 1. Data Files Created
- ✅ `/public/data/pictograms.json` - Maps pictogram IDs to image filenames
- ✅ `/public/data/dangers.json` - Danger definitions with EN/FR translations
- ✅ `/public/data/protective-equipments.json` - PPE/CPE definitions with EN/FR translations

### 2. Composable Created
- ✅ `/app/composables/useSafetyData.ts` - Composable for loading and accessing safety data

### 3. Markdown Support Added
- ✅ Description field in consignment page
- ✅ Risk analysis field in consignment page (was already there)
- ✅ Instruction fields in consignment steps

### 4. Code Quality
- ✅ All ESLint errors fixed
- ✅ Application builds successfully

## Migration Path

### Phase 1: Foundation (Completed)
- [x] Extract hardcoded data to JSON files
- [x] Create composable for data access
- [x] Add markdown support to free text fields

### Phase 2: Consignment Page Refactor (In Progress)
The consignment.vue file is 2000+ lines with complex state management. To minimize risk, the refactor should be done in steps:

#### Step 2.1: Load JSON Data Alongside Existing Code
- [ ] Import useSafetyData composable
- [ ] Load JSON data on mount
- [ ] Keep existing hardcoded data for now
- [ ] Add toggle or feature flag to switch between data sources

#### Step 2.2: Migrate Data Usage
- [ ] Replace epiEpcSuggestions with JSON-loaded data
- [ ] Replace dangerSuggestions with JSON-loaded data
- [ ] Replace pictogramMap logic with JSON-based lookups
- [ ] Add locale-aware label getters

#### Step 2.3: Variable Renaming (English)
- [ ] Rename epiEpc → ppeCPE (25+ instances)
- [ ] Rename epiEpcQuery → ppeCPEQuery
- [ ] Rename showEpiEpcSuggestions → showPPECPESuggestions
- [ ] Rename handleEpiEpcInput → handlePPECPEInput
- [ ] Rename addEpiEpc → addPPECPE
- [ ] Rename removeEpiEpc → removePPECPE
- [ ] Rename getEpiEpcPictogram → getPPECPEPictogram
- [ ] Update all French function/variable names to English

### Phase 3: Spec Sheet Enhancement
- [ ] Add PPE/CPE suggestion logic (copy from consignment)
- [ ] Add danger suggestion logic
- [ ] Integrate with JSON data files
- [ ] Add markdown support to relevant fields

## Data Structure Reference

### Dangers JSON
```json
{
  "dangers": [
    {
      "id": "electricalVoltage",
      "en": "Electrical voltage",
      "fr": "Tension électrique",
      "color": "tension-electrique",
      "requiresValue": true,
      "unit": "V",
      "pictogram": "electricity"
    }
  ]
}
```

### Protective Equipments JSON
```json
{
  "ppe": {
    "electrical": [
      {
        "id": "insulatingHelmet",
        "en": "Insulating helmet",
        "fr": "Casque isolant",
        "pictogram": "helmet"
      }
    ]
  },
  "cpe": { /* similar structure */ }
}
```

### Pictograms JSON
```json
{
  "obligations": {
    "helmet": "OBLIGATION-casque.jpg"
  },
  "dangers": {
    "electricity": "DANGER-electricite.jpg"
  }
}
```

## Usage Example

```typescript
import { useSafetyData } from '~/composables/useSafetyData'

const { loadData, getDangerLabel, getProtectiveEquipmentLabel, getPictogramPath } = useSafetyData()

// Load data on mount
onMounted(async () => {
  await loadData()
})

// Get localized labels
const dangerLabel = getDangerLabel('electricalVoltage') // "Electrical voltage" or "Tension électrique"
const equipmentLabel = getProtectiveEquipmentLabel('insulatingHelmet') // "Insulating helmet" or "Casque isolant"

// Get pictogram path
const pictoPath = getPictogramPath('dangers', 'electricity') // "/resources/Pictogrammes_jpeg/AVERTISSEMENT_DANGER/DANGER-electricite.jpg"
```

## Testing Strategy

1. **Unit Tests** (Recommended)
   - Test composable functions
   - Test data loading
   - Test locale switching

2. **Integration Tests**
   - Test suggestion dropdowns
   - Test pictogram display
   - Test locale-aware labels

3. **Manual Testing**
   - Test existing functionality still works
   - Test bilingual switching
   - Test PDF generation with new data

## Rollback Plan

If issues arise during migration:
1. Keep old hardcoded data commented out for quick rollback
2. Use feature flags to toggle between old and new data sources
3. Have comprehensive test coverage before removing old code

## Benefits

- **Maintainability**: Data separated from code
- **Internationalization**: Easy to add new languages
- **Scalability**: Easy to add new dangers/equipment
- **Consistency**: Single source of truth for all pages
