export type RssChannel = {
  title: string;
  link: string;
  description: string;
  lastBuildDate: string;
  image: {
    title: string;
    url: string;
    link: string;
  };
  copyright: string;
  item: RssItem[];
};

export type RssItem = {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  description: {
    p: string;
  }
};
