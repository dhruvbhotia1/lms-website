import {generateHTML} from "@tiptap/html";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import {clearContent, JSONContent} from "@tiptap/react";

export const tiptapExtension = [

    StarterKit,
    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),

]

export function parseTiptapJson(content?: string | JSONContent): JSONContent | null {

    if(!content) return null;

    if(typeof content === "object") return content;

    const trimmed = content.trim();

    if(trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
            return JSON.parse(trimmed) as JSONContent;
        } catch {
            return null;
        }
    }

    return {

        type: "doc",
        content: [{
            type: "paragraph",
            content: [{type: "text", text: content}],
        }]
    }
}

export function renderTipTapToHtml(content?: string | JSONContent | null): string {

    if(!content) return "";


    const json = parseTiptapJson(content);

    if(!json) return "";

    try {
        return generateHTML(json, tiptapExtension)
    } catch {

        return typeof content === "string" ? content : `""`;
    }

}


export function renderTipTapToPlainText(content?: string | JSONContent | null): string {

    const html = renderTipTapToHtml(content);
    if(!html) return "";


    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}