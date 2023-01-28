// import { ServerConfig } from './server-config';
import { AppConfigService } from './_services/app-config.service';

export const appInitializerFn = (appConfig: AppConfigService) => {
    return () => appConfig.loadAppConfig();
};
