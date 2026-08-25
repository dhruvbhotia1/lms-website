"use client";

import { useMemo } from "react";
import type { JSONContent } from "@tiptap/react";
import parse from "html-react-parser";
import { renderTipTapToHtml } from "@/lib/tiptap-utils";

interface RenderDescriptionProps {
    json?: JSONContent | string | null;
    className?: string;
}

export function RenderDescription({ json, className }: RenderDescriptionProps) {
    const html = useMemo(() => {
        return renderTipTapToHtml(json);
    }, [json]);

    if (!html) return null;

    return (
        <div className={`prose dark:prose-invert prose-li:marker:text-primary ${className ?? ""}`}>
            {parse(html)}
        </div>
    );
}
