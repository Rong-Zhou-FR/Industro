import { Response } from 'express';
import { ReliabilityCalculatorService, ReliabilityInput, ReliabilityResult } from './reliability-calculator.service';
export declare class ReliabilityCalculatorController {
    private readonly calculatorService;
    constructor(calculatorService: ReliabilityCalculatorService);
    getCalculator(res: Response): void;
    calculate(input: ReliabilityInput): ReliabilityResult;
    exportPDF(data: any, res: Response): Promise<void>;
}
