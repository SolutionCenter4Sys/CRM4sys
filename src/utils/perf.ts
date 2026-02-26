export interface RoutePerfMetric {
  from: string;
  to: string;
  durationMs: number;
  timestamp: number;
}

export interface RoutePerfSummary {
  count: number;
  avgMs: number;
  p95Ms: number;
  recent: RoutePerfMetric[];
}

const STORAGE_KEY = 'crm_route_perf_metrics_v1';
const MAX_ITEMS = 100;

const readMetrics = (): RoutePerfMetric[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RoutePerfMetric[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        typeof item?.from === 'string' &&
        typeof item?.to === 'string' &&
        typeof item?.durationMs === 'number' &&
        typeof item?.timestamp === 'number'
    );
  } catch {
    return [];
  }
};

const writeMetrics = (items: RoutePerfMetric[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-MAX_ITEMS)));
};

export const appendRoutePerfMetric = (metric: RoutePerfMetric) => {
  const items = readMetrics();
  items.push(metric);
  writeMetrics(items);
};

const percentile = (values: number[], p: number): number => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index];
};

export const getRoutePerfSummary = (): RoutePerfSummary => {
  const items = readMetrics();
  if (!items.length) {
    return { count: 0, avgMs: 0, p95Ms: 0, recent: [] };
  }

  const durations = items.map((item) => item.durationMs);
  const avgMs = durations.reduce((sum, value) => sum + value, 0) / durations.length;
  const p95Ms = percentile(durations, 95);

  return {
    count: items.length,
    avgMs,
    p95Ms,
    recent: items.slice(-5).reverse(),
  };
};

