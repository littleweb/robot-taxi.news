import { defineModule } from "@aihot/contracts/modules";
export default defineModule({ name: "robotaxi", pages: [
  { path: "industry", file: "page.tsx", id: "robotaxi-industry" },
  { path: "financing", file: "page.tsx", id: "robotaxi-financing" },
  { path: "media/:region", file: "page.tsx", id: "robotaxi-media" },
] });
