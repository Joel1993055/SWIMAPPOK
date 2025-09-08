# 📊 Rate Limit Monitoring Setup

## 📋 Overview

Sistema completo de monitoreo para rate limiting con métricas avanzadas, alertas en tiempo real, y
dashboards interactivos.

## ✅ Criterios de Éxito

- ✅ **Monitoreo en tiempo real** - Dashboard con métricas actualizadas cada 30 segundos
- ✅ **Sistema de alertas** - Notificaciones automáticas para problemas críticos
- ✅ **Métricas detalladas** - Análisis profundo de rendimiento y uso
- ✅ **Health checks** - Monitoreo de salud del sistema Redis y fallback
- ✅ **Análisis de IPs** - Tracking de IPs más activas y bloqueadas

## 🏗️ Arquitectura de Monitoreo

### **Componentes Principales**

#### **1. Sistema de Métricas (`lib/monitoring/metrics.ts`)**

- **Recolección automática** de métricas en tiempo real
- **Time series data** con agregación por intervalos
- **Métricas de rendimiento** (tiempo de respuesta, throughput)
- **Análisis de IPs** (top requested, top blocked)
- **Gestión de memoria** con alertas automáticas

#### **2. Sistema de Alertas (`lib/monitoring/alerts.ts`)**

- **5 tipos de alertas** predefinidas
- **Múltiples canales** (console, webhook, email, Slack, Discord)
- **Cooldown inteligente** para evitar spam
- **Severidad escalada** (low, medium, high, critical)

#### **3. Dashboard Avanzado (`components/admin/advanced-monitoring-dashboard.tsx`)**

- **Visualizaciones interactivas** con Chart.js
- **Múltiples pestañas** (Overview, Performance, Alerts, IP Analysis)
- **Auto-refresh** configurable
- **Exportación de datos** en tiempo real

## 🚀 Configuración

### **Variables de Entorno para Monitoreo**

```bash
# Alertas
ALERT_WEBHOOK_URL=https://your-webhook-url.com/alerts
ALERT_EMAIL=admin@yourcompany.com

# Monitoreo avanzado
MONITORING_ENABLED=true
MONITORING_RETENTION_DAYS=7
MONITORING_AGGREGATION_INTERVAL=5
MONITORING_MAX_DATA_POINTS=1000

# IP Tracking
ENABLE_IP_TRACKING=true
ENABLE_PERFORMANCE_TRACKING=true
```

### **Configuración de Alertas**

```typescript
// lib/monitoring/alerts.ts
export const defaultAlertConfigs: AlertConfig[] = [
  {
    id: 'high-block-rate',
    name: 'High Block Rate',
    description: 'Rate limit block rate exceeds threshold',
    threshold: 10, // 10%
    condition: 'greater_than',
    severity: 'high',
    enabled: true,
    cooldown: 15, // 15 minutes
    channels: [
      { type: 'console', config: {} },
      { type: 'webhook', config: { url: process.env.ALERT_WEBHOOK_URL } },
    ],
  },
  // ... más configuraciones
];
```

## 📊 Métricas Disponibles

### **Métricas Básicas**

- **Total Requests** - Número total de requests procesados
- **Blocked Requests** - Requests bloqueados por rate limiting
- **Block Rate** - Porcentaje de requests bloqueados
- **Fallback Usage** - Porcentaje de requests usando fallback

### **Métricas de Rendimiento**

- **Response Time** - Tiempo promedio de respuesta
- **P95/P99 Response Time** - Percentiles de tiempo de respuesta
- **Requests per Minute/Hour** - Throughput en tiempo real
- **Peak Requests** - Picos de tráfico históricos

### **Métricas de Sistema**

- **Redis Status** - Estado de conexión Redis
- **Memory Usage** - Uso de memoria del sistema
- **Error Count/Rate** - Errores y tasa de errores
- **Health Status** - Estado general del sistema

### **Métricas de IPs**

- **Top Requested IPs** - IPs con más requests
- **Top Blocked IPs** - IPs con más bloqueos
- **IP Distribution** - Distribución geográfica (si está disponible)

## 🚨 Sistema de Alertas

### **Tipos de Alertas**

#### **1. High Block Rate (Crítico)**

- **Trigger**: Block rate > 10%
- **Severidad**: High
- **Cooldown**: 15 minutos
- **Canales**: Console, Webhook

#### **2. Redis Connection Down (Crítico)**

- **Trigger**: Redis desconectado
- **Severidad**: Critical
- **Cooldown**: 5 minutos
- **Canales**: Console, Webhook, Email

#### **3. High Fallback Usage (Medio)**

- **Trigger**: Fallback usage > 50%
- **Severidad**: Medium
- **Cooldown**: 30 minutos
- **Canales**: Console, Webhook

#### **4. High Memory Usage (Medio)**

- **Trigger**: Memory usage > 80%
- **Severidad**: Medium
- **Cooldown**: 20 minutos
- **Canales**: Console, Webhook

#### **5. Rate Limit Errors (Alto)**

- **Trigger**: Error count > 5
- **Severidad**: High
- **Cooldown**: 10 minutos
- **Canales**: Console, Webhook

### **Configuración de Canales**

#### **Console (Siempre activo)**

```typescript
{ type: 'console', config: {} }
```

#### **Webhook**

```typescript
{
  type: 'webhook',
  config: {
    url: 'https://your-webhook-url.com/alerts',
    headers: { 'Authorization': 'Bearer your-token' }
  }
}
```

#### **Email**

```typescript
{
  type: 'email',
  config: {
    to: 'admin@yourcompany.com',
    subject: 'Rate Limit Alert'
  }
}
```

## 📈 Dashboard Interactivo

### **Pestaña Overview**

- **Gráfico de requests** en tiempo real
- **Distribución por tipos** de rate limit
- **Métricas clave** en tarjetas
- **Estado de salud** del sistema

### **Pestaña Performance**

- **Uso de memoria** a lo largo del tiempo
- **Métricas de rendimiento** detalladas
- **Throughput** y picos de tráfico
- **Tiempos de respuesta** (avg, P95, P99)

### **Pestaña Alerts**

- **Alertas activas** con detalles
- **Historial de alertas** resueltas
- **Métricas de alertas** (total, por severidad)
- **Tiempo promedio** de resolución

### **Pestaña IP Analysis**

- **Top IPs** por requests
- **Top IPs** por bloqueos
- **Distribución geográfica** (si está disponible)
- **Patrones de tráfico** por IP

## 🔧 API Endpoints

### **GET /api/admin/rate-limits**

Obtiene todas las métricas y alertas:

```json
{
  "analytics": { ... },
  "health": { ... },
  "metrics": {
    "totalRequests": 1500,
    "blockedRequests": 45,
    "blockRate": 3.0,
    "fallbackUsage": 0.0,
    "redisConnected": true,
    "memoryUsage": 52428800,
    "memoryUsagePercent": 50.0,
    "averageResponseTime": 25.5,
    "p95ResponseTime": 45.2,
    "p99ResponseTime": 78.1,
    "requestsPerMinute": 120,
    "requestsPerHour": 7200,
    "topBlockedIPs": [
      { "ip": "192.168.1.100", "count": 15 },
      { "ip": "10.0.0.50", "count": 12 }
    ],
    "health": {
      "redis": true,
      "fallback": true,
      "memory": "healthy",
      "overall": "healthy"
    }
  },
  "timeSeries": [
    {
      "timestamp": 1640995200000,
      "requests": 100,
      "blocked": 5,
      "blockRate": 5.0,
      "fallbackRate": 0.0,
      "memoryUsage": 52428800
    }
  ],
  "alerts": [
    {
      "id": "alert-123",
      "configId": "high-block-rate",
      "message": "High Block Rate: 15.5% (threshold: 10%)",
      "severity": "high",
      "timestamp": 1640995200000,
      "resolved": false,
      "data": { "blockRate": 15.5, "threshold": 10 }
    }
  ],
  "alertMetrics": {
    "totalAlerts": 25,
    "activeAlerts": 3,
    "resolvedAlerts": 22,
    "alertsBySeverity": {
      "high": 2,
      "medium": 1,
      "low": 0,
      "critical": 0
    },
    "averageResolutionTime": 1800000
  }
}
```

### **DELETE /api/admin/rate-limits**

Resetea todas las métricas y alertas.

## 🛠️ Configuración Avanzada

### **Retención de Datos**

```typescript
const config: MetricsConfig = {
  retentionDays: 7, // Mantener datos por 7 días
  aggregationInterval: 5, // Agregar cada 5 minutos
  maxDataPoints: 1000, // Máximo 1000 puntos de datos
  enableTimeSeries: true, // Habilitar series de tiempo
  enableIPTracking: true, // Habilitar tracking de IPs
  enablePerformanceTracking: true, // Habilitar métricas de rendimiento
};
```

### **Personalización de Alertas**

```typescript
// Añadir nueva alerta personalizada
const customAlert: AlertConfig = {
  id: 'custom-alert',
  name: 'Custom Alert',
  description: 'Custom alert description',
  threshold: 50,
  condition: 'greater_than',
  severity: 'medium',
  enabled: true,
  cooldown: 30,
  channels: [{ type: 'webhook', config: { url: 'https://custom-webhook.com' } }],
};

alertManager.loadConfigs([...defaultAlertConfigs, customAlert]);
```

## 📱 Integración con Sistemas Externos

### **Webhook Integration**

```bash
# Ejemplo de webhook payload
curl -X POST https://your-webhook-url.com/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "alert": {
      "id": "alert-123",
      "message": "High Block Rate: 15.5%",
      "severity": "high",
      "timestamp": "2024-01-01T12:00:00Z"
    },
    "metrics": {
      "blockRate": 15.5,
      "totalRequests": 1000,
      "blockedRequests": 155
    }
  }'
```

### **Slack Integration**

```typescript
// Configurar webhook de Slack
const slackAlert: AlertChannel = {
  type: 'webhook',
  config: {
    url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};
```

## 🔍 Troubleshooting

### **Problemas Comunes**

#### **1. Dashboard no carga datos**

```bash
# Verificar API endpoint
curl -H "Authorization: Bearer your-token" \
  https://your-app.com/api/admin/rate-limits
```

#### **2. Alertas no se envían**

- Verificar configuración de webhooks
- Revisar logs de consola
- Comprobar conectividad de red

#### **3. Métricas no se actualizan**

- Verificar que el middleware esté activo
- Comprobar logs de métricas
- Revisar configuración de recolección

### **Debug Mode**

```bash
# Habilitar logs detallados
RATE_LIMIT_LOG_LEVEL=debug
MONITORING_DEBUG=true
```

## 📊 Métricas de Éxito

### **KPIs del Sistema**

- **Uptime**: > 99.9%
- **Response Time**: < 100ms promedio
- **Block Rate**: < 5% en condiciones normales
- **Alert Resolution**: < 15 minutos promedio
- **Data Retention**: 7 días completos

### **Métricas de Negocio**

- **Request Volume**: Tendencias de tráfico
- **Peak Usage**: Identificación de picos
- **Geographic Distribution**: Distribución de usuarios
- **Error Patterns**: Patrones de errores

## 🎯 Próximos Pasos

### **Mejoras Futuras**

1. **Machine Learning** - Predicción de picos de tráfico
2. **Geographic Analysis** - Análisis por regiones
3. **Custom Dashboards** - Dashboards personalizables
4. **Mobile App** - App móvil para monitoreo
5. **Integration Hub** - Más integraciones (PagerDuty, OpsGenie)

---

**Fecha de Implementación**: $(date) **Versión**: 1.0.0 **Estado**: ✅ **PRODUCTION READY**

**¡El sistema de monitoreo está completamente implementado y listo para producción!** 🚀
