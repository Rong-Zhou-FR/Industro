"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeService = void 0;
const common_1 = require("@nestjs/common");
let WelcomeService = class WelcomeService {
    getCurrentDateTime() {
        const now = new Date();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return {
            date: `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            timestamp: now.toISOString(),
        };
    }
    getWelcomeInfo() {
        return {
            title: 'Industrial Engineering Tools',
            author: 'Rong ZHOU',
            description: 'A comprehensive tool for industrial engineering calculations',
            currentDateTime: this.getCurrentDateTime(),
        };
    }
};
exports.WelcomeService = WelcomeService;
exports.WelcomeService = WelcomeService = __decorate([
    (0, common_1.Injectable)()
], WelcomeService);
//# sourceMappingURL=welcome.service.js.map