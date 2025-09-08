// =====================================================
// RATE LIMIT MONITORING ALERTS
// =====================================================

export interface AlertConfig {
  id: string;
  name: string;
  description: string;
  threshold: number;
  condition: 'greater_than' | 'less_than' | 'equals';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  cooldown: number; // in minutes
  channels: AlertChannel[];
}

export interface AlertChannel {
  type: 'email' | 'webhook' | 'slack' | 'discord' | 'console';
  config: Record<string, any>;
}

export interface Alert {
  id: string;
  configId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  data: Record<string, any>;
}

export interface AlertMetrics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  alertsBySeverity: Record<string, number>;
  alertsByType: Record<string, number>;
  averageResolutionTime: number;
}

// =====================================================
// ALERT CONFIGURATIONS
// =====================================================

export const defaultAlertConfigs: AlertConfig[] = [
  {
    id: 'high-block-rate',
    name: 'High Block Rate',
    description: 'Rate limit block rate exceeds threshold',
    threshold: 10, // 10%
    condition: 'greater_than',
    severity: 'high',
    enabled: true,
    cooldown: 15,
    channels: [
      { type: 'console', config: {} },
      { type: 'webhook', config: { url: process.env.ALERT_WEBHOOK_URL || '' } },
    ],
  },
  {
    id: 'redis-down',
    name: 'Redis Connection Down',
    description: 'Redis connection failed',
    threshold: 0,
    condition: 'equals',
    severity: 'critical',
    enabled: true,
    cooldown: 5,
    channels: [
      { type: 'console', config: {} },
      { type: 'webhook', config: { url: process.env.ALERT_WEBHOOK_URL || '' } },
      {
        type: 'email',
        config: {
          to: process.env.ALERT_EMAIL || '',
          subject: 'Redis Connection Down - Rate Limiting',
        },
      },
    ],
  },
  {
    id: 'high-fallback-usage',
    name: 'High Fallback Usage',
    description: 'High percentage of requests using fallback storage',
    threshold: 50, // 50%
    condition: 'greater_than',
    severity: 'medium',
    enabled: true,
    cooldown: 30,
    channels: [
      { type: 'console', config: {} },
      { type: 'webhook', config: { url: process.env.ALERT_WEBHOOK_URL || '' } },
    ],
  },
  {
    id: 'memory-usage-high',
    name: 'High Memory Usage',
    description: 'Fallback memory usage exceeds threshold',
    threshold: 80, // 80%
    condition: 'greater_than',
    severity: 'medium',
    enabled: true,
    cooldown: 20,
    channels: [
      { type: 'console', config: {} },
      { type: 'webhook', config: { url: process.env.ALERT_WEBHOOK_URL || '' } },
    ],
  },
  {
    id: 'rate-limit-errors',
    name: 'Rate Limit Errors',
    description: 'Rate limiting system errors detected',
    threshold: 5, // 5 errors
    condition: 'greater_than',
    severity: 'high',
    enabled: true,
    cooldown: 10,
    channels: [
      { type: 'console', config: {} },
      { type: 'webhook', config: { url: process.env.ALERT_WEBHOOK_URL || '' } },
    ],
  },
];

// =====================================================
// ALERT MANAGER
// =====================================================

class AlertManager {
  private alerts: Alert[] = [];
  private lastAlertTimes: Map<string, number> = new Map();
  private configs: AlertConfig[] = defaultAlertConfigs;

  // Load alert configurations
  loadConfigs(configs: AlertConfig[]) {
    this.configs = configs;
  }

  // Check if alert should be triggered
  shouldTriggerAlert(configId: string, value: number): boolean {
    const config = this.configs.find(c => c.id === configId);
    if (!config || !config.enabled) return false;

    const lastAlert = this.lastAlertTimes.get(configId);
    const now = Date.now();

    // Check cooldown
    if (lastAlert && now - lastAlert < config.cooldown * 60 * 1000) {
      return false;
    }

    // Check condition
    switch (config.condition) {
      case 'greater_than':
        return value > config.threshold;
      case 'less_than':
        return value < config.threshold;
      case 'equals':
        return value === config.threshold;
      default:
        return false;
    }
  }

  // Trigger an alert
  async triggerAlert(
    configId: string,
    value: number,
    data: Record<string, any> = {}
  ): Promise<Alert | null> {
    const config = this.configs.find(c => c.id === configId);
    if (!config || !this.shouldTriggerAlert(configId, value)) {
      return null;
    }

    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      configId,
      message: this.formatAlertMessage(config, value),
      severity: config.severity,
      timestamp: Date.now(),
      resolved: false,
      data: { ...data, value, threshold: config.threshold },
    };

    this.alerts.push(alert);
    this.lastAlertTimes.set(configId, Date.now());

    // Send to channels
    await this.sendToChannels(alert, config.channels);

    return alert;
  }

  // Format alert message
  private formatAlertMessage(config: AlertConfig, value: number): string {
    const threshold = config.threshold;
    const valueStr =
      typeof value === 'number' ? `${value.toFixed(2)}%` : value.toString();

    return `${config.name}: ${valueStr} (threshold: ${threshold}${typeof threshold === 'number' ? '%' : ''})`;
  }

  // Send alert to channels
  private async sendToChannels(
    alert: Alert,
    channels: AlertChannel[]
  ): Promise<void> {
    for (const channel of channels) {
      try {
        await this.sendToChannel(alert, channel);
      } catch (error) {
        console.error(`Failed to send alert to ${channel.type}:`, error);
      }
    }
  }

  // Send alert to specific channel
  private async sendToChannel(
    alert: Alert,
    channel: AlertChannel
  ): Promise<void> {
    const message = this.formatChannelMessage(alert, channel);

    switch (channel.type) {
      case 'console':
        console.log(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${message}`);
        break;

      case 'webhook':
        if (channel.config.url) {
          await fetch(channel.config.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              alert,
              message,
              timestamp: new Date().toISOString(),
            }),
          });
        }
        break;

      case 'email':
        // Implement email sending (using your preferred email service)
        console.log(`📧 EMAIL ALERT: ${message}`);
        break;

      case 'slack':
        // Implement Slack webhook
        console.log(`💬 SLACK ALERT: ${message}`);
        break;

      case 'discord':
        // Implement Discord webhook
        console.log(`🎮 DISCORD ALERT: ${message}`);
        break;
    }
  }

  // Format message for specific channel
  private formatChannelMessage(alert: Alert, channel: AlertChannel): string {
    const severityEmoji = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '🚨',
    };

    return (
      `${severityEmoji[alert.severity]} **${alert.message}**\n` +
      `Severity: ${alert.severity.toUpperCase()}\n` +
      `Time: ${new Date(alert.timestamp).toISOString()}\n` +
      `Data: ${JSON.stringify(alert.data, null, 2)}`
    );
  }

  // Resolve an alert
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert || alert.resolved) return false;

    alert.resolved = true;
    alert.resolvedAt = Date.now();
    return true;
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  // Get all alerts
  getAllAlerts(): Alert[] {
    return [...this.alerts];
  }

  // Get alerts by severity
  getAlertsBySeverity(severity: string): Alert[] {
    return this.alerts.filter(a => a.severity === severity);
  }

  // Get alert metrics
  getMetrics(): AlertMetrics {
    const totalAlerts = this.alerts.length;
    const activeAlerts = this.alerts.filter(a => !a.resolved).length;
    const resolvedAlerts = this.alerts.filter(a => a.resolved).length;

    const alertsBySeverity = this.alerts.reduce(
      (acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const alertsByType = this.alerts.reduce(
      (acc, alert) => {
        acc[alert.configId] = (acc[alert.configId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const resolvedAlertsWithTime = this.alerts.filter(
      a => a.resolved && a.resolvedAt
    );
    const averageResolutionTime =
      resolvedAlertsWithTime.length > 0
        ? resolvedAlertsWithTime.reduce(
            (sum, alert) => sum + (alert.resolvedAt! - alert.timestamp),
            0
          ) / resolvedAlertsWithTime.length
        : 0;

    return {
      totalAlerts,
      activeAlerts,
      resolvedAlerts,
      alertsBySeverity,
      alertsByType,
      averageResolutionTime,
    };
  }

  // Clear old alerts (older than specified days)
  clearOldAlerts(days: number = 30): number {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const initialLength = this.alerts.length;
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
    return initialLength - this.alerts.length;
  }
}

// =====================================================
// EXPORT SINGLETON
// =====================================================

export const alertManager = new AlertManager();

// =====================================================
// ALERT TRIGGERS
// =====================================================

export async function checkAndTriggerAlerts(metrics: {
  blockRate: number;
  fallbackRate: number;
  redisConnected: boolean;
  memoryUsage: number;
  errorCount: number;
}): Promise<Alert[]> {
  const triggeredAlerts: Alert[] = [];

  // Check high block rate
  if (metrics.blockRate > 0) {
    const alert = await alertManager.triggerAlert(
      'high-block-rate',
      metrics.blockRate,
      {
        blockRate: metrics.blockRate,
      }
    );
    if (alert) triggeredAlerts.push(alert);
  }

  // Check Redis connection
  if (!metrics.redisConnected) {
    const alert = await alertManager.triggerAlert('redis-down', 0, {
      redisConnected: metrics.redisConnected,
    });
    if (alert) triggeredAlerts.push(alert);
  }

  // Check fallback usage
  if (metrics.fallbackRate > 0) {
    const alert = await alertManager.triggerAlert(
      'high-fallback-usage',
      metrics.fallbackRate,
      {
        fallbackRate: metrics.fallbackRate,
      }
    );
    if (alert) triggeredAlerts.push(alert);
  }

  // Check memory usage
  if (metrics.memoryUsage > 0) {
    const alert = await alertManager.triggerAlert(
      'memory-usage-high',
      metrics.memoryUsage,
      {
        memoryUsage: metrics.memoryUsage,
      }
    );
    if (alert) triggeredAlerts.push(alert);
  }

  // Check error count
  if (metrics.errorCount > 0) {
    const alert = await alertManager.triggerAlert(
      'rate-limit-errors',
      metrics.errorCount,
      {
        errorCount: metrics.errorCount,
      }
    );
    if (alert) triggeredAlerts.push(alert);
  }

  return triggeredAlerts;
}
