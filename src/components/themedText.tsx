import { Text, type TextProps, type TextStyle } from "react-native";

type FontSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

type FontWeight = "regular" | "medium" | "semibold" | "bold";

type ThemedTextProps = TextProps & {
  className?: string;
  size?: FontSize;
  weight?: FontWeight;
};

const fontSizes: Record<FontSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
};

const fontWeights: Record<FontWeight, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export function ThemedText({
  className = "",
  size = "md",
  weight = "regular",
  style,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      className={`text-foreground ${fontSizes[size]} ${className}`}
      style={[
        {
          fontFamily: "Jakarta",
          fontWeight: fontWeights[weight],
        },
        style,
      ]}
      {...props}
    />
  );
}
