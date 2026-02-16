@echo off
REM Discord Alternative Backend Services Startup Script (Windows)
REM Bu script tüm backend servislerini başlatır

echo ========================================
echo Discord Alternative Backend Servisleri
echo Baslatiliyor...
echo ========================================
echo.

REM Script dizini
cd /d "%~dp0"

REM Log dizini oluştur
if not exist "logs" mkdir logs

REM Docker container'ları başlat
echo [Docker] Container'lar baslatiliyor...
docker-compose up -d

REM Container'ların hazır olmasını bekle
echo [Wait] Container'larin hazir olmasi bekleniyor...
timeout /t 5 /nobreak > nul

REM Container durumlarını kontrol et
echo.
echo [Info] Container durumlari:
docker-compose ps
echo.

echo [Start] Backend servisleri baslatiliyor...
echo.

REM Auth Service (Port 3001)
echo [Auth] Auth Service baslatiliyor (Port 3001)...
cd auth-service
start /B bun src/index.ts > ..\logs\auth-service.log 2>&1
cd ..
timeout /t 2 /nobreak > nul

REM User Service (Port 3002)
echo [User] User Service baslatiliyor (Port 3002)...
cd user-service
start /B bun src/index.ts > ..\logs\user-service.log 2>&1
cd ..
timeout /t 2 /nobreak > nul

REM Guild Service (Port 3003)
echo [Guild] Guild Service baslatiliyor (Port 3003)...
cd guild-service
start /B bun src/index.ts > ..\logs\guild-service.log 2>&1
cd ..
timeout /t 2 /nobreak > nul

REM Message Service (Port 3004)
echo [Message] Message Service baslatiliyor (Port 3004)...
cd message-service
start /B bun src/index.ts > ..\logs\message-service.log 2>&1
cd ..
timeout /t 2 /nobreak > nul

REM WebSocket Gateway (Port 3006)
echo [WebSocket] WebSocket Gateway baslatiliyor (Port 3006)...
cd websocket-gateway
start /B bun src/index.ts > ..\logs\websocket-gateway.log 2>&1
cd ..
timeout /t 2 /nobreak > nul

REM SFU Service (Port 3007)
echo [SFU] SFU Service baslatiliyor (Port 3007)...
cd sfu-service
start /B bun src/index.ts > ..\logs\sfu-service.log 2>&1
cd ..
timeout /t 2 /nobreak > nul

REM API Gateway (Port 3100)
echo [Gateway] API Gateway baslatiliyor (Port 3100)...
cd api-gateway
start /B bun src/index.ts > ..\logs\api-gateway.log 2>&1
cd ..
timeout /t 3 /nobreak > nul

echo.
echo [Check] Servis durumlari kontrol ediliyor...
echo.

REM Health check
curl -s http://localhost:3001/health > nul 2>&1 && (
    echo [OK] Port 3001: Auth Service - RUNNING
) || (
    echo [FAIL] Port 3001: Auth Service - FAILED
)

curl -s http://localhost:3002/health > nul 2>&1 && (
    echo [OK] Port 3002: User Service - RUNNING
) || (
    echo [FAIL] Port 3002: User Service - FAILED
)

curl -s http://localhost:3003/health > nul 2>&1 && (
    echo [OK] Port 3003: Guild Service - RUNNING
) || (
    echo [FAIL] Port 3003: Guild Service - FAILED
)

curl -s http://localhost:3004/health > nul 2>&1 && (
    echo [OK] Port 3004: Message Service - RUNNING
) || (
    echo [FAIL] Port 3004: Message Service - FAILED
)

curl -s http://localhost:3006/health > nul 2>&1 && (
    echo [OK] Port 3006: WebSocket Gateway - RUNNING
) || (
    echo [FAIL] Port 3006: WebSocket Gateway - FAILED
)

curl -s http://localhost:3007/health > nul 2>&1 && (
    echo [OK] Port 3007: SFU Service - RUNNING
) || (
    echo [FAIL] Port 3007: SFU Service - FAILED
)

curl -s http://localhost:3100/health > nul 2>&1 && (
    echo [OK] Port 3100: API Gateway - RUNNING
) || (
    echo [FAIL] Port 3100: API Gateway - FAILED
)

echo.
echo ========================================
echo Tum servisler basariyla baslatildi!
echo ========================================
echo.
echo Erisim Adresleri:
echo.
echo   API Gateway:        http://localhost:3100
echo   Unified Swagger:    http://localhost:3100/swagger
echo   Health Check:       http://localhost:3100/health
echo.
echo   Auth Service:       http://localhost:3001/swagger
echo   User Service:       http://localhost:3002/swagger
echo   Guild Service:      http://localhost:3003/swagger
echo   Message Service:    http://localhost:3004/swagger
echo   WebSocket Gateway:  http://localhost:3006/swagger
echo   SFU Service:        http://localhost:3007/swagger
echo.
echo   RabbitMQ UI:        http://localhost:15672
echo   Traefik Dashboard:  http://localhost:8081
echo.
echo Servisleri durdurmak icin: stop-services.bat
echo.
pause
