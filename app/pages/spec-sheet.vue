<template>
  <div class="spec-sheet-page">
    <div class="container">
      <header>
        <LanguageSwitcher />
        <NuxtLink to="/" class="back-btn">{{ t('common.backToHome') }}</NuxtLink>
        <h1>{{ t('specSheet.title') }}</h1>
        <p class="subtitle">{{ t('specSheet.subtitle') }}</p>
      </header>

      <!-- Action Buttons -->
      <section class="action-buttons">
        <button class="btn btn-primary" @click="generatePreview">
          {{ t('specSheet.preview') }}
        </button>
        <button class="btn btn-secondary" @click="exportToPDF">
          {{ t('specSheet.exportPDF') }}
        </button>
        <button class="btn btn-secondary" @click="exportToJSON">
          {{ t('specSheet.exportJSON') }}
        </button>
        <button class="btn btn-secondary" @click="triggerImport">
          {{ t('specSheet.importJSON') }}
        </button>
        <button class="btn btn-danger" @click="clearAllData">
          {{ t('specSheet.clearAll') }}
        </button>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="importFromJSON"
        >
      </section>

      <!-- 1. Machine Identification -->
      <section class="card">
        <h2>{{ t('specSheet.sections.identification') }}</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="machineName">{{ t('specSheet.identification.machineName') }}</label>
            <input
              id="machineName"
              v-model="data.identification.machineName"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.identification.machineNamePlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="brand">{{ t('specSheet.identification.brand') }}</label>
            <input
              id="brand"
              v-model="data.identification.brand"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.identification.brandPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="serialNumber">{{ t('specSheet.identification.serialNumber') }}</label>
            <input
              id="serialNumber"
              v-model="data.identification.serialNumber"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.identification.serialNumberPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="commissioningDate">{{ t('specSheet.identification.commissioningDate') }}</label>
            <input
              id="commissioningDate"
              v-model="data.identification.commissioningDate"
              type="date"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label for="sheetVersion">{{ t('specSheet.identification.sheetVersion') }}</label>
            <input
              id="sheetVersion"
              v-model="data.identification.sheetVersion"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.identification.sheetVersionPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="sheetDate">{{ t('specSheet.identification.sheetDate') }}</label>
            <input
              id="sheetDate"
              v-model="data.identification.sheetDate"
              type="date"
              class="form-control"
            >
          </div>
        </div>
      </section>

      <!-- 2. Visuals & Safety Points -->
      <section class="card">
        <h2>{{ t('specSheet.sections.visuals') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>{{ t('specSheet.visuals.uploadPhoto') }}</label>
            <div class="file-upload-container">
              <button class="btn btn-secondary" @click="triggerPhotoUpload">
                {{ data.visuals.photoUrl ? t('specSheet.visuals.changePhoto') : t('specSheet.visuals.addPhoto') }}
              </button>
              <input
                ref="photoInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handlePhotoUpload"
              >
              <div v-if="data.visuals.photoUrl" class="image-preview">
                <img :src="data.visuals.photoUrl" alt="Machine Photo">
              </div>
            </div>
          </div>
          <div class="form-group full-width">
            <label>{{ t('specSheet.visuals.uploadDiagram') }}</label>
            <div class="file-upload-container">
              <button class="btn btn-secondary" @click="triggerDiagramUpload">
                {{ data.visuals.diagramUrl ? t('specSheet.visuals.changeDiagram') : t('specSheet.visuals.addDiagram') }}
              </button>
              <input
                ref="diagramInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleDiagramUpload"
              >
              <div v-if="data.visuals.diagramUrl" class="image-preview">
                <img :src="data.visuals.diagramUrl" alt="Machine Diagram">
              </div>
            </div>
          </div>
          <div class="form-group full-width">
            <label for="safetyPoints">{{ t('specSheet.visuals.safetyPoints') }}</label>
            <textarea
              id="safetyPoints"
              v-model="data.visuals.safetyPoints"
              class="form-control"
              rows="4"
              :placeholder="t('specSheet.visuals.safetyPointsPlaceholder')"
            />
          </div>
        </div>
      </section>

      <!-- 3. Technical Characteristics -->
      <section class="card">
        <h2>{{ t('specSheet.sections.technical') }}</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="dimensions">{{ t('specSheet.technical.dimensions') }}</label>
            <input
              id="dimensions"
              v-model="data.technical.dimensions"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.technical.dimensionsPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="weight">{{ t('specSheet.technical.weight') }}</label>
            <input
              id="weight"
              v-model="data.technical.weight"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.technical.weightPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="speedRanges">{{ t('specSheet.technical.speedRanges') }}</label>
            <input
              id="speedRanges"
              v-model="data.technical.speedRanges"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.technical.speedRangesPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="powerSupply">{{ t('specSheet.technical.powerSupply') }}</label>
            <input
              id="powerSupply"
              v-model="data.technical.powerSupply"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.technical.powerSupplyPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="noiseLevel">{{ t('specSheet.technical.noiseLevel') }}</label>
            <input
              id="noiseLevel"
              v-model="data.technical.noiseLevel"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.technical.noiseLevelPlaceholder')"
            >
          </div>
          <div class="form-group full-width">
            <label for="operatingLimits">{{ t('specSheet.technical.operatingLimits') }}</label>
            <textarea
              id="operatingLimits"
              v-model="data.technical.operatingLimits"
              class="form-control"
              rows="3"
              :placeholder="t('specSheet.technical.operatingLimitsPlaceholder')"
            />
          </div>
          <div class="form-group full-width">
            <label for="additionalSpecs">{{ t('specSheet.technical.additionalSpecs') }}</label>
            <textarea
              id="additionalSpecs"
              v-model="data.technical.additionalSpecs"
              class="form-control"
              rows="3"
              :placeholder="t('specSheet.technical.additionalSpecsPlaceholder')"
            />
          </div>
        </div>
      </section>

      <!-- 4. Safety & PPE -->
      <section class="card">
        <h2>{{ t('specSheet.sections.safety') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <SafetySuggestionInput
              v-model="data.safety.requiredPPE"
              :suggestions="ppeSuggestions"
              :label="t('specSheet.safety.requiredPPE')"
              :placeholder="t('specSheet.safety.ppePlaceholder')"
              :group-by="groupPPEByCategory"
            />
          </div>
          <div class="form-group full-width">
            <SafetySuggestionInput
              v-model="data.safety.prohibitedPPE"
              :suggestions="ppeSuggestions"
              :label="t('specSheet.safety.prohibitedPPE')"
              :placeholder="t('specSheet.safety.ppePlaceholder')"
              :group-by="groupPPEByCategory"
            />
          </div>
        </div>
      </section>

      <!-- 5. Operations -->
      <section class="card">
        <h2>{{ t('specSheet.sections.operations') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="normalOperation">{{ t('specSheet.operations.normalOperation') }}</label>
            <textarea
              id="normalOperation"
              v-model="data.operations.normalOperation"
              class="form-control"
              rows="5"
              :placeholder="t('specSheet.operations.normalOperationPlaceholder')"
            />
          </div>
          <div class="form-group full-width">
            <label for="adjustments">{{ t('specSheet.operations.adjustments') }}</label>
            <textarea
              id="adjustments"
              v-model="data.operations.adjustments"
              class="form-control"
              rows="4"
              :placeholder="t('specSheet.operations.adjustmentsPlaceholder')"
            />
          </div>
          <div class="form-group full-width">
            <label for="maintenance">{{ t('specSheet.operations.maintenance') }}</label>
            <textarea
              id="maintenance"
              v-model="data.operations.maintenance"
              class="form-control"
              rows="4"
              :placeholder="t('specSheet.operations.maintenancePlaceholder')"
            />
          </div>
        </div>
      </section>

      <!-- 6. Risks & Dangers -->
      <section class="card">
        <h2>{{ t('specSheet.sections.risks') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <SafetySuggestionInput
              v-model="data.risks.identifiedRisks"
              :suggestions="riskSuggestions"
              :label="t('specSheet.risks.identifiedRisks')"
              :placeholder="t('specSheet.risks.riskPlaceholder')"
              :group-by="groupRiskByColor"
            />
          </div>
          <div class="form-group full-width">
            <label for="residualRisks">{{ t('specSheet.risks.residualRisks') }}</label>
            <textarea
              id="residualRisks"
              v-model="data.risks.residualRisks"
              class="form-control"
              rows="4"
              :placeholder="t('specSheet.risks.riskPlaceholder')"
            />
          </div>
        </div>
      </section>

      <!-- 7. Preventive Measures -->
      <section class="card">
        <h2>{{ t('specSheet.sections.prevention') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="instructions">{{ t('specSheet.prevention.instructions') }}</label>
            <textarea
              id="instructions"
              v-model="data.prevention.instructions"
              class="form-control"
              rows="4"
              :placeholder="t('specSheet.prevention.instructionsPlaceholder')"
            />
          </div>
          <div class="form-group full-width">
            <label for="toDo">{{ t('specSheet.prevention.toDo') }}</label>
            <textarea
              id="toDo"
              v-model="data.prevention.toDo"
              class="form-control"
              rows="4"
              :placeholder="t('specSheet.prevention.toDoPlaceholder')"
            />
          </div>
          <div class="form-group full-width">
            <label for="toAvoid">{{ t('specSheet.prevention.toAvoid') }}</label>
            <textarea
              id="toAvoid"
              v-model="data.prevention.toAvoid"
              class="form-control"
              rows="4"
              :placeholder="t('specSheet.prevention.toAvoidPlaceholder')"
            />
          </div>
        </div>
      </section>

      <!-- 8. Qualification & Authorization -->
      <section class="card">
        <h2>{{ t('specSheet.sections.qualification') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="authorizedPersonnel">{{ t('specSheet.qualification.authorizedPersonnel') }}</label>
            <textarea
              id="authorizedPersonnel"
              v-model="data.qualification.authorizedPersonnel"
              class="form-control"
              rows="3"
              :placeholder="t('specSheet.qualification.authorizedPersonnelPlaceholder')"
            />
          </div>
          <div class="form-group full-width">
            <label for="requiredTraining">{{ t('specSheet.qualification.requiredTraining') }}</label>
            <textarea
              id="requiredTraining"
              v-model="data.qualification.requiredTraining"
              class="form-control"
              rows="3"
              :placeholder="t('specSheet.qualification.requiredTrainingPlaceholder')"
            />
          </div>
          <div class="form-group full-width">
            <label for="certifications">{{ t('specSheet.qualification.certifications') }}</label>
            <textarea
              id="certifications"
              v-model="data.qualification.certifications"
              class="form-control"
              rows="3"
              :placeholder="t('specSheet.qualification.certificationsPlaceholder')"
            />
          </div>
        </div>
      </section>

      <!-- 9. Emergency Procedures -->
      <section class="card">
        <h2>{{ t('specSheet.sections.emergency') }}</h2>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="emergencyStop">{{ t('specSheet.emergency.emergencyStop') }}</label>
            <textarea
              id="emergencyStop"
              v-model="data.emergency.emergencyStop"
              class="form-control"
              rows="3"
              :placeholder="t('specSheet.emergency.emergencyStopPlaceholder')"
            />
          </div>
          <div class="form-group">
            <label for="firstAid">{{ t('specSheet.emergency.firstAid') }}</label>
            <input
              id="firstAid"
              v-model="data.emergency.firstAid"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.emergency.firstAidPlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="fireBrigade">{{ t('specSheet.emergency.fireBrigade') }}</label>
            <input
              id="fireBrigade"
              v-model="data.emergency.fireBrigade"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.emergency.fireBrigadePlaceholder')"
            >
          </div>
          <div class="form-group">
            <label for="samu">{{ t('specSheet.emergency.samu') }}</label>
            <input
              id="samu"
              v-model="data.emergency.samu"
              type="text"
              class="form-control"
              :placeholder="t('specSheet.emergency.samuPlaceholder')"
            >
          </div>
          <div class="form-group full-width">
            <label for="internalEscalation">{{ t('specSheet.emergency.internalEscalation') }}</label>
            <textarea
              id="internalEscalation"
              v-model="data.emergency.internalEscalation"
              class="form-control"
              rows="3"
              :placeholder="t('specSheet.emergency.internalEscalationPlaceholder')"
            />
          </div>
        </div>
      </section>

      <!-- Preview Modal -->
      <div v-if="showPreview" class="modal-overlay" @click="closePreview">
        <div class="modal-content spec-sheet-preview" @click.stop>
          <button class="close-btn" @click="closePreview">✕</button>
          <div class="a4-page">
            <!-- Header -->
            <div class="sheet-header">
              <h1 class="sheet-title">{{ t('specSheet.pdf.title') }}</h1>
              <p class="sheet-subtitle">{{ t('specSheet.pdf.subtitle') }}</p>
              <div class="sheet-meta">
                <span><strong>{{ t('specSheet.pdf.version') }}</strong> {{ data.identification.sheetVersion || '-' }}</span>
                <span><strong>{{ t('specSheet.pdf.date') }}</strong> {{ formatDate(data.identification.sheetDate) }}</span>
              </div>
            </div>

            <!-- 1. Identification -->
            <div class="sheet-section">
              <h2 class="section-title">{{ t('specSheet.sections.identification') }}</h2>
              <div class="info-grid">
                <div class="info-item">
                  <strong>{{ t('specSheet.identification.machineName') }}</strong>
                  <span>{{ data.identification.machineName || '-' }}</span>
                </div>
                <div class="info-item">
                  <strong>{{ t('specSheet.identification.brand') }}</strong>
                  <span>{{ data.identification.brand || '-' }}</span>
                </div>
                <div class="info-item">
                  <strong>{{ t('specSheet.identification.serialNumber') }}</strong>
                  <span>{{ data.identification.serialNumber || '-' }}</span>
                </div>
                <div class="info-item">
                  <strong>{{ t('specSheet.identification.commissioningDate') }}</strong>
                  <span>{{ formatDate(data.identification.commissioningDate) }}</span>
                </div>
              </div>
            </div>

            <!-- 2. Visuals -->
            <div v-if="data.visuals.photoUrl || data.visuals.diagramUrl || data.visuals.safetyPoints" class="sheet-section">
              <h2 class="section-title">{{ t('specSheet.sections.visuals') }}</h2>
              <div class="visuals-container">
                <div v-if="data.visuals.photoUrl" class="visual-image">
                  <img :src="data.visuals.photoUrl" alt="Machine Photo">
                </div>
                <div v-if="data.visuals.diagramUrl" class="visual-image">
                  <img :src="data.visuals.diagramUrl" alt="Machine Diagram">
                </div>
                <div v-if="data.visuals.safetyPoints" class="safety-points">
                  <strong>{{ t('specSheet.visuals.safetyPoints') }}</strong>
                  <ul>
                    <li v-for="(point, index) in getSafetyPointsArray()" :key="index">{{ point }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 3. Technical Characteristics -->
            <div class="sheet-section">
              <h2 class="section-title">{{ t('specSheet.sections.technical') }}</h2>
              <div class="info-grid">
                <div v-if="data.technical.dimensions" class="info-item">
                  <strong>{{ t('specSheet.technical.dimensions') }}</strong>
                  <span>{{ data.technical.dimensions }}</span>
                </div>
                <div v-if="data.technical.weight" class="info-item">
                  <strong>{{ t('specSheet.technical.weight') }}</strong>
                  <span>{{ data.technical.weight }}</span>
                </div>
                <div v-if="data.technical.speedRanges" class="info-item">
                  <strong>{{ t('specSheet.technical.speedRanges') }}</strong>
                  <span>{{ data.technical.speedRanges }}</span>
                </div>
                <div v-if="data.technical.powerSupply" class="info-item">
                  <strong>{{ t('specSheet.technical.powerSupply') }}</strong>
                  <span>{{ data.technical.powerSupply }}</span>
                </div>
                <div v-if="data.technical.noiseLevel" class="info-item">
                  <strong>{{ t('specSheet.technical.noiseLevel') }}</strong>
                  <span>{{ data.technical.noiseLevel }}</span>
                </div>
              </div>
              <div v-if="data.technical.operatingLimits" class="info-text">
                <strong>{{ t('specSheet.technical.operatingLimits') }}</strong>
                <p>{{ data.technical.operatingLimits }}</p>
              </div>
              <div v-if="data.technical.additionalSpecs" class="info-text">
                <strong>{{ t('specSheet.technical.additionalSpecs') }}</strong>
                <p>{{ data.technical.additionalSpecs }}</p>
              </div>
            </div>

            <!-- 4. Safety & PPE -->
            <div class="sheet-section safety-section">
              <h2 class="section-title">{{ t('specSheet.sections.safety') }}</h2>
              <div class="ppe-display">
                <div v-if="data.safety.requiredPPE.length > 0" class="ppe-group required-ppe">
                  <h3>{{ t('specSheet.safety.requiredPPE') }}</h3>
                  <ul>
                    <li v-for="ppe in data.safety.requiredPPE" :key="ppe" class="ppe-item-required">
                      {{ getPPELabel(ppe) }}
                    </li>
                  </ul>
                </div>
                <div v-if="data.safety.prohibitedPPE.length > 0" class="ppe-group prohibited-ppe">
                  <h3>{{ t('specSheet.safety.prohibitedPPE') }}</h3>
                  <ul>
                    <li v-for="ppe in data.safety.prohibitedPPE" :key="ppe" class="ppe-item-prohibited">
                      {{ getPPELabel(ppe) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 5. Operations -->
            <div class="sheet-section">
              <h2 class="section-title">{{ t('specSheet.sections.operations') }}</h2>
              <div v-if="data.operations.normalOperation" class="info-text">
                <strong>{{ t('specSheet.operations.normalOperation') }}</strong>
                <pre>{{ data.operations.normalOperation }}</pre>
              </div>
              <div v-if="data.operations.adjustments" class="info-text">
                <strong>{{ t('specSheet.operations.adjustments') }}</strong>
                <p>{{ data.operations.adjustments }}</p>
              </div>
              <div v-if="data.operations.maintenance" class="info-text">
                <strong>{{ t('specSheet.operations.maintenance') }}</strong>
                <p>{{ data.operations.maintenance }}</p>
              </div>
            </div>

            <!-- 6. Risks & Dangers -->
            <div class="sheet-section risks-section">
              <h2 class="section-title">{{ t('specSheet.sections.risks') }}</h2>
              <div v-if="data.risks.identifiedRisks.length > 0" class="risks-display">
                <h3>{{ t('specSheet.risks.identifiedRisks') }}</h3>
                <ul>
                  <li v-for="risk in data.risks.identifiedRisks" :key="risk" class="risk-item">
                    {{ getRiskLabel(risk) }}
                  </li>
                </ul>
              </div>
              <div v-if="data.risks.residualRisks" class="info-text">
                <strong>{{ t('specSheet.risks.residualRisks') }}</strong>
                <p>{{ data.risks.residualRisks }}</p>
              </div>
            </div>

            <!-- 7. Preventive Measures -->
            <div class="sheet-section prevention-section">
              <h2 class="section-title">{{ t('specSheet.sections.prevention') }}</h2>
              <div v-if="data.prevention.instructions" class="info-text">
                <strong>{{ t('specSheet.prevention.instructions') }}</strong>
                <p>{{ data.prevention.instructions }}</p>
              </div>
              <div class="prevention-grid">
                <div v-if="data.prevention.toDo" class="prevention-item to-do">
                  <h3>{{ t('specSheet.prevention.toDo') }}</h3>
                  <p>{{ data.prevention.toDo }}</p>
                </div>
                <div v-if="data.prevention.toAvoid" class="prevention-item to-avoid">
                  <h3>{{ t('specSheet.prevention.toAvoid') }}</h3>
                  <p>{{ data.prevention.toAvoid }}</p>
                </div>
              </div>
            </div>

            <!-- 8. Qualification & Authorization -->
            <div class="sheet-section">
              <h2 class="section-title">{{ t('specSheet.sections.qualification') }}</h2>
              <div v-if="data.qualification.authorizedPersonnel" class="info-text">
                <strong>{{ t('specSheet.qualification.authorizedPersonnel') }}</strong>
                <p>{{ data.qualification.authorizedPersonnel }}</p>
              </div>
              <div v-if="data.qualification.requiredTraining" class="info-text">
                <strong>{{ t('specSheet.qualification.requiredTraining') }}</strong>
                <p>{{ data.qualification.requiredTraining }}</p>
              </div>
              <div v-if="data.qualification.certifications" class="info-text">
                <strong>{{ t('specSheet.qualification.certifications') }}</strong>
                <p>{{ data.qualification.certifications }}</p>
              </div>
            </div>

            <!-- 9. Emergency Procedures -->
            <div class="sheet-section emergency-section">
              <h2 class="section-title">{{ t('specSheet.sections.emergency') }}</h2>
              <div v-if="data.emergency.emergencyStop" class="info-text">
                <strong>{{ t('specSheet.emergency.emergencyStop') }}</strong>
                <p>{{ data.emergency.emergencyStop }}</p>
              </div>
              <div class="emergency-contacts">
                <div v-if="data.emergency.firstAid" class="contact-item">
                  <strong>{{ t('specSheet.emergency.firstAid') }}</strong>
                  <span>{{ data.emergency.firstAid }}</span>
                </div>
                <div v-if="data.emergency.fireBrigade" class="contact-item">
                  <strong>{{ t('specSheet.emergency.fireBrigade') }}</strong>
                  <span>{{ data.emergency.fireBrigade }}</span>
                </div>
                <div v-if="data.emergency.samu" class="contact-item">
                  <strong>{{ t('specSheet.emergency.samu') }}</strong>
                  <span>{{ data.emergency.samu }}</span>
                </div>
              </div>
              <div v-if="data.emergency.internalEscalation" class="info-text">
                <strong>{{ t('specSheet.emergency.internalEscalation') }}</strong>
                <p>{{ data.emergency.internalEscalation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSafetyData } from '~/composables/useSafetyData'

const { t, locale } = useI18n()
const { loadData, dangers, protectiveEquipments } = useSafetyData()

// PPE Suggestions - dynamically built from protectiveEquipments data
const ppeSuggestions = computed(() => {
  if (!protectiveEquipments.value?.ppe) return []
  
  const lang = locale.value === 'fr' ? 'fr' : 'en'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allPPE: any[] = []
  
  // Collect all PPE from all categories
  const categories = ['electrical', 'mechanical', 'common'] as const
  categories.forEach(category => {
    const items = protectiveEquipments.value.ppe[category] || []
    items.forEach(item => {
      allPPE.push({
        id: item.id,
        name: item[lang],
        type: 'PPE',
        category: category,
        badges: [
          { text: 'PPE', class: 'badge-ppe' },
          { text: category, class: `badge-${category}` }
        ]
      })
    })
  })
  
  return allPPE
})

// Risk/Danger Suggestions - dynamically built from dangers data
const riskSuggestions = computed(() => {
  if (!dangers.value) return []
  
  const lang = locale.value === 'fr' ? 'fr' : 'en'
  
  return dangers.value.dangers.map(d => ({
    id: d.id,
    name: d[lang],
    color: d.color,
    badges: d.requiresValue 
      ? [{ text: `${d.unit}`, class: `badge-${d.color}` }]
      : []
  }))
})

// Helper functions for grouping
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupPPEByCategory = (item: any) => ({
  key: `PPE-${item.category}`,
  label: `PPE - ${item.category}`
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const groupRiskByColor = (item: any) => ({
  key: `risk-${item.color}`,
  label: item.color.replace(/-/g, ' ')
})

interface SpecSheetData {
  identification: {
    machineName: string
    brand: string
    serialNumber: string
    commissioningDate: string
    sheetVersion: string
    sheetDate: string
  }
  visuals: {
    photoUrl: string
    diagramUrl: string
    safetyPoints: string
  }
  technical: {
    dimensions: string
    weight: string
    speedRanges: string
    powerSupply: string
    noiseLevel: string
    operatingLimits: string
    additionalSpecs: string
  }
  safety: {
    requiredPPE: string[]
    prohibitedPPE: string[]
  }
  operations: {
    normalOperation: string
    adjustments: string
    maintenance: string
  }
  risks: {
    identifiedRisks: string[]
    residualRisks: string
  }
  prevention: {
    instructions: string
    toDo: string
    toAvoid: string
  }
  qualification: {
    authorizedPersonnel: string
    requiredTraining: string
    certifications: string
  }
  emergency: {
    emergencyStop: string
    firstAid: string
    fireBrigade: string
    samu: string
    internalEscalation: string
  }
}

// Default emergency numbers (France defaults)
const defaultEmergencyNumbers = {
  fireBrigade: '18',
  samu: '15'
}

const data = reactive<SpecSheetData>({
  identification: {
    machineName: '',
    brand: '',
    serialNumber: '',
    commissioningDate: '',
    sheetVersion: 'v1.0',
    sheetDate: new Date().toISOString().split('T')[0]
  },
  visuals: {
    photoUrl: '',
    diagramUrl: '',
    safetyPoints: ''
  },
  technical: {
    dimensions: '',
    weight: '',
    speedRanges: '',
    powerSupply: '',
    noiseLevel: '',
    operatingLimits: '',
    additionalSpecs: ''
  },
  safety: {
    requiredPPE: [],
    prohibitedPPE: []
  },
  operations: {
    normalOperation: '',
    adjustments: '',
    maintenance: ''
  },
  risks: {
    identifiedRisks: [],
    residualRisks: ''
  },
  prevention: {
    instructions: '',
    toDo: '',
    toAvoid: ''
  },
  qualification: {
    authorizedPersonnel: '',
    requiredTraining: '',
    certifications: ''
  },
  emergency: {
    emergencyStop: '',
    firstAid: '',
    fireBrigade: defaultEmergencyNumbers.fireBrigade,
    samu: defaultEmergencyNumbers.samu,
    internalEscalation: ''
  }
})

const showPreview = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const photoInput = ref<HTMLInputElement | null>(null)
const diagramInput = ref<HTMLInputElement | null>(null)

// Memoize jsPDF import to avoid repeated imports
let jsPDFModule: typeof import('jspdf') | null = null

const generatePreview = (): void => {
  if (!data.identification.machineName) {
    alert(t('specSheet.errors.fillMachineName'))
    return
  }
  showPreview.value = true
}

const closePreview = (): void => {
  showPreview.value = false
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const getSafetyPointsArray = (): string[] => {
  return data.visuals.safetyPoints
    .split('\n')
    .filter(point => point.trim() !== '')
}

const getPPELabel = (item: unknown): string => {
  // If it's an object with a name property, return the name
  // Otherwise treat it as a string (for backward compatibility)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof item === 'object' && item !== null && 'name' in item ? (item as any).name : t(`specSheet.safety.ppeTypes.${item}`)
}

const getRiskLabel = (item: unknown): string => {
  // If it's an object with a name property, return the name
  // Otherwise treat it as a string (for backward compatibility)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof item === 'object' && item !== null && 'name' in item ? (item as any).name : t(`specSheet.risks.riskTypes.${item}`)
}

const triggerPhotoUpload = (): void => {
  photoInput.value?.click()
}

const triggerDiagramUpload = (): void => {
  diagramInput.value?.click()
}

const handlePhotoUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      data.visuals.photoUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleDiagramUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      data.visuals.diagramUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const exportToJSON = (): void => {
  const dataStr = JSON.stringify(data, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `spec-sheet-${data.identification.machineName || 'machine'}-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const triggerImport = (): void => {
  fileInput.value?.click()
}

const importFromJSON = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    alert(t('specSheet.errors.selectJSONFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      Object.assign(data, imported)
    } catch (error) {
      alert(t('specSheet.errors.parsingError') + ' ' + (error as Error).message)
    }
  }
  reader.readAsText(file)
}

const exportToPDF = async (): Promise<void> => {
  if (!data.identification.machineName) {
    alert(t('specSheet.errors.fillMachineName'))
    return
  }

  // Dynamically import jsPDF only when needed (client-side only) and memoize it
  if (!jsPDFModule) {
    jsPDFModule = await import('jspdf')
  }
  const { jsPDF } = jsPDFModule
  
  const pdf = new jsPDF('p', 'mm', 'a4')
  let yPosition = 20

  // Title
  pdf.setFontSize(20)
  pdf.text(t('specSheet.pdf.title'), 105, yPosition, { align: 'center' })
  yPosition += 10

  pdf.setFontSize(12)
  pdf.text(t('specSheet.pdf.subtitle'), 105, yPosition, { align: 'center' })
  yPosition += 15

  // Version and date
  pdf.setFontSize(10)
  pdf.text(`${t('specSheet.pdf.version')} ${data.identification.sheetVersion}`, 20, yPosition)
  pdf.text(`${t('specSheet.pdf.date')} ${formatDate(data.identification.sheetDate)}`, 150, yPosition)
  yPosition += 10

  // Helper function to add section
  const addSection = (title: string, content: string[]): void => {
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, 20, yPosition)
    yPosition += 7

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    content.forEach(line => {
      if (yPosition > 270) {
        pdf.addPage()
        yPosition = 20
      }
      const lines = pdf.splitTextToSize(line, 170)
      pdf.text(lines, 20, yPosition)
      yPosition += 5 * lines.length
    })
    yPosition += 5
  }

  // 1. Identification
  addSection(t('specSheet.sections.identification'), [
    `${t('specSheet.identification.machineName')} ${data.identification.machineName}`,
    `${t('specSheet.identification.brand')} ${data.identification.brand || '-'}`,
    `${t('specSheet.identification.serialNumber')} ${data.identification.serialNumber || '-'}`,
    `${t('specSheet.identification.commissioningDate')} ${formatDate(data.identification.commissioningDate)}`
  ])

  // 2. Technical Characteristics
  const techLines: string[] = []
  if (data.technical.dimensions) techLines.push(`${t('specSheet.technical.dimensions')} ${data.technical.dimensions}`)
  if (data.technical.weight) techLines.push(`${t('specSheet.technical.weight')} ${data.technical.weight}`)
  if (data.technical.speedRanges) techLines.push(`${t('specSheet.technical.speedRanges')} ${data.technical.speedRanges}`)
  if (data.technical.powerSupply) techLines.push(`${t('specSheet.technical.powerSupply')} ${data.technical.powerSupply}`)
  if (data.technical.noiseLevel) techLines.push(`${t('specSheet.technical.noiseLevel')} ${data.technical.noiseLevel}`)
  if (techLines.length > 0) {
    addSection(t('specSheet.sections.technical'), techLines)
  }

  // 3. Safety & PPE
  if (data.safety.requiredPPE.length > 0 || data.safety.prohibitedPPE.length > 0) {
    const safetyLines: string[] = []
    if (data.safety.requiredPPE.length > 0) {
      safetyLines.push(`${t('specSheet.safety.requiredPPE')} ${data.safety.requiredPPE.map(getPPELabel).join(', ')}`)
    }
    if (data.safety.prohibitedPPE.length > 0) {
      safetyLines.push(`${t('specSheet.safety.prohibitedPPE')} ${data.safety.prohibitedPPE.map(getPPELabel).join(', ')}`)
    }
    addSection(t('specSheet.sections.safety'), safetyLines)
  }

  // 4. Operations
  if (data.operations.normalOperation || data.operations.adjustments || data.operations.maintenance) {
    const opLines: string[] = []
    if (data.operations.normalOperation) opLines.push(`${t('specSheet.operations.normalOperation')} ${data.operations.normalOperation}`)
    if (data.operations.adjustments) opLines.push(`${t('specSheet.operations.adjustments')} ${data.operations.adjustments}`)
    if (data.operations.maintenance) opLines.push(`${t('specSheet.operations.maintenance')} ${data.operations.maintenance}`)
    addSection(t('specSheet.sections.operations'), opLines)
  }

  // 5. Risks & Dangers
  if (data.risks.identifiedRisks.length > 0 || data.risks.residualRisks) {
    const riskLines: string[] = []
    if (data.risks.identifiedRisks.length > 0) {
      riskLines.push(`${t('specSheet.risks.identifiedRisks')} ${data.risks.identifiedRisks.map(getRiskLabel).join(', ')}`)
    }
    if (data.risks.residualRisks) {
      riskLines.push(`${t('specSheet.risks.residualRisks')} ${data.risks.residualRisks}`)
    }
    addSection(t('specSheet.sections.risks'), riskLines)
  }

  // 6. Preventive Measures
  if (data.prevention.instructions || data.prevention.toDo || data.prevention.toAvoid) {
    const prevLines: string[] = []
    if (data.prevention.instructions) prevLines.push(data.prevention.instructions)
    if (data.prevention.toDo) prevLines.push(`${t('specSheet.prevention.toDo')} ${data.prevention.toDo}`)
    if (data.prevention.toAvoid) prevLines.push(`${t('specSheet.prevention.toAvoid')} ${data.prevention.toAvoid}`)
    addSection(t('specSheet.sections.prevention'), prevLines)
  }

  // 7. Qualification
  if (data.qualification.authorizedPersonnel || data.qualification.requiredTraining || data.qualification.certifications) {
    const qualLines: string[] = []
    if (data.qualification.authorizedPersonnel) qualLines.push(`${t('specSheet.qualification.authorizedPersonnel')} ${data.qualification.authorizedPersonnel}`)
    if (data.qualification.requiredTraining) qualLines.push(`${t('specSheet.qualification.requiredTraining')} ${data.qualification.requiredTraining}`)
    if (data.qualification.certifications) qualLines.push(`${t('specSheet.qualification.certifications')} ${data.qualification.certifications}`)
    addSection(t('specSheet.sections.qualification'), qualLines)
  }

  // 8. Emergency Procedures
  const emergLines: string[] = []
  if (data.emergency.emergencyStop) emergLines.push(`${t('specSheet.emergency.emergencyStop')} ${data.emergency.emergencyStop}`)
  if (data.emergency.firstAid) emergLines.push(`${t('specSheet.emergency.firstAid')} ${data.emergency.firstAid}`)
  if (data.emergency.fireBrigade) emergLines.push(`${t('specSheet.emergency.fireBrigade')} ${data.emergency.fireBrigade}`)
  if (data.emergency.samu) emergLines.push(`${t('specSheet.emergency.samu')} ${data.emergency.samu}`)
  if (emergLines.length > 0) {
    addSection(t('specSheet.sections.emergency'), emergLines)
  }

  pdf.save(`spec-sheet-${data.identification.machineName}-${Date.now()}.pdf`)
}

const clearAllData = (): void => {
  if (confirm(t('specSheet.clearAll') + '?')) {
    Object.assign(data, {
      identification: {
        machineName: '',
        brand: '',
        serialNumber: '',
        commissioningDate: '',
        sheetVersion: 'v1.0',
        sheetDate: new Date().toISOString().split('T')[0]
      },
      visuals: {
        photoUrl: '',
        diagramUrl: '',
        safetyPoints: ''
      },
      technical: {
        dimensions: '',
        weight: '',
        speedRanges: '',
        powerSupply: '',
        noiseLevel: '',
        operatingLimits: '',
        additionalSpecs: ''
      },
      safety: {
        requiredPPE: [],
        prohibitedPPE: []
      },
      operations: {
        normalOperation: '',
        adjustments: '',
        maintenance: ''
      },
      risks: {
        identifiedRisks: [],
        residualRisks: ''
      },
      prevention: {
        instructions: '',
        toDo: '',
        toAvoid: ''
      },
      qualification: {
        authorizedPersonnel: '',
        requiredTraining: '',
        certifications: ''
      },
      emergency: {
        emergencyStop: '',
        firstAid: '',
        fireBrigade: defaultEmergencyNumbers.fireBrigade,
        samu: defaultEmergencyNumbers.samu,
        internalEscalation: ''
      }
    })
  }
}

// Load safety data on mount
onMounted(() => {
  loadData()
})

</script>

<style scoped>
.spec-sheet-page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

.back-btn {
  display: inline-block;
  padding: 10px 20px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: white;
  font-size: 2.5em;
  margin-bottom: 10px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2em;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #667eea;
}

.btn-secondary:hover {
  background: #f0f4ff;
  transform: translateY(-2px);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #667eea;
  font-size: 1.8em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0f2fe;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #334155;
}

.form-control {
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

textarea.form-control {
  resize: vertical;
  font-family: inherit;
}

.file-upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.image-preview {
  margin-top: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.ppe-selector,
.risk-selector {
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
}

.ppe-checkboxes,
.risk-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-item label {
  margin: 0;
  cursor: pointer;
  font-weight: normal;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 40px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #dc2626;
  transform: rotate(90deg);
}

/* A4 Page Preview */
.a4-page {
  background: white;
  padding: 20mm;
  min-height: 297mm;
  width: 210mm;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.sheet-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #667eea;
}

.sheet-title {
  color: #667eea;
  font-size: 28px;
  margin-bottom: 8px;
}

.sheet-subtitle {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 15px;
}

.sheet-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.sheet-section {
  margin-bottom: 25px;
  page-break-inside: avoid;
}

.section-title {
  color: #667eea;
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0f2fe;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.info-item strong {
  color: #334155;
  font-size: 12px;
}

.info-item span {
  color: #1e293b;
  font-size: 14px;
}

.info-text {
  margin-bottom: 15px;
}

.info-text strong {
  display: block;
  color: #334155;
  font-size: 13px;
  margin-bottom: 6px;
}

.info-text p,
.info-text pre {
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
}

.visuals-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.visual-image img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.safety-points ul {
  margin: 10px 0;
  padding-left: 20px;
}

.safety-points li {
  color: #475569;
  font-size: 13px;
  margin: 5px 0;
}

/* Safety Section */
.safety-section .ppe-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.ppe-group h3 {
  font-size: 14px;
  margin-bottom: 10px;
  color: #334155;
}

.ppe-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ppe-group li {
  padding: 6px 12px;
  margin: 5px 0;
  border-radius: 5px;
  font-size: 13px;
}

.ppe-item-required {
  background: #dcfce7;
  color: #166534;
  border-left: 3px solid #10b981;
}

.ppe-item-prohibited {
  background: #fee2e2;
  color: #991b1b;
  border-left: 3px solid #ef4444;
}

/* Risks Section */
.risks-section .risks-display ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.risk-item {
  padding: 8px 12px;
  margin: 5px 0;
  background: #fef3c7;
  color: #92400e;
  border-left: 3px solid #f59e0b;
  border-radius: 5px;
  font-size: 13px;
}

/* Prevention Section */
.prevention-section .prevention-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.prevention-item {
  padding: 15px;
  border-radius: 8px;
}

.prevention-item h3 {
  font-size: 14px;
  margin-bottom: 10px;
}

.prevention-item p {
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.to-do {
  background: #dcfce7;
  border-left: 4px solid #10b981;
}

.to-do h3 {
  color: #166534;
}

.to-do p {
  color: #166534;
}

.to-avoid {
  background: #fee2e2;
  border-left: 4px solid #ef4444;
}

.to-avoid h3 {
  color: #991b1b;
}

.to-avoid p {
  color: #991b1b;
}

/* Emergency Section */
.emergency-section .emergency-contacts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.contact-item {
  padding: 12px;
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
  border-radius: 6px;
}

.contact-item strong {
  display: block;
  color: #92400e;
  font-size: 12px;
  margin-bottom: 4px;
}

.contact-item span {
  color: #92400e;
  font-size: 16px;
  font-weight: 600;
}

@media print {
  .modal-overlay {
    background: white;
  }

  .close-btn {
    display: none;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .info-grid,
  .ppe-display,
  .prevention-grid,
  .emergency-contacts {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
