import {ServiceConfigError} from "./errors.ts";

export interface IServiceConfig {
  name: string;
  host: string;
  protocol: string;
  port: number;
  /**
   * e.g. /^https?:\/\/([a-zA-Z0-9\-_\.]+(:[a-zA-Z0-9\-_\.\!@\#\$\%\^]+)?@)?example.com\/(api|docs)\/app_name/
   */
  pathPattern?: RegExp;
}


export class ServiceConfig implements IServiceConfig {
  readonly pathPattern?: RegExp;
  readonly host: string;

  /**
   * @param name {string} Service name of k8s or key to parse service config from environments.
   * @param pathPatternEnv {string?} '^https?:\/\/([a-zA-Z0-9\-_\.]+(:[a-zA-Z0-9\-_\.\!@\#\$\%\^]+)?@)?example.com\/(api|docs)\/app_name'. Default is null(If null then this app will deliver the remaining traffic that is not matched).
   * @param port {number?} Default value is 80
   * @param protocol {string?} Default value is 'http'
   * @param host {string?} Default value is `${protocol}://${Bun.env[`${name}_SERVICE_HOST`]}:${port}`
   */
  constructor(
    readonly name: string,
    readonly protocol = Bun.env[`${name.toUpperCase()}_SERVICE_PROTO_SECURE`] === 'true' ? 'https' : 'http',
    pathPatternEnv = Bun.env[`${name.toUpperCase()}_REQUEST_PATTERN`],
    readonly port = Number(Bun.env[`${name.toUpperCase()}_SERVICE_PORT`] || 80),
    host = Bun.env[`${name.toUpperCase()}_SERVICE_HOST`] && `${protocol}://${Bun.env[`${name.toUpperCase()}_SERVICE_HOST`]}:${port}`
  ) {
    if (host === undefined) throw new ServiceConfigError(`ServiceConfig: host is undefined. Did you forget to set ${name.toUpperCase()}_SERVICE_HOST or ${name}_SERVICE_HOST?`);
    this.host = host;
    this.pathPattern = pathPatternEnv ? new RegExp(pathPatternEnv) : undefined;
  }
}
