#!/bin/bash

# Discord Alternative Backend Services Startup Script
# Bu script tüm backend servislerini başlatır

set -e

echo "🚀 Discord Alternative Backend Servisleri Başlatılıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Script dizini
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Log dizini oluştur
mkdir -p logs

# Docker container'ları başlat
echo -e "${BLUE}📦 Docker container'ları başlatılıyor...${NC}"
docker-compose up -d

# Container'ların hazır olmasını bekle
echo -e "${YELLOW}⏳ Container'ların hazır olması bekleniyor...${NC}"
sleep 5

# Container durumlarını kontrol et
echo -e "${BLUE}🔍 Container durumları:${NC}"
docker-compose ps

echo ""
echo -e "${BLUE}🎯 Backend servisleri başlatılıyor...${NC}"
echo ""

# Auth Service (Port 3001)
echo -e "${GREEN}▶ Auth Service başlatılıyor (Port 3001)...${NC}"
cd auth-service
nohup bun src/index.ts > ../logs/auth-service.log 2>&1 &
AUTH_PID=$!
echo "  PID: $AUTH_PID"
cd ..
sleep 2

# User Service (Port 3002)
echo -e "${GREEN}▶ User Service başlatılıyor (Port 3002)...${NC}"
cd user-service
nohup bun src/index.ts > ../logs/user-service.log 2>&1 &
USER_PID=$!
echo "  PID: $USER_PID"
cd ..
sleep 2

# Guild Service (Port 3003)
echo -e "${GREEN}▶ Guild Service başlatılıyor (Port 3003)...${NC}"
cd guild-service
nohup bun src/index.ts > ../logs/guild-service.log 2>&1 &
GUILD_PID=$!
echo "  PID: $GUILD_PID"
cd ..
sleep 2

# Message Service (Port 3004)
echo -e "${GREEN}▶ Message Service başlatılıyor (Port 3004)...${NC}"
cd message-service
nohup bun src/index.ts > ../logs/message-service.log 2>&1 &
MESSAGE_PID=$!
echo "  PID: $MESSAGE_PID"
cd ..
sleep 2

# WebSocket Gateway (Port 3006)
echo -e "${GREEN}▶ WebSocket Gateway başlatılıyor (Port 3006)...${NC}"
cd websocket-gateway
nohup bun src/index.ts > ../logs/websocket-gateway.log 2>&1 &
WS_PID=$!
echo "  PID: $WS_PID"
cd ..
sleep 2

# SFU Service (Port 3007)
echo -e "${GREEN}▶ SFU Service başlatılıyor (Port 3007)...${NC}"
cd sfu-service
nohup bun src/index.ts > ../logs/sfu-service.log 2>&1 &
SFU_PID=$!
echo "  PID: $SFU_PID"
cd ..
sleep 2

# API Gateway (Port 3100)
echo -e "${GREEN}▶ API Gateway başlatılıyor (Port 3100)...${NC}"
cd api-gateway
nohup bun src/index.ts > ../logs/api-gateway.log 2>&1 &
GATEWAY_PID=$!
echo "  PID: $GATEWAY_PID"
cd ..
sleep 3

echo ""
echo -e "${BLUE}🔍 Servis durumlarını kontrol ediliyor...${NC}"
echo ""

# Health check fonksiyonu
check_service() {
    local port=$1
    local name=$2
    
    response=$(curl -s http://localhost:$port/health 2>/dev/null || echo "")
    
    if [ -n "$response" ]; then
        echo -e "${GREEN}✅ Port $port: $name - RUNNING${NC}"
        return 0
    else
        echo -e "${RED}❌ Port $port: $name - FAILED${NC}"
        return 1
    fi
}

# Her servisin sağlığını kontrol et
check_service 3001 "Auth Service"
check_service 3002 "User Service"
check_service 3003 "Guild Service"
check_service 3004 "Message Service"
check_service 3006 "WebSocket Gateway"
check_service 3007 "SFU Service"
check_service 3100 "API Gateway"

echo ""
echo -e "${BLUE}📊 PID'ler kaydediliyor...${NC}"

# PID'leri dosyaya kaydet
cat > .pids << EOF
AUTH_SERVICE=$AUTH_PID
USER_SERVICE=$USER_PID
GUILD_SERVICE=$GUILD_PID
MESSAGE_SERVICE=$MESSAGE_PID
WEBSOCKET_GATEWAY=$WS_PID
SFU_SERVICE=$SFU_PID
API_GATEWAY=$GATEWAY_PID
EOF

echo ""
echo -e "${GREEN}✨ Tüm servisler başarıyla başlatıldı!${NC}"
echo ""
echo -e "${BLUE}📚 Erişim Adresleri:${NC}"
echo ""
echo "  🌐 API Gateway:        http://localhost:3100"
echo "  📖 Unified Swagger:    http://localhost:3100/swagger"
echo "  💚 Health Check:       http://localhost:3100/health"
echo ""
echo "  🔐 Auth Service:       http://localhost:3001/swagger"
echo "  👤 User Service:       http://localhost:3002/swagger"
echo "  🏰 Guild Service:      http://localhost:3003/swagger"
echo "  💬 Message Service:    http://localhost:3004/swagger"
echo "  🔌 WebSocket Gateway:  http://localhost:3006/swagger"
echo "  🎙️  SFU Service:        http://localhost:3007/swagger"
echo ""
echo "  🐰 RabbitMQ UI:        http://localhost:15672 (discord_user / discord_pass)"
echo "  🔍 Traefik Dashboard:  http://localhost:8081"
echo ""
echo -e "${YELLOW}💡 Servisleri durdurmak için: ./stop-services.sh${NC}"
echo -e "${YELLOW}📋 Logları görmek için: tail -f logs/<service-name>.log${NC}"
echo ""
