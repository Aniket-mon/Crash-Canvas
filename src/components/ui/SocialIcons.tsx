// SocialIcons.tsx
import * as simpleIcons from "simple-icons";

type IconKey = keyof typeof simpleIcons;

type Props = {
  name: IconKey;
  size?: number;
  color?: string;
  className?: string;
};

const SimpleIcon = ({ name, size = 24, color, className = "" }: Props) => {
  const icon = simpleIcons[name];

  if (!icon || typeof icon !== "object" || !("path" in icon)) {
    return null;
  }

  const fill = color || `#${icon.hex}`;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
};

export default SimpleIcon;
