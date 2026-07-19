import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Colors = "primary" | "secondary" | "tertiary" | "default";

type Props = {
  children: ReactNode;
  title?: string;
  color?: Colors;
  sx?: string;
};

const APARIENCE_MAP: Record<Colors, string[]> = {
  primary: ["ui:bg-red-500", "ui:border-red-600"],
  secondary: ["ui:bg-indigo-500", "ui:border-indigo-600"],
  tertiary: ["ui:bg-slate-500", "ui:border-slate-600"],
  default: ["ui:bg-white", "ui:border-gray-100"],
};

const TITLE_MAP: Record<Colors, string> = {
  primary: "ui:text-white",
  secondary: "ui:text-white",
  tertiary: "ui:text-white",
  default: "ui:text-black",
};

export function Card({ children, color = "default", title, sx }: Props) {
  const aparience = APARIENCE_MAP[color];
  const titleStyle = TITLE_MAP[color];

  return (
    <div className={twMerge("ui:border-2 ui:rounded-md ui:p-4", aparience, sx)}>
      {title && (
        <h1 className={twMerge("ui:text-xl ui:font-bold", titleStyle)}>
          {title}
        </h1>
      )}
      <div className={`ui:lowercase ${titleStyle}`}>{children}</div>
    </div>
  );
}
