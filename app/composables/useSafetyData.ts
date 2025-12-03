import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface Danger {
  id: string
  en: string
  fr: string
  color: string
  requiresValue: boolean
  unit?: string
  pictogram: string
}

export interface ProtectiveEquipment {
  id: string
  en: string
  fr: string
  pictogram: string
}

export interface PictogramMap {
  obligations: Record<string, string>
  dangers: Record<string, string>
}

export interface DangersData {
  dangers: Danger[]
}

export interface ProtectiveEquipmentsData {
  ppe: {
    electrical: ProtectiveEquipment[]
    mechanical: ProtectiveEquipment[]
    common: ProtectiveEquipment[]
  }
  cpe: {
    electrical: ProtectiveEquipment[]
    mechanical: ProtectiveEquipment[]
    common: ProtectiveEquipment[]
  }
}

export const useSafetyData = () => {
  const { locale } = useI18n()
  
  const pictograms = ref<PictogramMap | null>(null)
  const dangers = ref<DangersData | null>(null)
  const protectiveEquipments = ref<ProtectiveEquipmentsData | null>(null)
  
  const loadData = async () => {
    try {
      const [pictogramsRes, dangersRes, protectiveEquipmentsRes] = await Promise.all([
        fetch('/data/pictograms.json'),
        fetch('/data/dangers.json'),
        fetch('/data/protective-equipments.json')
      ])
      
      pictograms.value = await pictogramsRes.json()
      dangers.value = await dangersRes.json()
      protectiveEquipments.value = await protectiveEquipmentsRes.json()
    } catch (error) {
      console.error('Error loading safety data:', error)
    }
  }
  
  const getDangerLabel = (dangerId: string): string => {
    if (!dangers.value) return dangerId
    const danger = dangers.value.dangers.find(d => d.id === dangerId)
    if (!danger) return dangerId
    return locale.value === 'fr' ? danger.fr : danger.en
  }
  
  const getProtectiveEquipmentLabel = (equipmentId: string): string => {
    if (!protectiveEquipments.value) return equipmentId
    
    // Search in all categories
    const allCategories = [
      ...protectiveEquipments.value.ppe.electrical,
      ...protectiveEquipments.value.ppe.mechanical,
      ...protectiveEquipments.value.ppe.common,
      ...protectiveEquipments.value.cpe.electrical,
      ...protectiveEquipments.value.cpe.mechanical,
      ...protectiveEquipments.value.cpe.common
    ]
    
    const equipment = allCategories.find(e => e.id === equipmentId)
    if (!equipment) return equipmentId
    return locale.value === 'fr' ? equipment.fr : equipment.en
  }
  
  const getPictogramPath = (category: 'obligations' | 'dangers', key: string): string => {
    if (!pictograms.value) return ''
    const filename = pictograms.value[category][key]
    if (!filename) return ''
    const folder = category === 'obligations' ? 'OBLIGATION' : 'AVERTISSEMENT_DANGER'
    return `/resources/Pictogrammes_jpeg/${folder}/${filename}`
  }
  
  return {
    pictograms,
    dangers,
    protectiveEquipments,
    loadData,
    getDangerLabel,
    getProtectiveEquipmentLabel,
    getPictogramPath
  }
}
