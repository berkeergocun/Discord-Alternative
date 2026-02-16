@echo off
REM Discord Alternative Backend Services Stop Script (Windows)
REM Bu script tüm backend servislerini durdurur

echo ========================================
echo Discord Alternative Backend Servisleri
echo Durduruluyor...
echo ========================================
echo.

REM Port'lardaki process'leri durdur
echo [Stop] Port'lardaki servisler durduruluyor...

FOR %%p IN (3001 3002 3003 3004 3006 3007 3100) DO (
    FOR /F "tokens=5" %%a IN ('netstat -ano ^| findstr :%%p ^| findstr LISTENING') DO (
        echo [Kill] Port %%p (PID %%a) durduruluyor...
        taskkill /F /PID %%a > nul 2>&1
    )
)

REM Tüm Bun process'lerini durdur
echo [Clean] Kalan Bun process'leri temizleniyor...
taskkill /F /IM bun.exe > nul 2>&1

echo.
echo ========================================
echo Tum backend servisleri durduruldu!
echo ========================================
echo.
echo Docker container'lari durdurmak icin: docker-compose down
echo.
pause
