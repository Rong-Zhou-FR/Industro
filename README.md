# Industrial Engineering Tools

A comprehensive Nest.js web application for industrial engineering calculations, built by Rong ZHOU.

## Features

### Welcome Screen
- Displays the application title: "Industrial Engineering Tools"
- Shows current date and time (updates in real-time)
- Navigation to other screens
- Author information

### Reliability Calculator
- **Model Selection**: Choose between two reliability models:
  - **Exponential Model**: R(t) = e^(-λt)
  - **Linear Model**: R(t) = at + 1
- **Input Parameters**:
  - N₀: Total number of pieces
  - t: Time of verification
  - N₁: Number of pieces still functional
- **Calculations**:
  - Automatically calculates reliability equation parameters
  - Computes reliability at verification time
  - Generates interactive chart visualization
- **Export/Import**:
  - Export results as JSON
  - Export results as PDF
  - Import previous JSON results

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm start

# Start in development mode with hot reload
npm run start:dev
```

## Usage

1. Start the application:
   ```bash
   npm run start:dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. From the welcome screen, click on "Reliability Calculator" to access the calculator

4. Select your preferred model (Exponential or Linear)

5. Enter the input parameters:
   - Total number of pieces (N₀)
   - Time of verification (t)
   - Number of pieces still functional (N₁)

6. Click "Calculate Reliability" to see results and interactive chart

7. Export your results as JSON or PDF for future reference

8. Import previous JSON results to view historical calculations

## Technology Stack

- **Framework**: Nest.js
- **Language**: TypeScript
- **Charting**: Chart.js
- **PDF Generation**: PDFKit
- **Validation**: class-validator, class-transformer

## Author

Rong ZHOU

## License

ISC
