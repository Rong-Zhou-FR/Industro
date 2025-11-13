import { Injectable } from '@nestjs/common';

export interface ReliabilityInput {
  model: 'exponential' | 'linear';
  N_0: number; // Total number of pieces
  t: number;   // Time of verification
  N_1: number; // Number of pieces still functional
}

export interface ReliabilityResult {
  model: 'exponential' | 'linear';
  equation: string;
  lambda?: number; // For exponential model
  a?: number;      // For linear model
  reliability: number;
  chartData: {
    labels: number[];
    values: number[];
  };
}

@Injectable()
export class ReliabilityCalculatorService {
  
  calculateReliability(input: ReliabilityInput): ReliabilityResult {
    const { model, N_0, t, N_1 } = input;

    if (model === 'exponential') {
      return this.calculateExponential(N_0, t, N_1);
    } else {
      return this.calculateLinear(N_0, t, N_1);
    }
  }

  private calculateExponential(N_0: number, t: number, N_1: number): ReliabilityResult {
    // R(t) = e^(-λt)
    // At time t: N_1 = N_0 * e^(-λt)
    // Therefore: λ = -ln(N_1/N_0) / t
    
    const ratio = N_1 / N_0;
    const lambda = -Math.log(ratio) / t;
    
    // Generate chart data
    const maxTime = t * 3; // Show data up to 3 times the verification time
    const steps = 100;
    const labels: number[] = [];
    const values: number[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const time = (maxTime / steps) * i;
      labels.push(parseFloat(time.toFixed(2)));
      values.push(parseFloat(Math.exp(-lambda * time).toFixed(4)));
    }

    return {
      model: 'exponential',
      equation: `R(t) = e^(-${lambda.toFixed(6)} * t)`,
      lambda: parseFloat(lambda.toFixed(6)),
      reliability: parseFloat(Math.exp(-lambda * t).toFixed(4)),
      chartData: { labels, values },
    };
  }

  private calculateLinear(N_0: number, t: number, N_1: number): ReliabilityResult {
    // R(t) = a * t + 1 (assuming R(0) = 1)
    // At time t: N_1/N_0 = a * t + 1
    // Therefore: a = (N_1/N_0 - 1) / t
    
    const ratio = N_1 / N_0;
    const a = (ratio - 1) / t;
    
    // Generate chart data
    const maxTime = t * 3;
    const steps = 100;
    const labels: number[] = [];
    const values: number[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const time = (maxTime / steps) * i;
      const reliability = Math.max(0, a * time + 1); // Ensure non-negative
      labels.push(parseFloat(time.toFixed(2)));
      values.push(parseFloat(reliability.toFixed(4)));
    }

    return {
      model: 'linear',
      equation: `R(t) = ${a.toFixed(6)} * t + 1`,
      a: parseFloat(a.toFixed(6)),
      reliability: parseFloat((a * t + 1).toFixed(4)),
      chartData: { labels, values },
    };
  }

  generateChartImage(result: ReliabilityResult): string {
    // Return chart configuration for client-side rendering
    return JSON.stringify({
      type: 'line',
      data: {
        labels: result.chartData.labels,
        datasets: [{
          label: 'Reliability R(t)',
          data: result.chartData.values,
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Reliability Function: ${result.equation}`
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
              text: 'Time (t)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Reliability R(t)'
            },
            min: 0,
            max: 1
          }
        }
      }
    });
  }
}
