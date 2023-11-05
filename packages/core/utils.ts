import {IServiceConfig, ServiceConfig} from "./service-config.ts";
import {ServiceConfigError} from "./errors.ts";

export function getServiceNames(): string[] {
  return Bun.env['SERVICE_NAMES']?.split(',') ?? [];
}

export function getServiceConfigs(serviceNames = getServiceNames()): IServiceConfig[] {
  if (!serviceNames.length) console.warn(`getServiceNames: no service names found. Did you forget to set SERVICE_NAMES? (e.g. SERVICE_NAMES=foo,bar)`);
  const results = serviceNames.map(name => new ServiceConfig(name)).sort((a, b) => {
    if (a.pathPattern?.source === undefined) return 1;
    if (b.pathPattern?.source === undefined) return -1;
    return a.pathPattern!.source > b.pathPattern!.source ? -1 : 1;
  });
  if (results.filter(config => !config.pathPattern).length > 1) throw new ServiceConfigError('getServiceConfigs: Only one default value(`undefined`) can be set.');
  return results;
}