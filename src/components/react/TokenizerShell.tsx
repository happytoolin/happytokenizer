import React, { type ReactNode } from "react";
import { LeapOCRPromotion } from "./LeapOCRPromotion";

interface TokenizerShellProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export function TokenizerShell({ sidebar, content }: TokenizerShellProps) {
  return (
    <div className="max-w-7xl mx-auto p-10 min-h-screen grid grid-cols-[320px_1fr] gap-8 items-start max-[1024px]:gap-6 max-[900px]:grid-cols-1 max-[900px]:p-4 max-[768px]:p-3 max-[480px]:p-2">
      {/* Sidebar and Promotion Container */}
      <div className="flex flex-col gap-6 max-[900px]:w-full">
        {/* Sidebar Area */}
        {sidebar}

        {/* LeapOCR Promotion - Below Sidebar */}
        <LeapOCRPromotion
          layout="vertical"
          className="max-w-[320px] mx-auto max-[900px]:hidden"
        />
      </div>

      {/* Main Workspace Area */}
      <div className="flex flex-col gap-6 max-[768px]:pb-32 max-[600px]:pb-20 max-[480px]:pb-24">
        {content}
      </div>
    </div>
  );
}
