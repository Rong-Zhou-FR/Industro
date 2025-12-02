<template>
  <div class="container">
    <div class="card fade-in">
      <LanguageSwitcher />
      <NuxtLink to="/" class="back-btn">{{ translate('common.backToHome') }}</NuxtLink>
      <h1 class="text-center">{{ translate('reliability.title') }}</h1>

      <div v-if="errorMessage" class="error show">{{ errorMessage }}</div>

      <div class="form-section">
        <h2>{{ translate('reliability.inputParameters') }}</h2>
        <div class="grid grid-cols-2">
          <div class="form-group">
            <label for="model">{{ translate('reliability.modelSelection') }}</label>
            <select id="model" v-model="model" class="form-control">
              <option value="exponential">{{ translate('reliability.exponentialModel') }}</option>
              <option value="linear">{{ translate('reliability.linearModel') }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="N_0">{{ translate('reliability.totalPieces') }}</label>
            <input id="N_0" v-model.number="N_0" type="number" min="1" step="1" class="form-control">
          </div>
          <div class="form-group">
            <label for="t">{{ translate('reliability.timeVerification') }}</label>
            <input id="t" v-model.number="t" type="number" min="0" step="0.01" class="form-control">
          </div>
          <div class="form-group">
            <label for="N_1">{{ translate('reliability.piecesFunctional') }}</label>
            <input id="N_1" v-model.number="N_1" type="number" min="0" step="1" class="form-control">
          </div>
        </div>
        <button class="btn" @click="calculate">{{ translate('reliability.calculate') }}</button>
        <button class="btn btn-secondary" @click="reset">{{ translate('reliability.reset') }}</button>
      </div>

      <div class="import-section">
        <h3>{{ translate('reliability.importPreviousResults') }}</h3>
        <input ref="jsonFileInput" type="file" accept=".json" @change="handleFileSelect">
        <button class="btn" @click="importJSON">{{ translate('reliability.importJSON') }}</button>
      </div>

      <div v-if="showResults" class="results">
        <h2>{{ translate('reliability.results') }}</h2>
        <div class="result-content">
          <div class="result-item">
            <span class="result-label">{{ translate('reliability.model') }}</span> {{ result.model.charAt(0).toUpperCase() + result.model.slice(1) }}
          </div>
          <div class="result-item">
            <span class="result-label">{{ translate('reliability.equation') }}</span>
            <div ref="equationDisplay" class="equation-display"/>
          </div>
          <div v-if="result.lambda !== undefined" class="result-item">
            <span class="result-label">{{ translate('reliability.failureRate') }}</span> {{ result.lambda.toExponential(6) }}
          </div>
          <div v-if="result.a !== undefined" class="result-item">
            <span class="result-label">{{ translate('reliability.slope') }}</span> {{ result.a.toExponential(6) }}
          </div>
          <div class="result-item">
            <span class="result-label">{{ translate('reliability.reliabilityAtVerification') }}</span> {{ result.reliability.toFixed(8) }}
          </div>
        </div>

        <div class="chart-options">
          <h3>{{ translate('reliability.graphOptions') }}</h3>
          <div class="scale-toggle">
            <label>
              <input v-model="scaleType" type="radio" value="linear" @change="updateChart">
              {{ translate('reliability.linearScale') }}
            </label>
            <label>
              <input v-model="scaleType" type="radio" value="logarithmic" @change="updateChart">
              {{ translate('reliability.logarithmicScale') }}
            </label>
          </div>

          <h4>{{ translate('reliability.adjustVisibleRegion') }}</h4>
          <div class="range-inputs grid grid-cols-2">
            <div class="range-group">
              <label for="t_start">{{ translate('reliability.timeStart') }}</label>
              <input id="t_start" v-model.number="tStart" type="number" step="0.01" placeholder="Auto" class="form-control" @change="updateChart">
            </div>
            <div class="range-group">
              <label for="t_end">{{ translate('reliability.timeEnd') }}</label>
              <input id="t_end" v-model.number="tEnd" type="number" step="0.01" placeholder="Auto" class="form-control" @change="updateChart">
            </div>
            <div class="range-group">
              <label for="R_visible_start">{{ translate('reliability.reliabilityStart') }}</label>
              <input id="R_visible_start" v-model.number="rVisibleStart" type="number" min="0" max="1" step="0.001" placeholder="Auto" class="form-control" @change="updateChart">
            </div>
            <div class="range-group">
              <label for="R_visible_end">{{ translate('reliability.reliabilityEnd') }}</label>
              <input id="R_visible_end" v-model.number="rVisibleEnd" type="number" min="0" max="1" step="0.001" placeholder="Auto" class="form-control" @change="updateChart">
            </div>
          </div>
          <button class="btn" style="margin-top: 15px;" @click="resetChartOptions">{{ translate('reliability.resetGraphOptions') }}</button>
        </div>

        <div class="chart-container">
          <canvas ref="chartCanvas"/>
        </div>

        <div class="export-buttons">
          <button class="btn" @click="exportJSON">{{ translate('reliability.exportJSON') }}</button>
          <button class="btn" @click="exportPDF">{{ translate('reliability.exportPDF') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: translate } = useI18n()

// Reactive state
const model = ref('exponential')
const N_0 = ref(null)
const t = ref(null)
const N_1 = ref(null)
const errorMessage = ref('')
const showResults = ref(false)
const result = ref(null)

// Chart options
const scaleType = ref('linear')
const tStart = ref(null)
const tEnd = ref(null)
const rVisibleStart = ref(null)
const rVisibleEnd = ref(null)

// Refs for DOM elements
const chartCanvas = ref(null)
const equationDisplay = ref(null)
const jsonFileInput = ref(null)

let chartInstance = null
let Chart = null

onMounted(async () => {
  // Dynamically import Chart.js
  const chartModule = await import('chart.js/auto')
  Chart = chartModule.default
})

const showError = (message) => {
  errorMessage.value = message
}

const hideError = () => {
  errorMessage.value = ''
}

const calculate = () => {
  if (!N_0.value || !t.value || N_1.value === null || N_1.value === undefined) {
    showError(translate('reliability.errors.fillAllFields'))
    return
  }

  if (N_1.value > N_0.value) {
    showError(translate('reliability.errors.n1GreaterThanN0'))
    return
  }

  if (N_0.value <= 0 || t.value <= 0) {
    showError(translate('reliability.errors.positiveValues'))
    return
  }

  hideError()

  // Calculate based on model
  if (model.value === 'exponential') {
    result.value = calculateExponential(N_0.value, t.value, N_1.value)
  }
  else {
    result.value = calculateLinear(N_0.value, t.value, N_1.value)
  }

  showResults.value = true
  resetChartOptions()

  nextTick(() => {
    renderEquation()
    renderChart()
  })
}

const calculateExponential = (n0, time, n1) => {
  const ratio = n1 / n0
  const lambda = -Math.log(ratio) / time

  return {
    model: 'exponential',
    equation: 'R(t) = e^(-λ * t)',
    lambda,
    reliability: Math.exp(-lambda * time),
    verificationTime: time
  }
}

const calculateLinear = (n0, time, n1) => {
  const ratio = n1 / n0
  const a = (ratio - 1) / time

  return {
    model: 'linear',
    equation: 'R(t) = a * t + 1',
    a,
    reliability: a * time + 1,
    verificationTime: time
  }
}

const renderEquation = () => {
  if (!equationDisplay.value || !result.value)
    return

  if (typeof window !== 'undefined' && window.katex) {
    if (result.value.model === 'exponential') {
      window.katex.render(`R(t) = e^{-\\lambda t} = e^{-${result.value.lambda.toExponential(6)} \\cdot t}`, equationDisplay.value, {
        throwOnError: false,
        displayMode: true
      })
    }
    else {
      window.katex.render(`R(t) = at + 1 = ${result.value.a.toExponential(6)} \\cdot t + 1`, equationDisplay.value, {
        throwOnError: false,
        displayMode: true
      })
    }
  }
  else {
    // Fallback if KaTeX not loaded
    equationDisplay.value.textContent = result.value.equation
  }
}

// Generate data points dynamically based on visible domain
const generateDataPoints = () => {
  if (!result.value)
    return []

  const verificationTime = result.value.verificationTime
  // Default max time is 3x verification time, but extend if tEnd is larger
  const defaultMaxTime = verificationTime * 3
  const maxTime = (!isNaN(tEnd.value) && tEnd.value != null && tEnd.value > defaultMaxTime)
    ? tEnd.value * 1.1 // Add 10% buffer beyond tEnd
    : defaultMaxTime

  const startTime = (!isNaN(tStart.value) && tStart.value != null && tStart.value > 0)
    ? Math.max(0, tStart.value * 0.9) // Start slightly before tStart
    : 0

  const steps = 200 // More points for smoother curves over larger ranges
  const dataPoints = []

  if (result.value.model === 'exponential') {
    const lambda = result.value.lambda
    for (let i = 0; i <= steps; i++) {
      const currentTime = startTime + ((maxTime - startTime) / steps) * i
      dataPoints.push({ x: currentTime, y: Math.exp(-lambda * currentTime) })
    }
  }
  else {
    // Linear model
    const a = result.value.a
    for (let i = 0; i <= steps; i++) {
      const currentTime = startTime + ((maxTime - startTime) / steps) * i
      const reliability = Math.max(0, a * currentTime + 1)
      dataPoints.push({ x: currentTime, y: reliability })
    }
  }

  return dataPoints
}

const renderChart = () => {
  if (!chartCanvas.value || !result.value || !Chart)
    return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const useLogScale = scaleType.value === 'logarithmic'

  // Generate data points dynamically based on visible domain
  const dataPoints = generateDataPoints()

  const yAxisConfig = useLogScale
    ? {
        type: 'logarithmic',
        display: true,
        title: {
          display: true,
          text: 'Reliability R(t) (log scale)',
          font: { size: 14 }
        },
        min: !isNaN(rVisibleStart.value) && rVisibleStart.value != null ? Math.max(0.001, rVisibleStart.value) : 0.001,
        max: !isNaN(rVisibleEnd.value) && rVisibleEnd.value != null ? rVisibleEnd.value : 1,
        ticks: {
          callback: function (value) {
            if (value === 1 || value === 0.1 || value === 0.01 || value === 0.001) {
              return value.toFixed(3)
            }
            return null
          }
        }
      }
    : {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: 'Reliability R(t)',
          font: { size: 14 }
        },
        min: !isNaN(rVisibleStart.value) && rVisibleStart.value != null ? rVisibleStart.value : 0,
        max: !isNaN(rVisibleEnd.value) && rVisibleEnd.value != null ? rVisibleEnd.value : 1.1
      }

  const xAxisConfig = {
    type: 'linear',
    display: true,
    title: {
      display: true,
      text: 'Time (t)',
      font: { size: 14 }
    },
    min: !isNaN(tStart.value) && tStart.value != null ? tStart.value : undefined,
    max: !isNaN(tEnd.value) && tEnd.value != null ? tEnd.value : undefined
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Reliability R(t)',
        data: dataPoints,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Reliability Function (${useLogScale ? 'Logarithmic Scale' : 'Linear Scale'})`,
          font: { size: 16 }
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: xAxisConfig,
        y: yAxisConfig
      }
    }
  })
}

const updateChart = () => {
  if (result.value) {
    renderChart()
  }
}

const resetChartOptions = () => {
  scaleType.value = 'linear'
  tStart.value = null
  tEnd.value = null
  rVisibleStart.value = null
  rVisibleEnd.value = null

  if (result.value) {
    nextTick(renderChart)
  }
}

const reset = () => {
  model.value = 'exponential'
  N_0.value = null
  t.value = null
  N_1.value = null
  showResults.value = false
  result.value = null
  hideError()

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

const exportJSON = () => {
  if (!result.value)
    return

  const data = {
    timestamp: new Date().toISOString(),
    input: {
      model: model.value,
      N_0: N_0.value,
      t: t.value,
      N_1: N_1.value
    },
    result: result.value
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reliability-result-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const exportPDF = () => {
  if (!result.value)
    return

  // Generate a simple text-based PDF using browser print
  // For a more sophisticated solution, jspdf could be used
  const content = `
    Reliability Calculator Results
    ==============================
    Generated: ${new Date().toLocaleString()}

    Input Parameters:
    - Model: ${result.value.model}
    - Total Number of Pieces (N₀): ${N_0.value}
    - Time of Verification (t): ${t.value}
    - Pieces Still Functional (N₁): ${N_1.value}

    Results:
    - Equation: ${result.value.equation}
    ${result.value.lambda !== undefined ? `- Failure Rate (λ): ${result.value.lambda.toExponential(6)}` : ''}
    ${result.value.a !== undefined ? `- Slope (a): ${result.value.a.toExponential(6)}` : ''}
    - Reliability at verification time: ${result.value.reliability.toFixed(8)}

    Author: Rong ZHOU
  `

  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Reliability Calculator Results</title>
        <style>
          body { font-family: 'Courier New', monospace; padding: 40px; }
          pre { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <pre>${content}</pre>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}

const handleFileSelect = () => {
  // File selected, ready for import
}

const importJSON = () => {
  const fileInput = jsonFileInput.value
  const file = fileInput?.files?.[0]

  if (!file) {
    showError(translate('reliability.errors.selectJSONFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)

      // Restore input values
      model.value = data.input.model
      N_0.value = data.input.N_0
      t.value = data.input.t
      N_1.value = data.input.N_1

      // Display results
      result.value = data.result
      showResults.value = true

      nextTick(() => {
        renderEquation()
        resetChartOptions()
        renderChart()
      })

      hideError()
    }
    catch (error) {
      showError(`${t('reliability.errors.parsingError')} ${error.message}`)
    }
  }
  reader.readAsText(file)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 20px;
}

.card {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  display: inline-block;
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: #5a6268;
}

.form-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.form-section .btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

.import-section {
  margin-top: 20px;
  padding: 20px;
  background: #fff3cd;
  border-radius: 10px;
}

.import-section h3 {
  margin-bottom: 15px;
}

.import-section input[type="file"] {
  margin-right: 10px;
}

.results {
  margin-top: 30px;
  padding: 30px;
  background: #e9ecef;
  border-radius: 10px;
}

.result-item {
  margin-bottom: 15px;
  font-size: 1.1em;
}

.result-label {
  font-weight: 600;
  color: #667eea;
}

.equation-display {
  font-size: 1.2em;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin: 10px 0;
}

.chart-options {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.chart-options h3 {
  margin-bottom: 15px;
  color: #667eea;
}

.chart-options h4 {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 1em;
}

.scale-toggle {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.scale-toggle label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.range-inputs {
  margin-top: 15px;
}

.range-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.range-group label {
  font-size: 0.9em;
}

.chart-container {
  position: relative;
  height: 400px;
  margin-top: 30px;
}

.export-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
