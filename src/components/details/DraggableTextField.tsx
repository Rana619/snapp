import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd';
interface TextFieldProps{
children?: React.ReactNode;
id:string,
moveBox: (dragIndex: number, hoverIndex: number,type:string) => void;
index: number;
isAdmin:boolean;
}
interface TextFieldItem {
  type: string;
  id: string;
  index: number;
}

const DraggableTextField = ({children , id,moveBox, index,isAdmin}:TextFieldProps) => {

    const textFieldRef = useRef(null);

    const [{isDragging},dragRef] = useDrag({
                    type:"text-field",
                    item:{
                      type:"text-field",
                      id: id,
                      index: index
                    },
                    canDrag:isAdmin,
                    collect:(monitor)=>({
                      isDragging: !!monitor.isDragging(),
                    })
                  })

    const [, dropRef] = useDrop({
    accept: "text-field",
    hover: (item:TextFieldItem) => {
        if (item.index !== index) {
        moveBox(item.index, index,"text-field");
        item.index = index;
      }
    }
  });
  dragRef(dropRef(textFieldRef));
  return (
    <div ref={textFieldRef} >
        {children}
    </div>
  )
}

export default DraggableTextField