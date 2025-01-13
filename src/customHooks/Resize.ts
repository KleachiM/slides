import {useEffect, RefObject, Dispatch, SetStateAction} from "react";
import {resizeElement} from "../actions/action-creator";
import {Dimension, Point} from "../types/presentationTypes";
import {useAppActions} from "../store/store";

export enum ResizerPosition {
    // TOP_LEFT = 'topLeft',
    // TOP_RIGHT = 'topRight',
    // BOTTOM_LEFT = 'bottomLeft',
    // BOTTOM_RIGHT = 'bottomRight',
    // TOP = 'top',
    // BOTTOM = 'bottom',
    // LEFT = 'left',
    // RIGHT = 'right',

    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right'
}

export type ResizeRef = {
    position: ResizerPosition,
    ref: RefObject<HTMLDivElement>
}

type ResizeProps = {
    resizers: Array<ResizeRef>,
    setPointDelta: Dispatch<SetStateAction<Point>>,
    setDimDelta: Dispatch<SetStateAction<Dimension>>
}

export function useResizeElements(props: ResizeProps){
    let resizer: ResizerPosition;
    let startPos = {x: 0, y: 0};
    let deltaPoint = {x: 0, y: 0};
    let deltaDim = {width: 0, height: 0};

    const {resizeElement} = useAppActions();

    useEffect(() => {
        props.resizers.forEach(item => {
            let handler;
            switch (item.position){
                case ResizerPosition.TOP_LEFT:
                    handler = mouseDownTopLeft;
                    break;
                case ResizerPosition.TOP_RIGHT:
                    handler = mouseDownTopRight;
                    break;
                case ResizerPosition.BOTTOM_LEFT:
                    handler = mouseDownBottomLeft;
                    break;
                case ResizerPosition.BOTTOM_RIGHT:
                    handler = mouseDownBottomRight;
                    break;
                case ResizerPosition.TOP:
                    handler = mouseDownTop;
                    break;
                case ResizerPosition.BOTTOM:
                    handler = mouseDownBottom;
                    break;
                case ResizerPosition.LEFT:
                    handler = mouseDownLeft;
                    break;
                case ResizerPosition.RIGHT:
                    handler = mouseDownRight;
                    break;
                default:
                    throw new Error("Unknown resizer position")
            }
            item.ref.current?.addEventListener('mousedown', handler);
        })
        return () => {
            document.removeEventListener('mousedown', mouseDownTopLeft);
            document.removeEventListener('mousedown', mouseDownTopRight);
            document.removeEventListener('mousedown', mouseDownBottomLeft);
            document.removeEventListener('mousedown', mouseDownBottomRight);
            document.removeEventListener('mousedown', mouseDownTop);
            document.removeEventListener('mousedown', mouseDownBottom);
            document.removeEventListener('mousedown', mouseDownLeft);
            document.removeEventListener('mousedown', mouseDownRight);
        }
    }, []);

    // region ResizeHandlers
    const mouseDownTopLeft = (event) => {
        resizer = ResizerPosition.TOP_LEFT;
        commonMouseDownHandler(event);
    }
    const mouseDownTopRight = (event) => {
        resizer = ResizerPosition.TOP_RIGHT;
        commonMouseDownHandler(event);
    }
    const mouseDownBottomLeft = (event) => {
        resizer = ResizerPosition.BOTTOM_LEFT;
        commonMouseDownHandler(event);
    }
    const mouseDownBottomRight = (event) => {
        resizer = ResizerPosition.BOTTOM_RIGHT;
        commonMouseDownHandler(event);
    }
    const mouseDownTop = (event) => {
        resizer = ResizerPosition.TOP;
        commonMouseDownHandler(event);
    }
    const mouseDownBottom = (event) => {
        resizer = ResizerPosition.BOTTOM;
        commonMouseDownHandler(event);
    }
    const mouseDownLeft = (event) => {
        resizer = ResizerPosition.LEFT;
        commonMouseDownHandler(event);
    }
    const mouseDownRight = (event) => {
        resizer = ResizerPosition.RIGHT;
        commonMouseDownHandler(event);
    }
    // endregion

    const commonMouseDownHandler = (event: MouseEvent) => {
        startPos = {x: event.pageX, y: event.pageY}
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        event.preventDefault();
        event.stopPropagation();
    };

    const mouseMoveHandler = (event) => {
        //todo: валидация позиции курсора, чтобы элементы не выезжал за пределы слайда
        const delta = {x: event.pageX - startPos.x, y: event.pageY - startPos.y};
        switch (resizer){
            case ResizerPosition.TOP_LEFT:
                deltaPoint = {x: delta.x, y: delta.y};
                deltaDim = {width: -delta.x, height: -delta.y};
                break;
            case ResizerPosition.TOP_RIGHT:
                deltaPoint = {x: 0, y: delta.y};
                deltaDim = {width: delta.x, height: -delta.y};
                break;
            case ResizerPosition.BOTTOM_LEFT:
                deltaPoint = {x: delta.x, y: 0};
                deltaDim = {width: -delta.x, height: delta.y};
                break;
            case ResizerPosition.BOTTOM_RIGHT:
                deltaPoint = {x: 0, y: 0};
                deltaDim = {width: delta.x, height: delta.y};
                break;
            case ResizerPosition.TOP:
                deltaPoint = {x: 0, y: delta.y};
                deltaDim = {width: 0, height: -delta.y};
                break;
            case ResizerPosition.BOTTOM:
                deltaPoint = {x: 0, y: 0};
                deltaDim = {width: 0, height: delta.y};
                break;
            case ResizerPosition.LEFT:
                deltaPoint = {x: delta.x, y: 0};
                deltaDim = {width: -delta.x, height: 0};
                break;
            case ResizerPosition.RIGHT:
                deltaPoint = {x: 0, y: 0};
                deltaDim = {width: delta.x, height: 0};
                break;
            default:
                throw new Error("Unknown resizer position")
        }
        if (deltaPoint.x !== 0 || deltaPoint.y !== 0){
            props.setPointDelta(deltaPoint);
        }
        if (deltaDim.width !== 0 || deltaDim.height !== 0){
            props.setDimDelta(deltaDim);
        }
    };

    const mouseUpHandler = () => {
        //todo: setSize in store
        if (deltaPoint.x !== 0 || deltaPoint.y !== 0 || deltaDim.width !== 0 || deltaDim.height !== 0){
            resizeElement(deltaPoint, deltaDim);
            props.setPointDelta({x:0, y:0});
            props.setDimDelta({width:0, height:0});
        }
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
}
