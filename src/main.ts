import { Hono } from "https://deno.land/x/hono@v3.12.5/mod.ts";
import { basicAuth } from "https://deno.land/x/hono@v3.12.5/middleware.ts";
import { getRssText } from "./rss.ts";
import { RssChannel } from "./type.ts";
import { getUserByScreenName } from "./twitter.ts";
import { getTweetsAsRssItems } from "./twitter.ts";
import { BASIC_AUTH_PASSWORD, BASIC_AUTH_USERNAME } from "./env.ts";

const app = new Hono();

app.use(
  "/*",
  basicAuth({
    username: BASIC_AUTH_USERNAME,
    password: BASIC_AUTH_PASSWORD,
  }),
);

app.get("/", (c) => {
  return c.text('You can view RSS feeds in the format "/user/:screenName"');
});

app.get("/user/:screenName", async (c) => {
  const { screenName } = c.req.param();
  const user = await getUserByScreenName(screenName);
  if (!user) return c.text(`User not found: "@${screenName}"`);
  const {
    restId,
    legacy: {
      profileImageUrlHttps,
      description,
      name,
    },
  } = user;

  const items = await getTweetsAsRssItems(restId);

  const title = `${name} / @${screenName}`;
  const userLink = `https://twitter.com/${screenName}`;
  const channel: RssChannel = {
    title,
    link: userLink,
    description: description.replaceAll("\n", "<br />"),
    lastBuildDate: items[0].pubDate,
    image: {
      title,
      url: profileImageUrlHttps,
      link: userLink,
    },
    copyright: title,
    item: items,
  };
  const xml = getRssText(channel);
  return c.text(xml);
});

Deno.serve(app.fetch);
