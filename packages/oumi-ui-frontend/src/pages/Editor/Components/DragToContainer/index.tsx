import React, { memo } from 'react';
import { useDrop } from 'react-dnd';
import { EditorDragType } from '../../config';

export default memo(
  (props: { itemData?: any; style?: any; className?: any; children?: any; dropCallback?: (item: any, itemData: any) => void }) => {
    const { itemData, dropCallback, children, style, className = '' } = props;

    const [collDrop, drop] = useDrop({
      accept: EditorDragType,
      drop: (item: any, monitor) => {
        // if (collDrop.isOverCurrent && item.id !== itemData.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        dropCallback && dropCallback(item, itemData);
        // }
      },
      collect: (monitor) => ({
        isOverCurrent: monitor.isOver({ shallow: true })
      })
    });

    let isHover = '';
    if (collDrop.isOverCurrent) {
      isHover = `drag-node-hover`;
    }

    return (
      <div className={`${className} ${isHover}`} ref={drop} style={style}>
        {children}
      </div>
    );
  }
);
