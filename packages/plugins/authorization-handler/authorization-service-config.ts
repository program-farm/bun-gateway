import {ServiceConfig, ServiceConfigError} from "../../core";

export class AuthorizationServiceConfig extends ServiceConfig {
  _verifyApiUrl?: string;
  readonly verifyApiPath: string;
  readonly userHeaders: string[];

  constructor(
    authorizationServiceName = Bun.env.AUTHORIZATION_SERVICE_NAME,
    verifyApiPath = Bun.env.AUTHORIZATION_SERVICE_VERIFY_API_PATH,
    userHeaderEnvs = Bun.env.VERIFIED_USER_HEADERS?.split(',') ?? [],
  ) {
    if (authorizationServiceName === undefined) throw new ServiceConfigError('AUTHORIZATION_SERVICE_NAME is undefined');
    if (verifyApiPath === undefined) throw new ServiceConfigError('AUTHORIZATION_SERVICE_VERIFY_API_PATH is undefined');
    if (!userHeaderEnvs.length) throw new ServiceConfigError('VERIFIED_USER_HEADERS is undefined');
    super(authorizationServiceName);
    this.userHeaders = userHeaderEnvs;
    this.verifyApiPath = verifyApiPath;
  }

  get verifyApiUrl(): string {
    if (this._verifyApiUrl === undefined) {
      this._verifyApiUrl = `${this.serviceProtoHostPort}${this.verifyApiPath}`;
    }
    return this._verifyApiUrl;
  }
}