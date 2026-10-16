import type { Config } from "@react-router/dev/config";

export default {
  // Every public page is server-rendered so crawlers and answer engines get
  // real HTML, not an empty shell they have to execute JS to read.
  ssr: true,
} satisfies Config;
