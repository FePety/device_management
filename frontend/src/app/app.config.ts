import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';          // Import PrimeNG konfigurációhoz
import Aura from '@primeng/themes/aura';                  // Import a választott PrimeNG témához (pl. Aura)
// Vagy egy másik téma, pl.: import Lara from '@primeng/themes/lara';

import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(), // PrimeNG animációkhoz és más Angular animációkhoz
    provideHttpClient(),     // HTTP kérésekhez (pl. a DeviceService-ben)
    providePrimeNG({
      theme: {
        preset: Aura, // Alkalmazza az Aura témát
        // Opcionális további téma beállítások:
        // options: {
        //   prefix: 'p', // CSS osztályok prefixe (pl. p-button)
        //   darkModeSelector: 'system', // Automatikus sötét mód a rendszerbeállítás alapján
        //   cssLayer: { // CSS rétegek konfigurálása Tailwind CSS-sel való jobb integrációért
        //      name: 'primeng',
        //      order: 'tailwind-base, primeng, tailwind-utilities'
        //   }
        // }
      },
      // Egyéb globális PrimeNG beállítások (opcionális):
      // ripple: true, // Bekapcsolja a "ripple" effektet a kattintható elemeken
      // inputStyle: 'outlined' // Alapértelmezett stílus input mezőkhöz ('filled' vagy 'outlined')
    })
  ]
};
// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
// };
