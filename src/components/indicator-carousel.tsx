import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
type IndicatorProps = {
  index: number;
  scrollX: Animated.SharedValue<number>;
  interval: number;
};

export function Indicator({ index, scrollX, interval }: IndicatorProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const position = scrollX.value / interval;

    const width = interpolate(
      position,
      [index - 1, index, index + 1],
      [8, 24, 8],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      position,
      [index - 1, index, index + 1],
      [0.45, 1, 0.45],
      Extrapolation.CLAMP,
    );

    return {
      width,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 999,
          backgroundColor: "red",
        },
        animatedStyle,
      ]}
    />
  );
}
