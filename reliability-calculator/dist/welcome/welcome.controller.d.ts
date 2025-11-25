import { Response } from 'express';
import { WelcomeService } from './welcome.service';
export declare class WelcomeController {
    private readonly welcomeService;
    constructor(welcomeService: WelcomeService);
    getWelcome(res: Response): void;
    getWelcomeInfo(): {
        title: string;
        author: string;
        description: string;
        currentDateTime: {
            date: string;
            time: string;
            timestamp: string;
        };
    };
}
