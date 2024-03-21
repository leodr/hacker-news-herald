type UnixTime = number;

export type ItemType = "job" | "story" | "comment" | "poll" | "pollopt";

export type BaseItem = {
  id: number;
  deleted?: boolean;
  type?: ItemType;
  by?: string;
  time?: UnixTime;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
};

export type Story = BaseItem & {
  type: "story";
  by: string;
  time: UnixTime;
  url: string;
  score: number;
  title: string;
  descendants: number;
};

export type Comment = BaseItem & {
  type: "comment";
  by: string;
  time: UnixTime;
  text: string;
  parent: number;
};

export type Job = BaseItem & {
  type: "job";
  by: string;
  time: UnixTime;
  url: string;
  title: string;
};

export type Poll = BaseItem & {
  type: "poll";
  by: string;
  time: UnixTime;
  text: string;
  title: string;
  parts: number[];
  descendants: number;
};

export type Pollopt = BaseItem & {
  type: "pollopt";
  by: string;
  time: UnixTime;
  text: string;
  poll: number;
  score: number;
};

export type Item = Story | Comment | Job | Poll | Pollopt;
