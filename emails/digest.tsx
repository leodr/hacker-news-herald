import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import fs from "fs";
import { URL } from "node:url";
import React from "react";
import { Item } from "../hn-api";

interface DigestEmailProps {
  date: string;
  stories?: Item[];
}

export const DigestEmail = ({ date, stories }: DigestEmailProps) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Preview>Hacker News Herald {formattedDate}</Preview>
      <Tailwind>
        <Body className="font-sans">
          <Container>
            <Heading className="m-0 text-neutral-900 text-4xl font-extrabold leading-none tracking-tighter">
              Hacker News
            </Heading>
            <Text className="m-0 py-1 italic text-neutral-500 text-base">
              {formattedDate}
            </Text>
            <Hr className="mt-5 mb-4" />
            <Section>
              {stories?.map((story) => {
                let hostname = "";

                try {
                  if (story.url) {
                    const url = new URL(story.url);
                    hostname = url.hostname;

                    if (hostname.startsWith("www.")) {
                      hostname = hostname.slice(4);
                    }
                    if (hostname === "github.com") {
                      hostname += url.pathname;
                    }
                  }
                } catch {}

                return (
                  <Row key={story.id} className="py-3">
                    <Link
                      href={story.url}
                      className="m-0 p-0 text-neutral-400 text-base leading-normal"
                    >
                      <span className="text-neutral-900 font-bold">
                        {story.title}
                      </span>
                      {hostname ? ` (${hostname})` : null}
                    </Link>
                    <Text className="m-0 mt-1 p-0 text-neutral-500 text-base leading-normal">
                      {story.score} points by {story.by} &ndash;{" "}
                      <Link
                        className="text-neutral-500"
                        href={`https://news.ycombinator.com/item?id=${story.id}`}
                      >
                        {story.descendants} comments
                      </Link>
                    </Text>
                  </Row>
                );
              })}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

DigestEmail.PreviewProps = {
  date: new Date().toISOString(),
  stories: JSON.parse(
    fs.readFileSync("./top-hacker-news-stories.json", {
      encoding: "utf-8",
    })
  ),
} as DigestEmailProps;

export default DigestEmail;
