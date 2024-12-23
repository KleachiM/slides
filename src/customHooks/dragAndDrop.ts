import {Dispatch, RefObject, SetStateAction, useEffect} from "react";
import {Point, SelectionType} from "../types/presentationTypes";
import {useAppActions, useAppSelector} from "../store/store";

type DndProps = {
    ref: RefObject<HTMLTextAreaElement | SVGImageElement | null>,
    setDelta: Dispatch<SetStateAction<Point>>,
    elemId: string
}

export function useDragAndDropElement(props: DndProps){
    let startPos = {x: 0, y: 0};
    let delta = {x: 0, y: 0};

    const currentSelectionValue = useAppSelector(state => state.selection.value);
    const {setSelection, moveElement} = useAppActions();
    useEffect(() => {
          props.ref.current?.addEventListener('mousedown', mouseDownHandler);
          return () => props.ref.current?.removeEventListener('mousedown', mouseDownHandler);
    });

    const mouseDownHandler = (event) => {
        startPos = {
            x: event.pageX,
            y: event.pageY
        };
        // add elem to selection
        const newSelection: SelectionType = event.shiftKey
            ? {type: 'element', value: [...currentSelectionValue, props.elemId]}
            : {type: 'element', value: [props.elemId]}

        setSelection(newSelection);

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        event.preventDefault();
    };

    const mouseMoveHandler = (event) => {
        // delta = {
        //     x: event.pageX - startPos.x,
        //     y: event.pageY - startPos.y,
        // }

        if (isValidMousePosition(event.pageX)){
            delta.x = event.pageX - startPos.x
        }

        props.setDelta(delta);
    };

    const mouseUpHandler = () => {
        console.log(`End drop. Delta: x: ${delta.x}. y: ${delta.y}`);

        if (delta.x || delta.y){
            moveElement(delta);
            props.setDelta({x: 0,y: 0});
        }
        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
    };
}

function isValidMousePosition(event: MouseEvent){
    
    return true;
}