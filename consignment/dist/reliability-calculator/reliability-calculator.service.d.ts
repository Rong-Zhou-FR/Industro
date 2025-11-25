export interface ReliabilityInput {
    model: 'exponential' | 'linear';
    N_0: number;
    t: number;
    N_1: number;
}
export interface ReliabilityResult {
    model: 'exponential' | 'linear';
    equation: string;
    lambda?: number;
    a?: number;
    reliability: number;
    chartData: {
        labels: number[];
        values: number[];
    };
}
export declare class ReliabilityCalculatorService {
    calculateReliability(input: ReliabilityInput): ReliabilityResult;
    private calculateExponential;
    private calculateLinear;
    generateChartImage(result: ReliabilityResult): string;
}
