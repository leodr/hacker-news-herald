import "dotenv/config";
import React from "react";
import { Resend } from "resend";
import DigestEmail from "./emails/digest";
import { Item } from "./hn-api";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;
const SENDER_ADDRESS = process.env.SENDER_ADDRESS;

async function fetchTopStories(): Promise<Item[]> {
  try {
    const topStoriesIdsResponse = await fetch(
      "https://hacker-news.firebaseio.com/v0/beststories.json"
    );

    if (!topStoriesIdsResponse.ok) {
      throw new Error(
        `Failed to fetch top stories: ${topStoriesIdsResponse.statusText}`
      );
    }

    const topStoriesIds = (await topStoriesIdsResponse.json()) as number[];

    if (!Array.isArray(topStoriesIds)) {
      throw new Error(
        "Invalid response format: expected an array of story IDs"
      );
    }

    const stories = await Promise.all(
      topStoriesIds.slice(0, 30).map(async (id) => {
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch story ${id}: ${response.statusText}`
          );
        }
        return response.json() as unknown as Item;
      })
    );

    console.log(`Successfully fetched ${stories.length} stories`);
    return stories;
  } catch (error) {
    console.error("Error in fetchTopStories:", error);
    throw error; // Re-throw to handle in main
  }
}

async function main() {
  console.log("Starting main function...");

  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set in environment variables");
  }

  if (!RECIPIENT_ADDRESS) {
    throw new Error("RECIPIENT_ADDRESS is not set in environment variables");
  }

  if (!SENDER_ADDRESS) {
    throw new Error("SENDER_ADDRESS is not set in environment variables");
  }

  try {
    console.log("Fetching top stories...");
    const stories = await fetchTopStories();
    const currentDate = new Date();

    const resend = new Resend(RESEND_API_KEY);

    const formattedDate = new Date(currentDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    console.log(`Sending email to ${RECIPIENT_ADDRESS}...`);
    const result = await resend.emails.send({
      from: SENDER_ADDRESS,
      to: RECIPIENT_ADDRESS,
      subject: `Hacker News Herald – ${formattedDate}`,
      react: <DigestEmail stories={stories} date={currentDate.toISOString()} />,
    });

    if (result.error) {
      throw new Error(
        `Failed to send email: ${result.error.name} ${result.error.message}`
      );
    }

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error(
      "Fatal error in main:",
      error instanceof Error ? error.message : error
    );
    process.exit(1); // Exit with error code
  }
}

// Use proper promise rejection handling
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

console.log("Initializing HN Herald...");
main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});
