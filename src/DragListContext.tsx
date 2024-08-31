// Much of this comes from concepts in https://github.com/computerjazz/react-native-draggable-flatlist/blob/main/src/context/draggableFlatListContext.tsx
import React, { useContext, useMemo } from "react";
import { Animated, LayoutRectangle } from "react-native";

// A map of each item's layout rectangle, used to calculate how much space to
// make for an item being dragged.
export interface LayoutCache {
  [key: string]: LayoutRectangle;
}

// This all basically enables us to pass data into a CellRendererComponent,
// which we otherwise don't control the props to.
type ContextProps<T> = {
  activeKey: string | null;
  activeIndex: number;
  keyExtractor: (item: T, index: number) => string;
  pan: Animated.Value;
  panIndex: number;
  layouts: LayoutCache;
  focusedIndex?: number;
  children: React.ReactNode;
};

type DragListContextValue<T> = Omit<ContextProps<T>, "children">;

const DragListContext = React.createContext<
  DragListContextValue<any> | undefined
>(undefined);

export function DragListProvider<T>({
  activeKey,
  activeIndex,
  keyExtractor,
  pan,
  panIndex,
  layouts,
  children,
  focusedIndex,
}: ContextProps<T>) {
  const value = useMemo(
    () => ({
      activeKey,
      activeIndex,
      keyExtractor,
      pan,
      panIndex,
      layouts,
      focusedIndex,
    }),
    [activeKey, activeIndex, keyExtractor, pan, panIndex, layouts, focusedIndex]
  );

  return (
    <DragListContext.Provider value={value}>
      {children}
    </DragListContext.Provider>
  );
}

export function useDragListContext<T>() {
  const value = useContext(DragListContext);
  if (!value) {
    throw new Error(
      "useDragListContext must be called within DragListProvider"
    );
  }
  return value as DragListContextValue<T>;
}
