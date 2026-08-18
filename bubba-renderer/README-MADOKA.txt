Bubba/ECS renderer for Madoka
=============================
Website CommandHandler talks to ws://localhost:3189 (Render:BaseUrl).
This process is that server. It sends SOAP to RCC and returns PNG base64.
The website then writes api/public/images/thumbnails/{hash}_*.png.

PowerShell:
  cd C:\Users\Administrator\madoka\bubba-renderer
  powershell -File START.ps1

Leave it open. Also keep:
  - website:  dotnet run -c Release
  - RCC:      RCCService.exe -Console -Port 2621
  - tunnel + QuietGet 200 (or RCC crash-loops)

Do NOT use game-renderer (7832) for site avatars. This replaces that path.
Stop render-ws-bridge.js if it is bound to 3189.
