"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReliabilityCalculatorService = void 0;
const common_1 = require("@nestjs/common");
let ReliabilityCalculatorService = class ReliabilityCalculatorService {
    calculateReliability(input) {
        const { model, N_0, t, N_1 } = input;
        if (model === 'exponential') {
            return this.calculateExponential(N_0, t, N_1);
        }
        else {
            return this.calculateLinear(N_0, t, N_1);
        }
    }
    calculateExponential(N_0, t, N_1) {
        const ratio = N_1 / N_0;
        const lambda = -Math.log(ratio) / t;
        const maxTime = t * 3;
        const steps = 100;
        const labels = [];
        const values = [];
        for (let i = 0; i <= steps; i++) {
            const time = (maxTime / steps) * i;
            labels.push(time);
            values.push(Math.exp(-lambda * time));
        }
        return {
            model: 'exponential',
            equation: 'R(t) = e^(-λ * t)',
            lambda: lambda,
            reliability: Math.exp(-lambda * t),
            chartData: { labels, values },
        };
    }
    calculateLinear(N_0, t, N_1) {
        const ratio = N_1 / N_0;
        const a = (ratio - 1) / t;
        const maxTime = t * 3;
        const steps = 100;
        const labels = [];
        const values = [];
        for (let i = 0; i <= steps; i++) {
            const time = (maxTime / steps) * i;
            const reliability = Math.max(0, a * time + 1);
            labels.push(time);
            values.push(reliability);
        }
        return {
            model: 'linear',
            equation: 'R(t) = a * t + 1',
            a: a,
            reliability: a * t + 1,
            chartData: { labels, values },
        };
    }
    generateChartImage(result) {
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
};
exports.ReliabilityCalculatorService = ReliabilityCalculatorService;
exports.ReliabilityCalculatorService = ReliabilityCalculatorService = __decorate([
    (0, common_1.Injectable)()
], ReliabilityCalculatorService);
//# sourceMappingURL=reliability-calculator.service.js.map