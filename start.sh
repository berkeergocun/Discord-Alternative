#!/bin/bash
# DiscordAlternative — Tek komutla başlat
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "🐳 Docker konteynerler başlatılıyor..."
cd "$ROOT/Backends"
docker-compose up -d

echo "⏳ MongoDB hazır bekleniyor..."
for i in $(seq 1 20); do
  nc -z -w1 localhost 27017 2>/dev/null && break
  sleep 1
done
nc -z -w1 localhost 27017 2>/dev/null || { echo "❌ MongoDB başlamadı!"; exit 1; }
echo "✅ MongoDB hazır"

# Eski process'leri temizle
kill -9 $(lsof -ti:3001) 2>/dev/null || true
kill -9 $(lsof -ti:3002) 2>/dev/null || true
kill -9 $(lsof -ti:3004) 2>/dev/null || true
kill -9 $(lsof -ti:3000) 2>/dev/null || true
sleep 1

echo "🔑 Auth servisi başlatılıyor (3001)..."
cd "$ROOT/Backends/auth-service" && bun run src/index.ts > /tmp/auth-svc.log 2>&1 &

echo "👤 User servisi başlatılıyor (3002)..."
cd "$ROOT/Backends/user-service" && bun run src/index.ts > /tmp/user-svc.log 2>&1 &

echo "💬 Message servisi başlatılıyor (3004)..."
cd "$ROOT/Backends/message-service" && bun run src/index.ts > /tmp/msg-svc.log 2>&1 &

echo "🌐 Frontend başlatılıyor (3000)..."
cd "$ROOT/Web" && HOST=127.0.0.1 PORT=3000 bun run dev > /tmp/nuxt.log 2>&1 &

echo "⏳ Servisler hazır bekleniyor..."
sleep 5

OK=true
for port in 3001 3002 3004 3000; do
  if nc -z -w2 localhost $port 2>/dev/null; then
    echo "  ✅ Port $port OK"
  else
    echo "  ❌ Port $port FAIL"
    OK=false
  fi
done

if $OK; then
  echo ""
  echo "🚀 Tüm servisler hazır!"
  echo "   Frontend: http://localhost:3000"
  echo "   API:      http://localhost/api/v1"
  echo "   WebSocket: ws://localhost/ws"
else
  echo ""
  echo "⚠️  Bazı servisler başlamadı. Loglar:"
  echo "   Auth:    cat /tmp/auth-svc.log"
  echo "   User:    cat /tmp/user-svc.log"
  echo "   Message: cat /tmp/msg-svc.log"
  echo "   Nuxt:    cat /tmp/nuxt.log"
fi
