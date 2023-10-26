// @ts-nocheck
import {  useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core'
import React from 'react';

import type { FC } from 'react'
import styled from '@emotion/styled';
import { useRef } from 'react'

export const ItemTypes = {
  MovableItem: 'card',
}


const style = {
  // border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  // marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const DraggableItem = styled.div((props): { disabled: boolean } => `
// ${!props.disabled ? `
// border: 1px dashed;
// margin: 10px;
// `: ``}
`)

export interface MovableItemProps {
  id: any
  children?: React.ReactNode;
  disabled?: boolean;
  index: number
  moveItem: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const MovableItem: FC<MovableItemProps> = ({ id, text, index, moveItem, children, disabled }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.MovableItem,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.MovableItem,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1;
  if (disabled) {
    return <DraggableItem disabled={disabled} className='draggable-item'>{ children}</DraggableItem>;
  };
  drag(drop(ref))
  return <DraggableItem ref={ref} className='draggable-item' style={{ ...style, opacity }} data-handler-id={handlerId}>
  {children}
</DraggableItem>
}

  
  
  
  
  
  
  
  