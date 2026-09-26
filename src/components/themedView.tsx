import { View, type ViewProps } from "react-native";

type ThemeViewProps = ViewProps & {
  className?: string;
};

export function ThemeView({ className, children, ...props }: ThemeViewProps) {
  return (
    <View {...props} className={`bg-background ${className ?? ""}`}>
      {children}
    </View>
  );
}
