import React, { useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd';

interface DraggableButtonProps {
children?: React.ReactNode,
moveCard:(fromIndex:number,toIndex:number,type:string)=> void,
index:number;
id:number| string;
dragType: string | null;
className?:string
setDragType: React.Dispatch<React.SetStateAction<string | null>>;
contentType:string;
isAdmin: boolean;
}
interface CardItem {
    type: string;
    id:Number;
    index:number;
}


const DraggableWrapper = ({children,moveCard,index,id,
  dragType, setDragType,contentType,className,isAdmin
}:DraggableButtonProps) => {

const cardRef = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: contentType,
    item: { id, index, type: contentType },
    canDrag: () => (isAdmin && (dragType === null || dragType === contentType)),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    options: {
      dropEffect: 'move',
    },
  }), [dragType]);
  

const [, dropRef] = useDrop({
    accept: contentType,
   hover(item: { index: number }, monitor: DropTargetMonitor) {
           if (!cardRef.current) return;
           const dragIndex = item.index;
           const hoverIndex = index;
           if (dragIndex === hoverIndex) return;
   
           const { top, bottom, left, right } =
             cardRef.current.getBoundingClientRect();
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
   
           moveCard(dragIndex, hoverIndex,contentType);
           item.index = hoverIndex;
         },
  });

  useEffect(() => {
if (isDragging) {
  setDragType(contentType);
} else if (dragType === contentType) {
  setDragType(null);
}
  }, [isDragging]);
dragRef(dropRef(cardRef));
  
  return (
<div ref={cardRef} onClick={(e)=>e.stopPropagation()} 
className={`${className}`} >
    {children}
</div>
  )
}

export default DraggableWrapper