import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

const PORT = parseInt(process.env.API_GATEWAY_PORT || '3100');

const services = [
  { name: 'Auth Service', port: 3001, path: '/auth', description: 'Authentication & Authorization' },
  { name: 'User Service', port: 3002, path: '/users', description: 'User profiles, friends, presence' },
  { name: 'Guild Service', port: 3003, path: '/guilds', description: 'Servers, channels, roles' },
  { name: 'Message Service', port: 3004, path: '/messages', description: 'Messages, reactions, DMs' },
  { name: 'WebSocket Gateway', port: 3006, path: '/ws', description: 'Real-time events' },
  { name: 'SFU Service', port: 3007, path: '/voice', description: 'Voice & video streaming' },
];

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: 'Discord Alternative - Unified API Documentation',
        version: '1.0.0',
        description: `
# Discord Alternative Platform API

Tüm mikroservislerin birleşik API dokümantasyonu.

## Servisler

${services.map(s => `- **${s.name}** (Port ${s.port}): ${s.description}`).join('\n')}

## Mikroservis Swagger Dokümantasyonları

${services.map(s => `- [${s.name}](http://localhost:${s.port}/swagger)`).join('\n')}

## Kullanım

Her endpoint için ilgili servise proxy yapılır. Örnek:
- \`/auth/*\` → Auth Service (Port 3001)
- \`/users/*\` → User Service (Port 3002)
- \`/guilds/*\` → Guild Service (Port 3003)
`,
      },
      tags: services.map(s => ({
        name: s.name,
        description: s.description,
      })),
    },
  }))
  
  .get('/', () => ({
    message: 'Discord Alternative API Gateway',
    version: '1.0.0',
    services: services.map(s => ({
      name: s.name,
      endpoint: s.path,
      port: s.port,
      swagger: `http://localhost:${s.port}/swagger`,
      health: `http://localhost:${s.port}/health`,
    })),
    documentation: `http://localhost:${PORT}/swagger`,
  }))
  
  .get('/health', async () => {
    const healthChecks = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await fetch(`http://localhost:${service.port}/health`);
          const data = await response.json();
          return {
            service: service.name,
            status: 'healthy',
            port: service.port,
            data,
          };
        } catch (error) {
          return {
            service: service.name,
            status: 'unhealthy',
            port: service.port,
            error: error.message,
          };
        }
      })
    );
    
    const allHealthy = healthChecks.every(check => check.status === 'healthy');
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      gateway: 'api-gateway',
      services: healthChecks,
    };
  })
  
  // Auth Service Proxy
  .all('/auth/*', async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace('/auth', '');
    const targetUrl = `http://localhost:3001${path}${url.search}`;
    
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
  })
  
  // User Service Proxy
  .all('/users/*', async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace('/users', '');
    const targetUrl = `http://localhost:3002${path}${url.search}`;
    
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
  })
  
  // Guild Service Proxy
  .all('/guilds/*', async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace('/guilds', '');
    const targetUrl = `http://localhost:3003${path}${url.search}`;
    
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
  })
  
  // Message Service Proxy
  .all('/messages/*', async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace('/messages', '');
    const targetUrl = `http://localhost:3004${path}${url.search}`;
    
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
  })
  
  // WebSocket Gateway Proxy
  .all('/ws/*', async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace('/ws', '');
    const targetUrl = `http://localhost:3006${path}${url.search}`;
    
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
  })
  
  // SFU Service Proxy
  .all('/voice/*', async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.replace('/voice', '');
    const targetUrl = `http://localhost:3007${path}${url.search}`;
    
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
  })
  
  .listen(PORT);

console.log(`🚀 API Gateway running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Unified Swagger Documentation: http://localhost:${PORT}/swagger`);
console.log(`💚 Health Check: http://localhost:${PORT}/health`);
console.log('');
console.log('📡 Service Endpoints:');
services.forEach(s => {
  console.log(`  ${s.path} → http://localhost:${s.port} (${s.name})`);
});
