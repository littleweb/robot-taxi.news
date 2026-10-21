// What the site's modules add to the web pages (site/modules/index.ts).
import type { WebModule } from "@aihot/web/modules";

import robotaxi from "@aihot/robotaxi/web";
export const WEB_MODULES: readonly WebModule[] = [robotaxi];
