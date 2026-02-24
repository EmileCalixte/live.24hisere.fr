import React from "react";
import { cn } from "tailwind-variants";
import { MenuList } from "./MenuList/MenuList";

interface SortListProps<T> {
  children: (item: T, isDragged: boolean, isDraggedOver: boolean) => React.ReactElement;
  keyFunction: (item: T) => React.Key;
  items: T[];
  setItems: (items: T[]) => void;
  isSorting: boolean;
  className?: string;
}

export default function SortList<T>({
  children,
  keyFunction,
  items,
  setItems,
  isSorting,
  className,
}: SortListProps<T>): React.ReactElement {
  const [dragItemIndex, setDragItemIndex] = React.useState<number | null>(null);
  const [dragOverItemIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleSort = React.useCallback(() => {
    if (dragItemIndex === null || dragOverItemIndex === null) {
      return;
    }

    const newItems = [...items];

    // Remove dragged item from temporary item array
    const draggedItem = newItems.splice(dragItemIndex, 1)[0];

    // Insert dragged item in temporary item array at new index
    newItems.splice(dragOverItemIndex, 0, draggedItem);

    setDragItemIndex(null);
    setDragOverIndex(null);

    setItems(newItems);
  }, [dragItemIndex, dragOverItemIndex, items, setItems]);

  const onDragStart = React.useCallback((e: React.DragEvent, index: number) => {
    setDragItemIndex(index);
  }, []);

  const onDragEnter = React.useCallback((e: React.DragEvent, index: number) => {
    setDragOverIndex(index);
  }, []);

  const onDragEnd = React.useCallback(() => {
    handleSort();
  }, [handleSort]);

  return (
    <MenuList className={className}>
      {items.map((item, index) => (
        <li
          key={keyFunction(item)}
          className={cn(isSorting && "sorting")}
          draggable={isSorting}
          onDragStart={
            isSorting
              ? (e) => {
                  onDragStart(e, index);
                }
              : undefined
          }
          onDragEnter={
            isSorting
              ? (e) => {
                  onDragEnter(e, index);
                }
              : undefined
          }
          onDragOver={
            isSorting
              ? (e) => {
                  e.preventDefault();
                }
              : undefined
          }
          onDragEnd={isSorting ? onDragEnd : undefined}
        >
          {children(item, index === dragItemIndex, index === dragOverItemIndex)}
        </li>
      ))}
    </MenuList>
  );
}
