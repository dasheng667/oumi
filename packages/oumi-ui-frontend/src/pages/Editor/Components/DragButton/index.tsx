/* eslint-disable @typescript-eslint/no-shadow */
import type { MouseEvent } from 'react';
import React, { useMemo, memo, useRef, useState } from 'react';
import type { DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
// import { Tooltip } from 'antd';

export const DragTypeName = 'EditorDragType';

interface IProps {
  className?: string;
  dragType: string;

  /**
   * 传入的数据
   */
  itemData: any;
  /**
   * 拖拽手柄
   */
  handle?: boolean;
  children: any;

  /** 是否支持放入 */
  isDrop?: boolean;

  onBegin?: (monitor: DragSourceMonitor) => void;
  onEnd?: (draggedItem: any, monitor: DragSourceMonitor) => void;
  onClick?: (e: MouseEvent, itemData: any) => void;

  /**
   * 放入的回调
   */
  dropCallback?: (sourceData: any, targetData: any) => void;

  checkTargetIsChild?: (nodeId: string, targetId: string) => boolean;
}

const DragButton = memo((props: IProps) => {
  const { className, itemData, dragType, handle, dropCallback, isDrop, onBegin, onEnd, onClick, children, checkTargetIsChild } = props;
  // const [dropDirection, setDropDirection] = useState<DragDirection>(''); // 放入目标位置是左边还是右边
  const ref = useRef<HTMLDivElement>(null);

  // 拖拽实例
  const [collDrag, drag, dragPreview] = useDrag({
    item: {
      ...itemData,
      type: dragType
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
      getSourceClientOffset: monitor.getSourceClientOffset()
    }),
    begin: (monitor: DragSourceMonitor) => {
      if (typeof onBegin === 'function') {
        onBegin(monitor);
      }
    },
    end: (draggedItem: any, monitor: DragSourceMonitor) => {
      if (typeof onEnd === 'function') {
        onEnd(draggedItem, monitor);
      }
    }
  });

  const onButtonClick = (e: MouseEvent, itemData: any) => {
    if (typeof onClick === 'function') {
      onClick(e, itemData);
    }
  };

  const { isDragging } = collDrag;

  const containerStyle = useMemo(
    () => ({
      opacity: isDragging ? 0.4 : 1,
      cursor: !handle ? 'move' : 'default'
    }),
    [isDragging]
  );

  // 被放入的实例
  const [collDrop, drop] = useDrop({
    accept: DragTypeName,
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      didDrop: monitor.didDrop(),
      getItem: monitor.getItem(),
      getSourceClientOffset: monitor.getSourceClientOffset()
    }),
    hover(item: any, monitor: DropTargetMonitor) {},
    drop(item: any, monitor: DropTargetMonitor) {
      if (typeof dropCallback === 'function' && collDrop.isOver) {
        dropCallback({ ...item }, itemData);
      }
      return { moved: true };
    },
    canDrop(item) {
      // 排除自己
      // if ((item && item.id) === (itemData && itemData.id)) return false;

      // 目标是子元素
      // if (checkTargetIsChild && item && item.id) return !checkTargetIsChild(item.id, itemData.id);
      return true;
    }
  });

  if (!isDrop) {
    return (
      <div className={`${className} drag-preview`} style={{ ...containerStyle }} ref={ref} onClick={(e) => onButtonClick(e, itemData)}>
        {drag(<div>{children}</div>)}
      </div>
    );
  }

  /**
   * 使用 drag 和 drop 对 ref 进行包裹，则组件既可以进行拖拽也可以接收拖拽组件
   * 使用 dragPreview 包裹组件，可以实现拖动时预览该组件的效果
   */
  dragPreview(drop(ref));

  let isHover = '';
  if (collDrop.isOver && collDrop.canDrop) {
    isHover = `node-hover`;
  }

  console.log('itemData', itemData);

  // 容器宽度100%
  // if (handle) {
  //   return (
  //     <div
  //       className={`drag-preview racoon-col ${isHover}`}
  //       style={{ ...containerStyle }}
  //       ref={ref}
  //       onClick={(e) => onButtonClick(e, itemData)}
  //     >
  //       {drag(
  //         <div className="handle">
  //           <i className="iconfont icontuozhuai1" title="拖动更换位置" />
  //         </div>,
  //       )}
  //       {children}
  //     </div>
  //   );
  // }

  return (
    <div
      className={`${className} drag-preview ${isHover}`}
      style={{ ...containerStyle }}
      ref={ref}
      onClick={(e) => onButtonClick(e, itemData)}
    >
      {drag(<div>{children}</div>)}
    </div>
  );
});

export default DragButton;
