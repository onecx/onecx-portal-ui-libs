export interface HealthCheckResult {
  name: string
  healthy: boolean
}

export interface HeartbeatConfig {
  enabled: boolean
  interval?: number // in milliseconds
  failureThreshold?: number // number of consecutive failures before logging error
}
