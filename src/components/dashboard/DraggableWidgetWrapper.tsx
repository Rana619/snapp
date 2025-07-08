import React, { useEffect } from "react";
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";

interface DraggableWidgetWrapperProps {
  children: React.ReactNode;
  moveWidgets: (fromIndex: number, toIndex: number) => void;
  id: string;
  index: number;
  column:number
  width:number;
  height:number;
  isAdmin:boolean;
}
interface WidgetItem {
  type: string;
  id: number;
  index: number;
}

const DraggableWidgetWrapper = React.memo(
  ({ id, index, moveWidgets, children,width,height,column,isAdmin }: DraggableWidgetWrapperProps) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: "widget",
      hover(item: { index: number }, monitor: DropTargetMonitor) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;

        const { top, bottom, left, right } =
          ref.current.getBoundingClientRect();
        const hoverMiddleY = (bottom - top) / 2;
        const hoverMiddleX = (right - left) / 2;

        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        const hoverClientY = clientOffset.y - top;
        const hoverClientX = clientOffset.x - left;

        // only move when the mouse has crossed half of the widget height if vertical drag
        // or half of the widget width if horizontal drag
        const isHorizontalMove =
          Math.abs(clientOffset.x - monitor.getInitialClientOffset()!.x) >
          Math.abs(clientOffset.y - monitor.getInitialClientOffset()!.y);

        if (isHorizontalMove) {
          // dragging left→right: only swap once you cross midpoint on X
          if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
          // dragging right→left
          if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
        } else {
          // vertical fallback (if your grid wraps vertically)
          if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
          if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        }

        moveWidgets(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag,] = useDrag({
      type: "widget",
      item: () => ({ id, index }),
      collect: (m) => ({ isDragging: m.isDragging() }),
      canDrag:isAdmin,
      options: {
        dropEffect: "move",
      },
    });
useEffect(() => {
    if (isDragging) {
      document.body.classList.add("dragging");
    } else {
      document.body.classList.remove("dragging");
    }
  }, [isDragging]);


    drag(drop(ref));

    return (
      <div ref={ref}  style={{
          height:"100%",
          opacity: isDragging ? 0.5 : 1,
          cursor: isAdmin ? (isDragging ? "grabbing" : "grab") : "default",
        } as React.CSSProperties} 
      className={`col-span-${column} row-span-${height} sm:col-span-${Math.floor(column / 2)} lg:col-span-${width} `} >
        {children}
      </div>
    );
  }
);

export default DraggableWidgetWrapper;
