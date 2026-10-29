// feature/Utils/healthStatus.ts
export type HealthTone = 'good' | 'warning' | 'critical' | 'neutral';

// Keys are lowercase. Adjust to the exact strings your backend uses for CurrentHealthStatus.
const HEALTH_STATUS_TONE: Record<string, HealthTone> = {
  healthy: 'good',
  good: 'good',
  'under observation': 'warning',
  sick: 'warning',
  hospitalized: 'critical',
};

export const getHealthTone = (status?: string | null): HealthTone =>
  (status && HEALTH_STATUS_TONE[status.trim().toLowerCase()]) || 'neutral';