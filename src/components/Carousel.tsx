import React, { useMemo } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type CarouselGrid = {
  rows: number;
  columns: number;
};

type CarouselProps<T> = {
  data: T[];

  renderItem: (item: T, index: number) => React.ReactNode;

  currentIndex: number;
  onIndexChange: (index: number) => void;

  /**
   * No modo normal:
   * largura de cada item.
   *
   * No modo grid:
   * largura da página inteira.
   */
  itemWidth: number;

  itemHeight?: number;

  gap?: number;

  withoutIndicator?: boolean;

  grid?: CarouselGrid;
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export function Carousel<T>({
  data,
  renderItem,
  currentIndex,
  onIndexChange,
  itemWidth,
  gap = 12,
  itemHeight,
  withoutIndicator = false,
  grid,
}: CarouselProps<T>) {
  const scrollX = useSharedValue(0);

  const { height } = useWindowDimensions();

  const isGrid = !!grid;

  /*
   * Quantos itens existem em cada página.
   *
   * Normal:
   * 1 item
   *
   * 2x2:
   * 4 itens
   */
  const itemsPerPage = grid ? grid.rows * grid.columns : 1;

  const pages = useMemo(() => {
    if (!grid) {
      return data.map((item) => [item]);
    }

    const result: T[][] = [];

    for (let i = 0; i < data.length; i += itemsPerPage) {
      result.push(data.slice(i, i + itemsPerPage));
    }

    return result;
  }, [data, grid, itemsPerPage]);

  /*
   * A distância entre páginas.
   *
   * No grid a página inteira ocupa itemWidth.
   */
  const interval = itemWidth;

  const snapOffsets = pages.map((_, index) => index * interval);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / interval);

    const clampedIndex = Math.max(0, Math.min(index, pages.length - 1));

    if (clampedIndex !== currentIndex) {
      onIndexChange(clampedIndex);
    }
  };

  return (
    <>
      <AnimatedFlatList
        data={pages}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapOffsets}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        scrollEventThrottle={16}
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        windowSize={5}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          height: itemHeight ?? height / 2,
        }}
        ItemSeparatorComponent={
          grid
            ? undefined
            : () => (
                <View
                  style={{
                    width: gap,
                  }}
                />
              )
        }
        renderItem={({ item: page, index: pageIndex }) => {
          /*
           * ==================================
           * GRID
           * ==================================
           */
          if (grid) {
            const { rows, columns } = grid;

            const pageHeight = itemHeight ?? height / 2;

            const cardWidth = (itemWidth - gap * (columns - 1)) / columns;

            const cardHeight = (pageHeight - gap * (rows - 1)) / rows;

            return (
              <View
                style={{
                  width: itemWidth,
                  height: pageHeight,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    gap,
                  }}
                >
                  {Array.from({
                    length: rows,
                  }).map((_, rowIndex) => (
                    <View
                      key={rowIndex}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        gap,
                      }}
                    >
                      {Array.from({
                        length: columns,
                      }).map((_, columnIndex) => {
                        const itemIndex = rowIndex * columns + columnIndex;

                        const item = page[itemIndex];

                        if (!item) {
                          return (
                            <View
                              key={columnIndex}
                              style={{
                                width: cardWidth,
                                height: cardHeight,
                              }}
                            />
                          );
                        }

                        return (
                          <View
                            key={columnIndex}
                            style={{
                              width: cardWidth,
                              height: cardHeight,
                            }}
                          >
                            {renderItem(
                              item,
                              pageIndex * itemsPerPage + itemIndex,
                            )}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            );
          }

          /*
           * ==================================
           * CAROUSEL NORMAL
           * ==================================
           */
          return (
            <View
              style={{
                width: itemWidth,
              }}
            >
              {renderItem(page[0], pageIndex)}
            </View>
          );
        }}
      />

      {!withoutIndicator && (
        <View className="mt-4 flex-row justify-center gap-2">
          {pages.map((_, index) => (
            <Indicator
              key={index}
              index={index}
              scrollX={scrollX}
              interval={interval}
            />
          ))}
        </View>
      )}
    </>
  );
}

type IndicatorProps = {
  index: number;
  scrollX: Animated.SharedValue<number>;
  interval: number;
};

function Indicator({ index, scrollX, interval }: IndicatorProps) {
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
          height: 8,
          borderRadius: 999,
        },
        animatedStyle,
      ]}
      className="bg-primary"
    />
  );
}
