import { Injectable } from '@nestjs/common';

@Injectable()
export class WelcomeService {
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
}
