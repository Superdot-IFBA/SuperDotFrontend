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
  const truncated = text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  const tooltip = `${text}`;

  return (
    <span title={tooltip} className={className}>
      {truncated}
    </span>
  );
};

export default TruncatedText;
