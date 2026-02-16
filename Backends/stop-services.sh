#!/bin/bash

# Discord Alternative Backend Services Stop Script
# Bu script tüm backend servislerini durdurur

set -e

echo "🛑 Discord Alternative Backend Servisleri Durduruluyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script dizini
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# PID dosyası varsa servisleri durdur
if [ -f ".pids" ]; then
    echo -e "${YELLOW}📋 Kayıtlı PID'lerden servisler durduruluyor...${NC}"
    source .pids
    
    # Her PID'i durdur
    for pid in $AUTH_SERVICE $USER_SERVICE $GUILD_SERVICE $MESSAGE_SERVICE $WEBSOCKET_GATEWAY $SFU_SERVICE $API_GATEWAY; do
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${RED}  Stopping PID: $pid${NC}"
            kill -9 $pid 2>/dev/null || true
        fi
    done
    
    rm -f .pids
    echo -e "${GREEN}✅ PID dosyasından servisler durduruldu${NC}"
fi

# Port'lardaki tüm Bun process'lerini durdur
echo -e "${YELLOW}🔍 Port'lardaki servisleri durduruluyor...${NC}"

for port in 3001 3002 3003 3004 3006 3007 3100; do
    pid=$(lsof -ti:$port 2>/dev/null || echo "")
    if [ -n "$pid" ]; then
        echo -e "${RED}  Port $port (PID $pid) durduruluyor...${NC}"
        kill -9 $pid 2>/dev/null || true
    fi
done

# Tüm Bun backend process'lerini durdur
echo -e "${YELLOW}🧹 Kalan Bun process'leri temizleniyor...${NC}"
pkill -9 -f "bun.*src/index.ts" 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Tüm backend servisleri durduruldu!${NC}"
echo ""
echo -e "${YELLOW}💡 Docker container'ları durdurmak için: docker-compose down${NC}"
echo ""
