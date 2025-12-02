<template>
  <div class="consignment-page">
    <div class="container">
      <header>
        <LanguageSwitcher />
        <NuxtLink to="/" class="back-btn">{{ translate('common.backToHome') }}</NuxtLink>
        <h1>{{ translate('consignment.title') }}</h1>
        <p class="subtitle">{{ translate('consignment.subtitle') }}</p>
      </header>

      <!-- Informations sur l'intervention -->
      <section class="card info-section">
        <h2>{{ translate('consignment.interventionInfo') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="titre">{{ translate('consignment.fields.title') }}</label>
            <input id="titre" v-model="data.info.titre" type="text" class="form-control" :placeholder="translate('consignment.fields.titlePlaceholder')">
          </div>
          <div class="form-group full-width">
            <label for="description">{{ translate('consignment.fields.description') }}</label>
            <textarea id="description" v-model="data.info.description" class="form-control" rows="3" :placeholder="translate('consignment.fields.descriptionPlaceholder')"/>
          </div>
          <div class="form-group">
            <label for="date">{{ translate('consignment.fields.date') }}</label>
            <input id="date" v-model="data.info.date" type="date" class="form-control">
          </div>
          <div class="form-group">
            <label for="numero">{{ translate('consignment.fields.number') }}</label>
            <input id="numero" v-model="data.info.numero" type="text" class="form-control" :placeholder="translate('consignment.fields.numberPlaceholder')">
          </div>
          <div class="form-group">
            <label for="personnel">{{ translate('consignment.fields.personnel') }}</label>
            <input id="personnel" v-model="data.info.personnel" type="text" class="form-control" :placeholder="translate('consignment.fields.personnelPlaceholder')">
          </div>
          <div class="form-group">
            <label for="localisation">{{ translate('consignment.fields.location') }}</label>
            <input id="localisation" v-model="data.info.localisation" type="text" class="form-control" :placeholder="translate('consignment.fields.locationPlaceholder')">
          </div>
          <div class="form-group full-width">
            <label>{{ translate('consignment.fields.epiEpc') }}</label>
            <div class="epi-epc-input-container">
              <input
                v-model="epiEpcQuery"
                type="text"
                class="form-control"
                :placeholder="translate('consignment.fields.epiEpcPlaceholder')"
                @input="handleEpiEpcInput"
                @keydown.enter.prevent="addCustomEpiEpc"
                @keydown.escape="hideSuggestions"
              >
              <div v-if="showEpiEpcSuggestions" class="suggestions-dropdown">
                <template v-for="(group, key) in groupedEpiEpcMatches" :key="key">
                  <div class="suggestion-category">{{ group.type }} - {{ group.category }}</div>
                  <div
                    v-for="item in group.items"
                    :key="item"
                    class="suggestion-item"
                    @click="addEpiEpc(item, group.type, group.category)"
                  >
                    <span class="suggestion-name">{{ item }}</span>
                    <div class="suggestion-badges">
                      <span :class="['badge', `badge-${group.type.toLowerCase()}`]">{{ group.type }}</span>
                      <span :class="['badge', `badge-${group.category}`]">{{ group.category }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="epi-epc-list">
              <div v-for="(item, index) in data.epiEpc" :key="index" class="epi-epc-tag">
                <span class="tag-name">{{ item.name }}</span>
                <div class="suggestion-badges">
                  <span :class="['badge', `badge-${item.type.toLowerCase()}`]">{{ item.type }}</span>
                  <span :class="['badge', `badge-${item.category}`]">{{ item.category }}</span>
                </div>
                <span class="tag-remove" @click="removeEpiEpc(index)">×</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Avertissement -->
      <section class="card warning-section">
        <h2>{{ translate('consignment.warnings') }}</h2>
        <div class="warning-content">
          <div class="danger-box">
            <h3>{{ translate('consignment.danger') }}</h3>
            <div class="danger-input-container">
              <input
                v-model="dangerQuery"
                type="text"
                class="form-control"
                :placeholder="translate('consignment.fields.dangerPlaceholder')"
                @input="handleDangerInput"
                @keydown.enter.prevent="addCustomDanger"
                @keydown.escape="hideDangerSuggestions"
              >
              <div v-if="showDangerSuggestions" class="suggestions-dropdown">
                <div
                  v-for="danger in dangerMatches"
                  :key="danger.name"
                  class="suggestion-item"
                  @click="selectDanger(danger)"
                >
                  <span class="suggestion-name">{{ danger.name }}</span>
                </div>
              </div>
            </div>
            <div class="danger-list">
              <div v-for="(danger, index) in data.warnings.dangers" :key="index" :class="['danger-tag', danger.color]">
                <span class="danger-tag-name">{{ danger.name }}</span>
                <span v-if="danger.value" class="danger-tag-value">{{ danger.value }}</span>
                <button class="danger-tag-remove" @click="removeDanger(index)">×</button>
              </div>
            </div>
          </div>
          <div class="risk-box">
            <h3>{{ translate('consignment.riskAnalysis') }}</h3>
            <textarea
              v-model="data.warnings.analyseRisques"
              class="form-control markdown-support"
              rows="10"
              :placeholder="translate('consignment.fields.riskAnalysisPlaceholder')"
            />
            <div v-if="analyseRisquesPreview" class="markdown-preview" v-html="analyseRisquesPreview"/>
          </div>
        </div>
      </section>

      <!-- Matériel nécessaire -->
      <section class="card material-section">
        <h2>{{ translate('consignment.requiredMaterial') }}</h2>
        <div class="material-input-group">
          <input v-model="newMaterial.designation" type="text" class="form-control" :placeholder="translate('consignment.fields.designationPlaceholder')" @keypress.enter="addMaterial">
          <input v-model.number="newMaterial.quantity" type="number" class="form-control" :placeholder="translate('consignment.fields.quantityPlaceholder')" min="1">
          <input v-model.number="newMaterial.price" type="number" class="form-control" :placeholder="`${translate('consignment.fields.unitPrice')} (€)`" min="0" step="0.01">
          <button class="btn btn-primary" @click="addMaterial">{{ translate('consignment.fields.add') }}</button>
        </div>
        <div class="material-table">
          <div class="material-table-header">
            <div>{{ translate('consignment.fields.designation') }}</div>
            <div>{{ translate('consignment.fields.quantity') }}</div>
            <div>{{ translate('consignment.fields.unitPrice') }}</div>
            <div>{{ translate('consignment.fields.total') }}</div>
            <div>{{ translate('consignment.fields.actions') }}</div>
          </div>
          <div class="material-table-body">
            <div v-for="(material, index) in data.materials" :key="index" class="material-row">
              <div>{{ material.designation }}</div>
              <div>{{ material.quantity }}</div>
              <div>{{ material.price.toFixed(2) }} €</div>
              <div>{{ (material.quantity * material.price).toFixed(2) }} €</div>
              <div>
                <button class="btn btn-danger btn-small" @click="removeMaterial(index)">{{ translate('consignment.fields.remove') }}</button>
              </div>
            </div>
          </div>
          <div class="material-table-footer">
            <div/>
            <div/>
            <div><strong>{{ translate('consignment.fields.totalLabel') }}:</strong></div>
            <div><strong>{{ materialTotal.toFixed(2) }} €</strong></div>
            <div/>
          </div>
        </div>
      </section>

      <!-- Liste de Références -->
      <section class="card references-section">
        <h2>{{ translate('consignment.references') }}</h2>
        <div class="reference-controls">
          <div class="reference-input-group">
            <input v-model="newReference.document" type="text" class="form-control" :placeholder="translate('consignment.fields.document')" @keypress.enter="addReference">
            <input v-model="newReference.page" type="text" class="form-control" :placeholder="translate('consignment.fields.page')">
            <select v-model="newReference.type" class="form-control">
              <option value="">{{ translate('consignment.fields.selectType') }}</option>
              <option value="Instructions, notes, guides">{{ translate('consignment.fields.typeInstructions') }}</option>
              <option value="Dossier technique">{{ translate('consignment.fields.typeTechnical') }}</option>
              <option value="Règlement intérieur">{{ translate('consignment.fields.typeInternal') }}</option>
              <option value="Normes nationales">{{ translate('consignment.fields.typeNational') }}</option>
              <option value="Normes internationales">{{ translate('consignment.fields.typeInternational') }}</option>
            </select>
            <button class="btn btn-primary" @click="addReference">{{ translate('consignment.fields.add') }}</button>
          </div>
          <button class="btn btn-secondary" @click="sortReferences">{{ translate('consignment.fields.sortAZ') }}</button>
        </div>
        <div class="reference-table">
          <div class="reference-table-header">
            <div>{{ translate('consignment.fields.document') }}</div>
            <div>{{ translate('consignment.fields.page') }}</div>
            <div>{{ translate('consignment.fields.type') }}</div>
            <div>{{ translate('consignment.fields.actions') }}</div>
          </div>
          <div class="reference-table-body">
            <div v-for="(reference, index) in data.references" :key="index" class="reference-row">
              <div>{{ reference.document }}</div>
              <div>{{ reference.page || '-' }}</div>
              <div>{{ reference.type }}</div>
              <div>
                <button class="btn btn-danger btn-small" @click="removeReference(index)">{{ translate('consignment.fields.remove') }}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Instructions de consignation -->
      <section class="card instructions-section">
        <h2>{{ translate('consignment.consignmentInstructions') }}</h2>
        <div class="instructions-controls">
          <button class="btn btn-primary" @click="addStep">{{ translate('consignment.fields.addStep') }}</button>
        </div>
        <div class="instructions-table">
          <div class="table-header">
            <div class="col-repere">{{ translate('consignment.fields.reference') }}</div>
            <div class="col-instruction">{{ translate('consignment.fields.instruction') }}</div>
            <div class="col-photo">{{ translate('consignment.fields.photoLabel') }}</div>
          </div>
          <div class="table-body">
            <div v-for="(step, index) in data.steps" :key="step.id" class="step-row">
              <div class="col-repere">
                <input v-model="step.repere" type="text" :placeholder="`Repère ${index + 1}`">
              </div>
              <div class="col-instruction">
                <textarea v-model="step.instruction" :placeholder="translate('consignment.fields.instructionPlaceholder')"/>
              </div>
              <div class="col-photo">
                <div class="photo-upload">
                  <img v-if="step.photo && step.photo.startsWith('data:image/')" :src="step.photo" class="photo-preview" alt="Photo">
                  <label class="photo-label">
                    {{ translate('consignment.fields.photo') }} {{ step.photo && step.photo.startsWith('data:image/') ? translate('consignment.fields.changePhoto') : translate('consignment.fields.addPhoto') }} photo
                    <input type="file" accept="image/*" style="display: none;" @change="handlePhotoUpload($event, step.id)">
                  </label>
                </div>
              </div>
              <div class="step-actions">
                <div class="step-reorder-buttons">
                  <button class="btn btn-secondary btn-small btn-reorder" :disabled="index === 0" @click="moveStep(index, -1)">⬆️</button>
                  <button class="btn btn-secondary btn-small btn-reorder" :disabled="index === data.steps.length - 1" @click="moveStep(index, 1)">⬇️</button>
                </div>
                <button class="btn btn-danger btn-small" @click="removeStep(step.id)">🗑️ {{ translate('consignment.fields.removeStep') }}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pistes d'amélioration -->
      <section class="card improvement-section">
        <h2>{{ translate('consignment.improvements') }}</h2>
        <div class="improvement-input-group">
          <input v-model="newImprovement" type="text" class="form-control" :placeholder="translate('consignment.fields.suggestionPlaceholder')" @keypress.enter="addImprovement">
          <button class="btn btn-primary" @click="addImprovement">{{ translate('consignment.fields.add') }}</button>
        </div>
        <ul class="improvement-list">
          <li v-for="(improvement, index) in data.improvements" :key="index">
            <span>{{ improvement }}</span>
            <button class="btn btn-danger btn-small" @click="removeImprovement(index)">{{ translate('consignment.fields.remove') }}</button>
          </li>
        </ul>
      </section>

      <!-- Actions -->
      <div class="actions">
        <button class="btn btn-success" @click="saveToFile">{{ translate('consignment.save') }}</button>
        <button class="btn btn-info" @click="loadFromFile">{{ translate('consignment.load') }}</button>
        <button class="btn btn-secondary" @click="printPage">{{ translate('consignment.print') }}</button>
        <button class="btn btn-danger" @click="clearAll">{{ translate('consignment.clearAll') }}</button>
      </div>

      <footer>
        <p>{{ translate('consignment.footer') }}</p>
      </footer>
    </div>

    <!-- Notification -->
    <div v-if="notification" :class="['notification', notification.type]" :style="{ animation: 'slideIn 0.3s ease-out' }">
      {{ notification.message }}
    </div>

    <!-- Hidden file input for loading -->
    <input ref="fileInput" type="file" accept=".json" style="display: none;" @change="handleFileLoad">
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import { useI18n } from 'vue-i18n'

const { t: translate } = useI18n()

// Configure marked for security
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true
  })
  marked.use({
    useNewRenderer: true,
    renderer: {
      html() {
        return ''
      }
    }
  })
}

// Reactive data
const data = reactive({
  info: {
    titre: '',
    description: '',
    date: '',
    numero: '',
    personnel: '',
    localisation: ''
  },
  warnings: {
    dangers: [],
    analyseRisques: ''
  },
  materials: [],
  epiEpc: [],
  references: [],
  steps: [],
  improvements: []
})

// Input helpers
const epiEpcQuery = ref('')
const showEpiEpcSuggestions = ref(false)
const dangerQuery = ref('')
const showDangerSuggestions = ref(false)
const newMaterial = reactive({ designation: '', quantity: 1, price: 0 })
const newReference = reactive({ document: '', page: '', type: '' })
const newImprovement = ref('')
const notification = ref(null)
const fileInput = ref(null)

// Step counter for unique IDs
let stepCounter = 0

// EPI/EPC Suggestions
const epiEpcSuggestions = {
  'EPI': {
    'électrique': [
      'Casque isolant', 'Lunettes isolantes', 'Gants isolants',
      'Écran facial isolant', 'Vêtements isolants', 'Chaussures isolantes'
    ],
    'mécanique': [
      'Casque de chantier', 'Lunettes de protection', 'Gants anti-coupure',
      'Protections auditives', 'Masque respiratoire', 'Harnais de sécurité'
    ],
    'commun': [
      'Chaussures de sécurité', 'Gilet haute visibilité',
      'Vêtements de travail', 'Gants de manutention'
    ]
  },
  'EPC': {
    'électrique': [
      'Appareil de test VAT', 'Tapis isolant', 'Nappe isolante',
      'Cadenas de consignation électrique', 'Dispositif de mise à la terre', 'Pancarte de consignation'
    ],
    'mécanique': [
      'Protecteur de machine', 'Garde-corps', 'Filet de sécurité',
      'Barrières de protection', 'Barre de consignation'
    ],
    'commun': [
      'Serrure de consignation', 'Barrières de sécurité', 'Signalisation de sécurité',
      'Extincteur', 'Trousse de premiers secours', 'Éclairage de sécurité'
    ]
  }
}

// Danger Suggestions
const dangerSuggestions = [
  { name: 'Tension électrique', color: 'tension-electrique', requiresValue: true, unit: 'V', pictogram: 'DANGER-electricite.jpg' },
  { name: 'Air comprimé', color: 'air-comprime', requiresValue: true, unit: 'bar', pictogram: 'DANGER-general.jpg' },
  { name: 'Pression hydraulique', color: 'pression-hydraulique', requiresValue: true, unit: 'bar', pictogram: 'DANGER-general.jpg' },
  { name: 'Instabilité mécanique', color: 'instabilite-mecanique', requiresValue: false, pictogram: 'DANGER-general.jpg' },
  { name: 'Travail en hauteur', color: 'hauteur', requiresValue: true, unit: 'm', pictogram: 'DANGER-chute.jpg' },
  { name: 'Risque d\'électrocution', color: 'tension-electrique', requiresValue: false, pictogram: 'DANGER-electricite.jpg' },
  { name: 'Risque de chute', color: 'hauteur', requiresValue: false, pictogram: 'DANGER-chute.jpg' },
  { name: 'Projection de particules', color: 'instabilite-mecanique', requiresValue: false, pictogram: 'DANGER-general.jpg' },
  { name: 'Écrasement', color: 'instabilite-mecanique', requiresValue: false, pictogram: 'DANGER-charge-suspendue.jpg' },
  { name: 'Coupure', color: 'instabilite-mecanique', requiresValue: false, pictogram: 'DANGER-general.jpg' },
  { name: 'Température élevée', color: 'autre', requiresValue: true, unit: '°C', pictogram: 'DANGER-general.jpg' },
  { name: 'Produit chimique', color: 'autre', requiresValue: false, pictogram: 'DANGER-produit-nocif.jpg' },
  { name: 'Rayonnement', color: 'autre', requiresValue: false, pictogram: 'DANGER-radiations-non-ionisantes.jpg' },
  { name: 'Bruit excessif', color: 'autre', requiresValue: true, unit: 'dB', pictogram: 'DANGER-general.jpg' },
  { name: 'Espace confiné', color: 'autre', requiresValue: false, pictogram: 'DANGER-general.jpg' },
  { name: 'Atmosphère explosive', color: 'autre', requiresValue: false, pictogram: 'DANGER-atmosphere-explosive.jpg' },
  { name: 'Froid / Gel', color: 'autre', requiresValue: true, unit: '°C', pictogram: 'DANGER-froid-gel.jpg' },
  { name: 'Charge suspendue', color: 'instabilite-mecanique', requiresValue: false, pictogram: 'DANGER-charge-suspendue.jpg' },
  { name: 'Chariot élévateur', color: 'instabilite-mecanique', requiresValue: false, pictogram: 'DANGER-chariot.jpg' },
  { name: 'Laser', color: 'autre', requiresValue: false, pictogram: 'DANGER-laser.jpg' },
  { name: 'Produit corrosif', color: 'autre', requiresValue: false, pictogram: 'DANGER-produit-corrosif.jpg' },
  { name: 'Produit explosif', color: 'autre', requiresValue: false, pictogram: 'DANGER-produit-explosif.jpg' },
  { name: 'Produit inflammable', color: 'autre', requiresValue: false, pictogram: 'DANGER-produit-inflammable.jpg' },
  { name: 'Produit toxique', color: 'autre', requiresValue: false, pictogram: 'DANGER-produit-toxique.jpg' },
  { name: 'Risque biologique', color: 'autre', requiresValue: false, pictogram: 'DANGER-risque-biologique.jpg' },
  { name: 'Radioactivité', color: 'autre', requiresValue: false, pictogram: 'DANGER-radioactivite.jpg' },
  { name: 'Champ magnétique', color: 'autre', requiresValue: false, pictogram: 'DANGER-champ-magnetique.jpg' },
  { name: 'Trébuchement', color: 'hauteur', requiresValue: false, pictogram: 'DANGER-trebuchement.jpg' }
]

// Helper function to get EPI/EPC pictogram filename
const getEpiEpcPictogram = (name) => {
  const lowerName = name.toLowerCase()
  const pictogramMap = {
    'casque': 'OBLIGATION-casque.jpg',
    'casque isolant': 'OBLIGATION-casque.jpg',
    'casque de chantier': 'OBLIGATION-casque.jpg',
    'casque antibruit': 'OBLIGATION-casque-antibruit.jpg',
    'protections auditives': 'OBLIGATION-casque-antibruit.jpg',
    'lunettes': 'OBLIGATION-lunettes.jpg',
    'lunettes isolantes': 'OBLIGATION-lunettes.jpg',
    'lunettes de protection': 'OBLIGATION-lunettes.jpg',
    'gants': 'OBLIGATION-gants.jpg',
    'gants isolants': 'OBLIGATION-gants.jpg',
    'gants anti-coupure': 'OBLIGATION-gants.jpg',
    'gants de manutention': 'OBLIGATION-gants.jpg',
    'chaussures': 'OBLIGATION-chaussures.jpg',
    'chaussures de sécurité': 'OBLIGATION-chaussures.jpg',
    'chaussures isolantes': 'OBLIGATION-chaussures.jpg',
    'harnais': 'OBLIGATION-harnais.jpg',
    'harnais de sécurité': 'OBLIGATION-harnais.jpg',
    'visière': 'OBLIGATION-visiere.jpg',
    'écran facial': 'OBLIGATION-visiere.jpg',
    'écran facial isolant': 'OBLIGATION-visiere.jpg',
    'masque': 'OBLIGATION-protection-voies-espiratoires.jpg',
    'masque respiratoire': 'OBLIGATION-protection-voies-espiratoires.jpg',
    'combinaison': 'OBLIGATION-combinaison.jpg',
    'vêtements isolants': 'OBLIGATION-combinaison.jpg',
    'vêtements de travail': 'OBLIGATION-combinaison.jpg',
    'gilet': 'OBLIGATION-general.jpg',
    'gilet haute visibilité': 'OBLIGATION-general.jpg'
  }

  // Try exact match first
  if (pictogramMap[lowerName])
    return pictogramMap[lowerName]

  // Try partial match
  for (const [key, value] of Object.entries(pictogramMap)) {
    if (lowerName.includes(key) || key.includes(lowerName))
      return value
  }

  return 'OBLIGATION-general.jpg'
}

// Helper function to get danger pictogram filename
const getDangerPictogram = (dangerName) => {
  const suggestion = dangerSuggestions.find(d => d.name === dangerName)
  if (suggestion && suggestion.pictogram)
    return suggestion.pictogram
  return 'DANGER-general.jpg'
}

// Helper function to load image as base64
const loadImageAsBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function () {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = this.naturalWidth
        canvas.height = this.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(this, 0, 0)
        const base64 = canvas.toDataURL('image/jpeg')
        resolve(base64)
      }
      catch (e) {
        reject(e)
      }
    }
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

// Preload all needed pictograms for PDF
const preloadPictograms = async () => {
  const pictograms = {}

  // Collect all unique pictograms needed
  const obligationPictograms = new Set()
  const dangerPictograms = new Set()

  // EPI/EPC pictograms
  if (data.epiEpc) {
    data.epiEpc.forEach((item) => {
      const picto = getEpiEpcPictogram(item.name)
      obligationPictograms.add(picto)
    })
  }

  // Danger pictograms
  if (data.warnings.dangers) {
    data.warnings.dangers.forEach((danger) => {
      const picto = getDangerPictogram(danger.name)
      dangerPictograms.add(picto)
    })
  }

  // Load obligation pictograms
  for (const picto of obligationPictograms) {
    try {
      const base64 = await loadImageAsBase64(`/resources/Pictogrammes_jpeg/OBLIGATION/${picto}`)
      pictograms[`OBLIGATION/${picto}`] = base64
    }
    catch (e) {
      console.warn(`Could not load pictogram: ${picto}`)
    }
  }

  // Load danger pictograms
  for (const picto of dangerPictograms) {
    try {
      const base64 = await loadImageAsBase64(`/resources/Pictogrammes_jpeg/AVERTISSEMENT_DANGER/${picto}`)
      pictograms[`DANGER/${picto}`] = base64
    }
    catch (e) {
      console.warn(`Could not load pictogram: ${picto}`)
    }
  }

  return pictograms
}

// Computed properties
const epiEpcMatches = computed(() => {
  const query = epiEpcQuery.value.toLowerCase().trim()
  if (query.length < 2)
    return []

  const matches = []
  Object.entries(epiEpcSuggestions).forEach(([type, categories]) => {
    Object.entries(categories).forEach(([category, items]) => {
      items.forEach((item) => {
        if (item.toLowerCase().includes(query)) {
          matches.push({ type, category, name: item })
        }
      })
    })
  })
  return matches
})

const groupedEpiEpcMatches = computed(() => {
  const grouped = {}
  epiEpcMatches.value.forEach((match) => {
    const key = `${match.type}-${match.category}`
    if (!grouped[key]) {
      grouped[key] = { type: match.type, category: match.category, items: [] }
    }
    grouped[key].items.push(match.name)
  })
  return grouped
})

const dangerMatches = computed(() => {
  const query = dangerQuery.value.toLowerCase().trim()
  if (query.length < 2)
    return []
  return dangerSuggestions.filter(d => d.name.toLowerCase().includes(query))
})

const materialTotal = computed(() => {
  return data.materials.reduce((sum, m) => sum + (m.quantity * m.price), 0)
})

const analyseRisquesPreview = computed(() => {
  if (!data.warnings.analyseRisques.trim())
    return ''
  try {
    return marked.parse(data.warnings.analyseRisques)
  }
  catch {
    return data.warnings.analyseRisques
  }
})

// Watch for changes to persist to localStorage
watch(data, () => {
  saveToStorage()
}, { deep: true })

// Methods
const handleEpiEpcInput = () => {
  showEpiEpcSuggestions.value = epiEpcMatches.value.length > 0
}

const hideSuggestions = () => {
  showEpiEpcSuggestions.value = false
}

const addEpiEpc = (name, type, category) => {
  if (data.epiEpc.some(item => item.name === name)) {
    showNotification('⚠️ Cet équipement est déjà dans la liste', 'info')
    return
  }
  data.epiEpc.push({ name, type, category })
  epiEpcQuery.value = ''
  hideSuggestions()
}

const addCustomEpiEpc = () => {
  const customValue = epiEpcQuery.value.trim()
  if (customValue) {
    addEpiEpc(customValue, 'Personnalisé', 'personnalisé')
  }
}

const removeEpiEpc = (index) => {
  data.epiEpc.splice(index, 1)
}

const handleDangerInput = () => {
  showDangerSuggestions.value = dangerMatches.value.length > 0
}

const hideDangerSuggestions = () => {
  showDangerSuggestions.value = false
}

const selectDanger = (danger) => {
  if (danger.requiresValue) {
    const value = prompt(`Valeur pour "${danger.name}" (${danger.unit}):`)
    addDanger(danger.name, danger.color, value ? `${value} ${danger.unit}` : null)
  }
  else {
    addDanger(danger.name, danger.color, null)
  }
  dangerQuery.value = ''
  hideDangerSuggestions()
}

const addDanger = (name, color, value) => {
  if (data.warnings.dangers.some(d => d.name === name && d.value === value)) {
    showNotification('⚠️ Ce danger est déjà dans la liste', 'info')
    return
  }
  data.warnings.dangers.push({ name, color, value })
}

const addCustomDanger = () => {
  const customValue = dangerQuery.value.trim()
  if (customValue) {
    addDanger(customValue, 'autre', null)
    dangerQuery.value = ''
    hideDangerSuggestions()
  }
}

const removeDanger = (index) => {
  data.warnings.dangers.splice(index, 1)
}

const addMaterial = () => {
  if (!newMaterial.designation.trim()) {
    showNotification('⚠️ Veuillez entrer une désignation', 'error')
    return
  }
  data.materials.push({
    designation: newMaterial.designation,
    quantity: newMaterial.quantity || 1,
    price: newMaterial.price || 0
  })
  newMaterial.designation = ''
  newMaterial.quantity = 1
  newMaterial.price = 0
}

const removeMaterial = (index) => {
  data.materials.splice(index, 1)
}

const addReference = () => {
  if (!newReference.document.trim()) {
    showNotification('⚠️ Veuillez entrer un nom de document', 'error')
    return
  }
  if (!newReference.type) {
    showNotification('⚠️ Veuillez sélectionner un type', 'error')
    return
  }
  data.references.push({
    document: newReference.document,
    page: newReference.page,
    type: newReference.type
  })
  newReference.document = ''
  newReference.page = ''
  newReference.type = ''
}

const removeReference = (index) => {
  data.references.splice(index, 1)
}

const sortReferences = () => {
  data.references.sort((a, b) => a.document.localeCompare(b.document, 'fr', { sensitivity: 'base' }))
  showNotification('✅ Références triées par ordre alphabétique', 'success')
}

const addStep = () => {
  const id = crypto.randomUUID ? crypto.randomUUID() : `step-${Date.now()}-${++stepCounter}`
  data.steps.push({ id, repere: '', instruction: '', photo: '' })
}

const removeStep = (id) => {
  const index = data.steps.findIndex(s => s.id === id)
  if (index > -1) {
    data.steps.splice(index, 1)
  }
}

const moveStep = (index, direction) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= data.steps.length)
    return
  const temp = data.steps[index]
  data.steps[index] = data.steps[newIndex]
  data.steps[newIndex] = temp
}

const handlePhotoUpload = (event, stepId) => {
  const file = event.target.files?.[0]
  if (!file || !file.type.startsWith('image/'))
    return

  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    showNotification('❌ La photo est trop grande. Taille maximale: 2MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const step = data.steps.find(s => s.id === stepId)
    if (step) {
      step.photo = e.target.result
    }
  }
  reader.readAsDataURL(file)
}

const addImprovement = () => {
  if (newImprovement.value.trim()) {
    data.improvements.push(newImprovement.value.trim())
    newImprovement.value = ''
  }
}

const removeImprovement = (index) => {
  data.improvements.splice(index, 1)
}

const saveToStorage = () => {
  try {
    localStorage.setItem('consignmentProcedure', JSON.stringify(data))
  }
  catch (e) {
    console.error('Error saving to storage:', e)
  }
}

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('consignmentProcedure')
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.assign(data.info, parsed.info || {})
      data.warnings.dangers = parsed.warnings?.dangers || []
      data.warnings.analyseRisques = parsed.warnings?.analyseRisques || ''
      data.materials = parsed.materials || []
      data.epiEpc = parsed.epiEpc || []
      data.references = parsed.references || []
      data.steps = parsed.steps || []
      data.improvements = parsed.improvements || []
    }
  }
  catch (e) {
    console.error('Error loading from storage:', e)
  }
}

const saveToFile = () => {
  const dataStr = JSON.stringify(data, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const sanitizedNumero = (data.info.numero || 'procedure').replace(/[^a-z0-9_]/gi, '_')
  link.download = `consignation-${sanitizedNumero}-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
  showNotification('✅ Procédure enregistrée avec succès!', 'success')
}

const loadFromFile = () => {
  fileInput.value?.click()
}

const handleFileLoad = (event) => {
  const file = event.target.files?.[0]
  if (!file)
    return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result)
      Object.assign(data.info, parsed.info || {})
      data.warnings.dangers = parsed.warnings?.dangers || []
      data.warnings.analyseRisques = parsed.warnings?.analyseRisques || ''
      data.materials = parsed.materials || []
      data.epiEpc = parsed.epiEpc || []
      data.references = parsed.references || []
      data.steps = parsed.steps || []
      data.improvements = parsed.improvements || []
      showNotification('✅ Procédure chargée avec succès!', 'success')
    }
    catch {
      showNotification('❌ Erreur lors du chargement du fichier', 'error')
    }
  }
  reader.readAsText(file)
}

const printPage = async () => {
  showNotification('📄 Génération du PDF en cours...', 'info')

  // Color maps for PDF generation
  const categoryColorMap = {
    'electrique': [234, 179, 8],
    'électrique': [234, 179, 8],
    'mecanique': [146, 64, 14],
    'mécanique': [146, 64, 14],
    'commun': [220, 38, 38],
    'personnalisé': [99, 102, 241]
  }

  const dangerColorMap = {
    'tension-electrique': [234, 179, 8],
    'air-comprime': [6, 182, 212],
    'pression-hydraulique': [139, 92, 246],
    'instabilite-mecanique': [249, 115, 22],
    'hauteur': [239, 68, 68],
    'autre': [100, 116, 139]
  }

  const defaultColor = [100, 116, 139]

  try {
    // Preload pictograms
    const pictograms = await preloadPictograms()

    // Dynamically import jsPDF
    const jsPDFModule = await import('jspdf')
    const { jsPDF } = jsPDFModule

    const doc = new jsPDF()

    // Use Times New Roman for formal appearance
    doc.setFont('times', 'normal')

    let y = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    const pictoSize = 8 // Size of pictogram in mm

    // Title - Black, formal
    doc.setFontSize(18)
    doc.setFont('times', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(translate('consignment.pdf.title'), pageWidth / 2, y, { align: 'center' })
    y += 10

    doc.setFontSize(10)
    doc.setFont('times', 'italic')
    doc.text(translate('consignment.pdf.subtitle'), pageWidth / 2, y, { align: 'center' })
    y += 15

    // Section: Informations sur l'intervention
    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(0, 51, 102) // Dark blue
    doc.text(translate('consignment.pdf.interventionInfo'), margin, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont('times', 'normal')
    doc.setTextColor(0, 0, 0)

    if (data.info.titre) {
      doc.setFont('times', 'bold')
      doc.text(`${translate('consignment.fields.title')} `, margin, y)
      doc.setFont('times', 'normal')
      doc.text(data.info.titre, margin + 20, y)
      y += 6
    }

    if (data.info.description) {
      doc.setFont('times', 'bold')
      doc.text(`${translate('consignment.fields.description')} `, margin, y)
      y += 6
      doc.setFont('times', 'normal')
      const descLines = doc.splitTextToSize(data.info.description, contentWidth - 20)
      doc.text(descLines, margin + 10, y)
      y += descLines.length * 5 + 2
    }

    if (data.info.date || data.info.numero || data.info.personnel || data.info.localisation) {
      const infoText = []
      if (data.info.date)
        infoText.push(`${translate('consignment.fields.date')} ${data.info.date}`)
      if (data.info.numero)
        infoText.push(`${translate('consignment.fields.number')} ${data.info.numero}`)
      if (data.info.personnel)
        infoText.push(`${translate('consignment.fields.personnel')} ${data.info.personnel}`)
      if (data.info.localisation)
        infoText.push(`${translate('consignment.fields.location')} ${data.info.localisation}`)
      doc.text(infoText.join(' | '), margin, y)
      y += 8
    }

    // EPI/EPC
    if (data.epiEpc && data.epiEpc.length > 0) {
      doc.setFont('times', 'bold')
      doc.text(`${translate('consignment.fields.epiEpc')} `, margin, y)
      y += 6
      doc.setFont('times', 'normal')

      data.epiEpc.forEach((item) => {
        // Try to add pictogram
        const pictoFile = getEpiEpcPictogram(item.name)
        const pictoKey = `OBLIGATION/${pictoFile}`
        if (pictograms[pictoKey]) {
          try {
            doc.addImage(pictograms[pictoKey], 'JPEG', margin + 5, y - 5, pictoSize, pictoSize)
          }
          catch (e) {
            console.warn('Failed to add pictogram:', e)
          }
        }

        const rgb = categoryColorMap[item.category.toLowerCase()] || defaultColor
        doc.setTextColor(rgb[0], rgb[1], rgb[2])
        doc.text(`${item.name} (${item.type} - ${item.category})`, margin + 5 + pictoSize + 3, y)
        doc.setTextColor(0, 0, 0)
        y += Math.max(pictoSize, 5) + 2

        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
      y += 3
    }

    y += 5

    // Section: Avertissements
    if (y > 250) {
      doc.addPage()
      y = 20
    }

    doc.setFontSize(12)
    doc.setFont('times', 'bold')
    doc.setTextColor(153, 0, 0) // Dark red
    doc.text(translate('consignment.pdf.warnings'), margin, y)
    y += 8

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)

    // Render dangers
    if (data.warnings.dangers && data.warnings.dangers.length > 0) {
      doc.setFont('times', 'bold')
      doc.text(translate('consignment.pdf.identifiedDangers'), margin, y)
      y += 6
      doc.setFont('times', 'normal')

      data.warnings.dangers.forEach((danger) => {
        // Try to add pictogram
        const pictoFile = getDangerPictogram(danger.name)
        const pictoKey = `DANGER/${pictoFile}`
        if (pictograms[pictoKey]) {
          try {
            doc.addImage(pictograms[pictoKey], 'JPEG', margin + 5, y - 5, pictoSize, pictoSize)
          }
          catch (e) {
            console.warn('Failed to add danger pictogram:', e)
          }
        }

        const rgb = dangerColorMap[danger.color] || defaultColor
        doc.setTextColor(rgb[0], rgb[1], rgb[2])
        doc.setFont('times', 'bold')

        const dangerText = danger.value ? `${danger.name}: ${danger.value}` : danger.name
        doc.text(dangerText, margin + 5 + pictoSize + 3, y)
        y += Math.max(pictoSize, 5) + 2

        doc.setTextColor(0, 0, 0)
        doc.setFont('times', 'normal')

        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
      y += 3
    }

    if (data.warnings.analyseRisques) {
      doc.setFont('times', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Analyse de risques:', margin, y)
      y += 6
      doc.setFont('times', 'normal')

      // Multi-level markdown to plain text conversion for PDF
      const lines = data.warnings.analyseRisques.split('\n')
      lines.forEach((line) => {
        const leadingSpaces = line.match(/^(\s*)/)[1].length
        const indentLevel = Math.floor(leadingSpaces / 2)
        const trimmed = line.trim()

        const baseIndent = margin + 5
        const levelIndent = indentLevel * 5
        const currentIndent = baseIndent + levelIndent

        // Use simple ASCII characters that render correctly in Times font
        const bulletChars = ['-', 'o', '*', '+', '>']
        const bullet = bulletChars[Math.min(indentLevel, bulletChars.length - 1)]

        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const content = trimmed.substring(1).trim()
          const cleanContent = content.replace(/\*\*(.*?)\*\*/g, '$1')
          const textLines = doc.splitTextToSize(cleanContent, contentWidth - 20 - levelIndent)
          doc.text(`${bullet} ${textLines[0]}`, currentIndent, y)
          y += 5
          for (let i = 1; i < textLines.length; i++) {
            doc.text(textLines[i], currentIndent + 4, y)
            y += 5
          }
        }
        else if (trimmed.match(/^\d+\./)) {
          const content = trimmed.replace(/^\d+\./, '').trim()
          const cleanContent = content.replace(/\*\*(.*?)\*\*/g, '$1')
          const number = trimmed.match(/^\d+\./)[0]
          const textLines = doc.splitTextToSize(cleanContent, contentWidth - 20 - levelIndent)
          doc.text(`${number} ${textLines[0]}`, currentIndent, y)
          y += 5
          for (let i = 1; i < textLines.length; i++) {
            doc.text(textLines[i], currentIndent + 6, y)
            y += 5
          }
        }
        else if (trimmed) {
          const cleanContent = trimmed.replace(/\*\*(.*?)\*\*/g, '$1')
          const textLines = doc.splitTextToSize(cleanContent, contentWidth - 20 - levelIndent)
          doc.text(textLines, currentIndent, y)
          y += textLines.length * 5 + 2
        }

        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
      y += 3
    }

    y += 5

    // Section: Matériel nécessaire
    if (data.materials && data.materials.length > 0) {
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(12)
      doc.setFont('times', 'bold')
      doc.setTextColor(0, 102, 51) // Dark green
      doc.text(translate('consignment.pdf.requiredMaterial'), margin, y)
      y += 8

      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)

      data.materials.forEach((material) => {
        doc.setFont('times', 'normal')
        const total = material.quantity * material.price
        doc.text(`${material.designation}`, margin, y)
        doc.text(`Qté: ${material.quantity}`, margin + 100, y)
        doc.text(`Prix: ${material.price.toFixed(2)} €`, margin + 130, y)
        doc.text(`Total: ${total.toFixed(2)} €`, margin + 160, y)
        y += 6
      })

      const grandTotal = data.materials.reduce((sum, m) => sum + (m.quantity * m.price), 0)
      doc.setFont('times', 'bold')
      doc.text(`Total général: ${grandTotal.toFixed(2)} €`, margin + 140, y)
      y += 10
    }

    // Section: Références
    if (data.references && data.references.length > 0) {
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(12)
      doc.setFont('times', 'bold')
      doc.setTextColor(102, 51, 153) // Purple
      doc.text(translate('consignment.pdf.references'), margin, y)
      y += 8

      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)
      doc.setFont('times', 'normal')

      data.references.forEach((ref) => {
        const refText = `${ref.document} - ${ref.page || 'N/A'} (${ref.type})`
        const refLines = doc.splitTextToSize(refText, contentWidth)
        doc.text(refLines, margin, y)
        y += refLines.length * 5 + 2

        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
      y += 5
    }

    // Section: Instructions de consignation
    if (data.steps && data.steps.length > 0) {
      if (y > 240) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(12)
      doc.setFont('times', 'bold')
      doc.setTextColor(102, 51, 153) // Purple
      doc.text(translate('consignment.pdf.instructions'), margin, y)
      y += 8

      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)

      data.steps.forEach((step, index) => {
        doc.setFont('times', 'bold')
        doc.text(`${index + 1}. ${step.repere || `${translate('consignment.pdf.step')} ${index + 1}`}`, margin, y)
        y += 6

        if (step.instruction) {
          doc.setFont('times', 'normal')
          const instrLines = doc.splitTextToSize(step.instruction, contentWidth - 10)
          doc.text(instrLines, margin + 5, y)
          y += instrLines.length * 5 + 3
        }

        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
      y += 5
    }

    // Section: Pistes d'amélioration
    if (data.improvements && data.improvements.length > 0) {
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(12)
      doc.setFont('times', 'bold')
      doc.setTextColor(204, 153, 0) // Orange
      doc.text('Pistes d\'amélioration', margin, y)
      y += 8

      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)
      doc.setFont('times', 'normal')

      data.improvements.forEach((improvement) => {
        doc.text(`• ${improvement}`, margin, y)
        y += 6

        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })
    }

    // Save the PDF
    const sanitizedNumero = (data.info.numero || 'procedure').replace(/[^a-z0-9_]/gi, '_')
    const filename = `Procedure-Consignation-${sanitizedNumero}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
    showNotification('✅ PDF généré avec succès!', 'success')
  }
  catch (error) {
    console.error('Erreur lors de la génération PDF:', error)
    showNotification('❌ Erreur lors de la génération du PDF, utilisation de l\'impression navigateur', 'error')
    // Fallback to browser print
    window.print()
  }
}

const clearAll = () => {
  if (confirm('⚠️ Êtes-vous sûr de vouloir effacer toutes les données? Cette action est irréversible.')) {
    Object.assign(data.info, { titre: '', description: '', date: '', numero: '', personnel: '', localisation: '' })
    data.warnings.dangers = []
    data.warnings.analyseRisques = ''
    data.materials = []
    data.epiEpc = []
    data.references = []
    data.steps = []
    data.improvements = []
    showNotification('🗑️ Toutes les données ont été effacées', 'info')
  }
}

const showNotification = (message, type = 'info') => {
  notification.value = { message, type }
  setTimeout(() => {
    notification.value = null
  }, 3000)
}

// Click outside handler for suggestions
const handleClickOutside = (e) => {
  if (!e.target.closest('.epi-epc-input-container')) {
    hideSuggestions()
  }
  if (!e.target.closest('.danger-input-container')) {
    hideDangerSuggestions()
  }
}

onMounted(() => {
  loadFromStorage()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.consignment-page {
  min-height: 100vh;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: #f0f9ff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Header */
header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 15px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  color: white;
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.95;
}

.back-btn {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  text-decoration: none;
  margin-bottom: 15px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Cards */
.card {
  background: #ffffff;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #2563eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card h2 {
  color: #2563eb;
  margin-bottom: 20px;
  font-size: 1.8em;
  border-bottom: 2px solid #e0f2fe;
  padding-bottom: 10px;
}

/* Section-specific colors */
.info-section {
  border-left-color: #06b6d4;
}

.info-section h2 {
  color: #06b6d4;
}

.warning-section {
  border-left-color: #ef4444;
  background: linear-gradient(to right, #fff5f5, #ffffff);
}

.warning-section h2 {
  color: #ef4444;
}

.material-section {
  border-left-color: #10b981;
}

.material-section h2 {
  color: #10b981;
}

.references-section,
.instructions-section {
  border-left-color: #7c3aed;
}

.references-section h2,
.instructions-section h2 {
  color: #7c3aed;
}

.improvement-section {
  border-left-color: #f59e0b;
}

.improvement-section h2 {
  color: #f59e0b;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #1e293b;
}

/* EPI/EPC */
.epi-epc-input-container {
  position: relative;
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

.badge-epi {
  background: #64748b;
}

.badge-epc {
  background: #475569;
}

.badge-personnalisé {
  background: #6366f1;
}

.badge-électrique,
.badge-electrique {
  background: #eab308;
}

.badge-mécanique,
.badge-mecanique {
  background: #92400e;
}

.badge-commun {
  background: #dc2626;
}

.epi-epc-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  min-height: 40px;
}

.epi-epc-tag {
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

/* Danger styles */
.warning-content {
  display: grid;
  gap: 20px;
}

.danger-box,
.risk-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #f59e0b;
}

.danger-box {
  border-color: #ef4444;
  background: #fef2f2;
}

.danger-box h3 {
  color: #ef4444;
  margin-bottom: 10px;
}

.risk-box {
  border-color: #f59e0b;
  background: #fffbeb;
}

.risk-box h3 {
  color: #f59e0b;
  margin-bottom: 10px;
}

.danger-input-container {
  position: relative;
  margin-bottom: 15px;
}

.danger-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
  min-height: 40px;
}

.danger-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  background: white;
  border: 2px solid #e5e7eb;
}

.danger-tag-name {
  font-weight: 500;
}

.danger-tag-value {
  font-weight: bold;
  color: #ef4444;
}

.danger-tag-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.1em;
  padding: 0 4px;
}

.danger-tag.tension-electrique {
  border-color: #eab308;
  background: #fef9c3;
}

.danger-tag.air-comprime {
  border-color: #06b6d4;
  background: #cffafe;
}

.danger-tag.pression-hydraulique {
  border-color: #8b5cf6;
  background: #ede9fe;
}

.danger-tag.instabilite-mecanique {
  border-color: #f97316;
  background: #ffedd5;
}

.danger-tag.hauteur {
  border-color: #ef4444;
  background: #fee2e2;
}

.danger-tag.autre {
  border-color: #64748b;
  background: #f1f5f9;
}

/* Markdown preview */
.markdown-support {
  font-family: 'Courier New', monospace;
}

.markdown-preview {
  margin-top: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.markdown-preview :deep(ul) {
  margin-left: 20px;
  list-style-type: disc;
}

.markdown-preview :deep(ol) {
  margin-left: 20px;
}

.markdown-preview :deep(strong) {
  font-weight: 600;
  color: #1e293b;
}

.markdown-preview :deep(li) {
  margin: 5px 0;
}

/* Material table */
.material-input-group {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr auto;
  gap: 10px;
  margin-bottom: 20px;
}

.material-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e0f2fe;
}

.material-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 120px;
  gap: 15px;
  background: #10b981;
  color: white;
  font-weight: 600;
  padding: 15px;
}

.material-table-body {
  min-height: 50px;
}

.material-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 120px;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #e0f2fe;
  align-items: center;
  transition: background-color 0.2s;
}

.material-row:hover {
  background: #e0f2fe;
}

.material-table-footer {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.5fr 120px;
  gap: 15px;
  padding: 15px;
  background: #f0fdf4;
  border-top: 2px solid #10b981;
}

/* Reference table */
.reference-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.reference-input-group {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr auto;
  gap: 10px;
}

.reference-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e0f2fe;
}

.reference-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 120px;
  gap: 15px;
  background: #7c3aed;
  color: white;
  font-weight: 600;
  padding: 15px;
}

.reference-row {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr 120px;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #e0f2fe;
  align-items: center;
  transition: background-color 0.2s;
}

.reference-row:hover {
  background: #e0f2fe;
}

/* Instructions table */
.instructions-controls {
  margin-bottom: 20px;
}

.instructions-table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e0f2fe;
}

.table-header {
  display: grid;
  grid-template-columns: 150px 1fr 200px;
  gap: 2px;
  background: #7c3aed;
  color: white;
  font-weight: 600;
  padding: 15px;
}

.table-body {
  display: grid;
  gap: 10px;
  padding: 15px;
}

.step-row {
  display: grid;
  grid-template-columns: 150px 1fr 200px;
  gap: 15px;
  padding: 15px;
  background: #e0f2fe;
  border-radius: 8px;
  align-items: start;
  transition: background-color 0.2s;
}

.step-row:hover {
  background: #e0e7ff;
}

.step-row input[type="text"],
.step-row textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95em;
}

.step-row textarea {
  resize: vertical;
  min-height: 80px;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.photo-preview {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e0f2fe;
}

.photo-label {
  display: inline-block;
  padding: 8px 12px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  font-size: 0.9em;
  transition: background-color 0.2s;
}

.photo-label:hover {
  background: #7c3aed;
}

.step-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-reorder-buttons {
  display: flex;
  gap: 5px;
}

.btn-reorder {
  padding: 6px 10px;
  font-size: 0.85em;
  min-width: auto;
}

/* Improvement list */
.improvement-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.improvement-input-group .form-control {
  flex: 1;
}

.improvement-list {
  list-style: none;
  display: grid;
  gap: 10px;
}

.improvement-list li {
  background: #e0f2fe;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.improvement-list li:hover {
  background: #bae6fd;
}

.improvement-list li::before {
  content: "💡";
  margin-right: 10px;
  font-size: 1.2em;
}

/* Actions */
.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Footer */
footer {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  color: #64748b;
  font-size: 0.9em;
}

/* Notification */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-weight: 600;
  color: white;
}

.notification.success {
  background: #10b981;
}

.notification.error {
  background: #ef4444;
}

.notification.info {
  background: #06b6d4;
}

/* Print styles */
@media print {
  .consignment-page {
    background: white;
    padding: 0;
  }

  .container {
    box-shadow: none;
    padding: 20px;
  }

  .actions,
  .instructions-controls,
  .material-input-group,
  .improvement-input-group,
  .back-btn,
  .reference-controls {
    display: none !important;
  }

  .card {
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  header h1 {
    font-size: 2em;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .step-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .step-actions {
    grid-column: 1;
  }

  .actions {
    flex-direction: column;
  }

  .material-input-group,
  .reference-input-group {
    grid-template-columns: 1fr;
  }

  .material-table-header,
  .material-row,
  .material-table-footer,
  .reference-table-header,
  .reference-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}
</style>
