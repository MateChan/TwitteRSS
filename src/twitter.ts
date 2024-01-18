import { TwitterOpenApi } from "npm:twitter-openapi-typescript";
import { TWITTER_AUTH_TOKEN, TWITTER_CT0 } from "./env.ts";
import type { RssItem } from "./type.ts";

const api = new TwitterOpenApi();
const client = await api.getClientFromCookies({
  auth_token: TWITTER_AUTH_TOKEN,
  ct0: TWITTER_CT0,
});

export async function getUserByScreenName(screenName: string) {
  const getUserRes = await client.getUserApi().getUserByScreenName({
    screenName,
  });
  return getUserRes.data.user;
}

export async function getTweetsAsRssItems(userId: string) {
  const getTweetsRes = await client.getTweetApi().getUserTweets({
    userId,
  });
  const rssItems: RssItem[] = [];
  getTweetsRes.data.data.forEach((d) => {
    const { screenName } = d.user.legacy;
    const { legacy } = d.tweet;
    if (legacy) {
      const { fullText, createdAt, idStr } = legacy;
      const rssItem: RssItem = {
        title: fullText,
        link: `https://twitter.com/${screenName}/status/${idStr}`,
        guid: `https://twitter.com/${screenName}/status/${idStr}`,
        pubDate: new Date(createdAt).toString(),
        description: {
          p: fullText,
        },
      };
      rssItems.push(rssItem);
    }
  });
  return rssItems;
}

// const user = await getUserByScreenName("matebookerm3");
// console.log(user);

// const tweets = await getTweetsAsRssItems(user?.restId ?? "");
// console.log(tweets);
