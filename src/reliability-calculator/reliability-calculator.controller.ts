import { Controller, Get, Post, Body, Res, Query, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ReliabilityCalculatorService, ReliabilityInput, ReliabilityResult } from './reliability-calculator.service';
import * as PDFDocument from 'pdfkit';

@Controller('api/reliability')
export class ReliabilityCalculatorController {
  constructor(private readonly calculatorService: ReliabilityCalculatorService) {}

  @Get('calculator')
  getCalculator(@Res() res: Response) {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reliability Calculator - Industrial Engineering Tools</title>
  <script src="/js/chart.umd.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
    }
    h1 {
      color: #667eea;
      font-size: 2.5em;
      margin-bottom: 10px;
      text-align: center;
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
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
    }
    input, select {
      width: 100%;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 5px;
      font-size: 1em;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
    }
    .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 1.1em;
      font-weight: 600;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .btn-secondary {
      background: #6c757d;
    }
    .btn-secondary:hover {
      background: #5a6268;
    }
    .results {
      margin-top: 30px;
      padding: 30px;
      background: #e9ecef;
      border-radius: 10px;
      display: none;
    }
    .results.show {
      display: block;
    }
    .result-item {
      margin-bottom: 15px;
      font-size: 1.1em;
    }
    .result-label {
      font-weight: 600;
      color: #667eea;
    }
    .chart-container {
      position: relative;
      height: 400px;
      margin-top: 30px;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      display: none;
    }
    .error.show {
      display: block;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .import-section {
      margin-top: 20px;
      padding: 20px;
      background: #fff3cd;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-btn">← Back to Home</a>
    <h1>🔧 Reliability Calculator</h1>
    
    <div class="error" id="error"></div>
    
    <div class="form-section">
      <h2>Input Parameters</h2>
      <div class="grid">
        <div class="form-group">
          <label for="model">Model Selection:</label>
          <select id="model">
            <option value="exponential">Exponential: R(t) = e^(-λt)</option>
            <option value="linear">Linear: R(t) = at + 1</option>
          </select>
        </div>
        <div class="form-group">
          <label for="N_0">Total Number of Pieces (N₀):</label>
          <input type="number" id="N_0" min="1" step="1" required>
        </div>
        <div class="form-group">
          <label for="t">Time of Verification (t):</label>
          <input type="number" id="t" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="N_1">Pieces Still Functional (N₁):</label>
          <input type="number" id="N_1" min="0" step="1" required>
        </div>
      </div>
      <button class="btn" onclick="calculate()">Calculate Reliability</button>
      <button class="btn btn-secondary" onclick="reset()">Reset</button>
    </div>
    
    <div class="import-section">
      <h3>Import Previous Results</h3>
      <input type="file" id="jsonFile" accept=".json">
      <button class="btn" onclick="importJSON()">Import JSON</button>
    </div>
    
    <div class="results" id="results">
      <h2>Results</h2>
      <div id="resultContent"></div>
      <div class="chart-container">
        <canvas id="chart"></canvas>
      </div>
      <div style="margin-top: 20px;">
        <button class="btn" onclick="exportJSON()">Export as JSON</button>
        <button class="btn" onclick="exportPDF()">Export as PDF</button>
      </div>
    </div>
  </div>

  <script>
    let currentResult = null;
    let chart = null;

    async function calculate() {
      const model = document.getElementById('model').value;
      const N_0 = parseFloat(document.getElementById('N_0').value);
      const t = parseFloat(document.getElementById('t').value);
      const N_1 = parseFloat(document.getElementById('N_1').value);

      if (!N_0 || !t || N_1 === undefined) {
        showError('Please fill in all fields');
        return;
      }

      if (N_1 > N_0) {
        showError('N₁ cannot be greater than N₀');
        return;
      }

      hideError();

      try {
        const response = await fetch('/api/reliability/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, N_0, t, N_1 })
        });

        const result = await response.json();
        currentResult = result;
        displayResults(result);
      } catch (error) {
        showError('Error calculating reliability: ' + error.message);
      }
    }

    function displayResults(result) {
      const content = document.getElementById('resultContent');
      let html = \`
        <div class="result-item">
          <span class="result-label">Model:</span> \${result.model.charAt(0).toUpperCase() + result.model.slice(1)}
        </div>
        <div class="result-item">
          <span class="result-label">Equation:</span> \${result.equation}
        </div>
      \`;

      if (result.lambda !== undefined) {
        html += \`
          <div class="result-item">
            <span class="result-label">Failure Rate (λ):</span> \${result.lambda}
          </div>
        \`;
      }

      if (result.a !== undefined) {
        html += \`
          <div class="result-item">
            <span class="result-label">Slope (a):</span> \${result.a}
          </div>
        \`;
      }

      html += \`
        <div class="result-item">
          <span class="result-label">Reliability at verification time:</span> \${result.reliability}
        </div>
      \`;

      content.innerHTML = html;
      document.getElementById('results').classList.add('show');

      renderChart(result);
    }

    function renderChart(result) {
      const ctx = document.getElementById('chart');
      
      if (chart) {
        chart.destroy();
      }

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: result.chartData.labels,
          datasets: [{
            label: 'Reliability R(t)',
            data: result.chartData.values,
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
              text: \`Reliability Function: \${result.equation}\`,
              font: { size: 16 }
            },
            legend: {
              display: true,
              position: 'top',
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time (t)',
                font: { size: 14 }
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Reliability R(t)',
                font: { size: 14 }
              },
              min: 0,
              max: 1.1
            }
          }
        }
      });
    }

    function exportJSON() {
      if (!currentResult) return;

      const data = {
        timestamp: new Date().toISOString(),
        input: {
          model: document.getElementById('model').value,
          N_0: parseFloat(document.getElementById('N_0').value),
          t: parseFloat(document.getElementById('t').value),
          N_1: parseFloat(document.getElementById('N_1').value)
        },
        result: currentResult
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`reliability-result-\${new Date().getTime()}.json\`;
      a.click();
    }

    async function exportPDF() {
      if (!currentResult) return;

      const data = {
        input: {
          model: document.getElementById('model').value,
          N_0: parseFloat(document.getElementById('N_0').value),
          t: parseFloat(document.getElementById('t').value),
          N_1: parseFloat(document.getElementById('N_1').value)
        },
        result: currentResult
      };

      try {
        const response = await fetch('/api/reliability/export-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`reliability-result-\${new Date().getTime()}.pdf\`;
        a.click();
      } catch (error) {
        showError('Error exporting PDF: ' + error.message);
      }
    }

    function importJSON() {
      const fileInput = document.getElementById('jsonFile');
      const file = fileInput.files[0];

      if (!file) {
        showError('Please select a JSON file');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          
          // Restore input values
          document.getElementById('model').value = data.input.model;
          document.getElementById('N_0').value = data.input.N_0;
          document.getElementById('t').value = data.input.t;
          document.getElementById('N_1').value = data.input.N_1;
          
          // Display results
          currentResult = data.result;
          displayResults(data.result);
          
          hideError();
        } catch (error) {
          showError('Error parsing JSON file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }

    function reset() {
      document.getElementById('N_0').value = '';
      document.getElementById('t').value = '';
      document.getElementById('N_1').value = '';
      document.getElementById('model').value = 'exponential';
      document.getElementById('results').classList.remove('show');
      hideError();
      currentResult = null;
      if (chart) {
        chart.destroy();
        chart = null;
      }
    }

    function showError(message) {
      const errorDiv = document.getElementById('error');
      errorDiv.textContent = message;
      errorDiv.classList.add('show');
    }

    function hideError() {
      const errorDiv = document.getElementById('error');
      errorDiv.classList.remove('show');
    }
  </script>
</body>
</html>
    `);
  }

  @Post('calculate')
  calculate(@Body() input: ReliabilityInput): ReliabilityResult {
    // Validate input
    if (!input.N_0 || !input.t || input.N_1 === undefined) {
      throw new HttpException('Missing required parameters', HttpStatus.BAD_REQUEST);
    }

    if (input.N_1 > input.N_0) {
      throw new HttpException('N_1 cannot be greater than N_0', HttpStatus.BAD_REQUEST);
    }

    if (input.N_0 <= 0 || input.t <= 0) {
      throw new HttpException('N_0 and t must be positive', HttpStatus.BAD_REQUEST);
    }

    return this.calculatorService.calculateReliability(input);
  }

  @Post('export-pdf')
  async exportPDF(@Body() data: any, @Res() res: Response) {
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reliability-result.pdf');
    
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Reliability Calculator Results', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(16).text('Input Parameters:', { underline: true });
    doc.fontSize(12).text(`Model: ${data.input.model}`);
    doc.text(`Total Number of Pieces (N₀): ${data.input.N_0}`);
    doc.text(`Time of Verification (t): ${data.input.t}`);
    doc.text(`Pieces Still Functional (N₁): ${data.input.N_1}`);
    doc.moveDown();

    doc.fontSize(16).text('Results:', { underline: true });
    doc.fontSize(12).text(`Equation: ${data.result.equation}`);
    
    if (data.result.lambda !== undefined) {
      doc.text(`Failure Rate (λ): ${data.result.lambda}`);
    }
    
    if (data.result.a !== undefined) {
      doc.text(`Slope (a): ${data.result.a}`);
    }
    
    doc.text(`Reliability at verification time: ${data.result.reliability}`);
    doc.moveDown();

    doc.fontSize(12).text('Author: Rong ZHOU', { align: 'center' });

    doc.end();
  }
}
