import * as cheerio from "cheerio";

const REMOVE_SELECTORS = [
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "iframe",
  "canvas",
  "video",
  "audio",
];

export type CleanProductHtmlResult = {
  title: string | null;
  text: string;
  html: string;
};

export function cleanProductHtml(html: string): CleanProductHtmlResult {
  const $ = cheerio.load(html);

  $(REMOVE_SELECTORS.join(",")).remove();

  const title = $("title").first().text().trim() || null;

  const text = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const cleanedHtml = $("body").html()?.trim() ?? "";

  return {
    title,
    text,
    html: cleanedHtml,
  };
}
