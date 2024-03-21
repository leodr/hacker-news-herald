import "dotenv/config";
import React from "react";
import { Resend } from "resend";
import DigestEmail from "./emails/digest";
import { Item } from "./hn-api";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

async function fetchTopStories(): Promise<Item[]> {
  const topStoriesIdsResponse = await fetch(
    "https://hacker-news.firebaseio.com/v0/beststories.json"
  );
  const topStoriesIds = (await topStoriesIdsResponse.json()) as number[];

  return Promise.all(
    topStoriesIds
      .slice(0, 30)
      .map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (response) => response.json() as unknown as Item
        )
      )
  );
}

async function main() {
  try {
    const stories = await fetchTopStories();
    const currentDate = new Date();

    const resend = new Resend(RESEND_API_KEY);

    const formattedDate = new Date(currentDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    await resend.emails.send({
      from: "hnherald@leodriesch.com",
      to: "hi@leodriesch.com",
      subject: `Hacker News Herald – ${formattedDate}`,
      react: <DigestEmail stories={stories} date={currentDate.toISOString()} />,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
  }
}

main();
