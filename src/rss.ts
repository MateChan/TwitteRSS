import { stringify } from "https://deno.land/x/xml@2.1.3/mod.ts";
import { RssChannel } from "./type.ts";

export function getRssText(channel: RssChannel): string {
  const xmlBody = {
    xml: {
      "@version": "1.0",
      "@encoding": "utf-8",
    },
    rss: {
      "@version": "2.0",
      channel,
    },
  };
  return stringify(xmlBody);
}
