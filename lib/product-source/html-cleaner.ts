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

const BLOCK_SELECTORS = [
  "address",
  "article",
  "aside",
  "blockquote",
  "div",
  "dl",
  "dt",
  "dd",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "tr",
  "ul",
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

  $(BLOCK_SELECTORS.join(",")).each((_, element) => {
    $(element).prepend("\n").append("\n");
  });

  const text = $("body")
    .text()
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n\s*\n+/g, "\n")
    .trim();

  const cleanedHtml = $("body").html()?.trim() ?? "";

  return {
    title,
    text,
    html: cleanedHtml,
  };
}
