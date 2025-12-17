import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 20,
  className = "",
}) => {
  const truncated =
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={`${className} cursor-pointer`}>
            {truncated}
          </span>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            className="z-50 rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shadow-lg"
          >
            {text}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TruncatedText;
