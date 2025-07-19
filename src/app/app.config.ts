import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {KeycloakService} from './utils/keycloak/keycloak';
import {keycloakHttpInterceptor} from './utils/http/keycloak-http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([keycloakHttpInterceptor])
    ),
    provideAppInitializer(()=>{
      const initFn = ((key: KeycloakService)=>{
        return () => key.init();
      })(inject(KeycloakService));
      return initFn();
    })
  ]
};
