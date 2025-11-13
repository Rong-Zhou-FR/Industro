import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { WelcomeService } from './welcome.service';

@Controller()
export class WelcomeController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Get()
  getWelcome(@Res() res: Response) {
    const welcomeInfo = this.welcomeService.getWelcomeInfo();
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${welcomeInfo.title}</title>
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
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      max-width: 600px;
      width: 100%;
      text-align: center;
    }
    h1 {
      color: #667eea;
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .author {
      color: #666;
      font-size: 1.2em;
      margin-bottom: 30px;
      font-style: italic;
    }
    .datetime {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin: 30px 0;
    }
    .datetime h3 {
      color: #333;
      margin-bottom: 10px;
    }
    .datetime p {
      color: #666;
      font-size: 1.1em;
      margin: 5px 0;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 30px;
    }
    .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      border-radius: 10px;
      text-decoration: none;
      font-size: 1.1em;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
      display: block;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .description {
      color: #666;
      margin: 20px 0;
      line-height: 1.6;
    }
    .clock {
      font-size: 2em;
      font-weight: bold;
      color: #667eea;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${welcomeInfo.title}</h1>
    <p class="author">by ${welcomeInfo.author}</p>
    <p class="description">${welcomeInfo.description}</p>
    
    <div class="datetime">
      <h3>Current Date & Time</h3>
      <p id="date">${welcomeInfo.currentDateTime.date}</p>
      <p class="clock" id="time">${welcomeInfo.currentDateTime.time}</p>
    </div>
    
    <div class="buttons">
      <a href="/api/reliability/calculator" class="btn">🔧 Reliability Calculator</a>
    </div>
  </div>

  <script>
    function updateTime() {
      const now = new Date();
      const timeElement = document.getElementById('time');
      timeElement.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    }
    setInterval(updateTime, 1000);
  </script>
</body>
</html>
    `);
  }

  @Get('api/welcome/info')
  getWelcomeInfo() {
    return this.welcomeService.getWelcomeInfo();
  }
}
