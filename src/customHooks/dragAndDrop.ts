import {Dispatch, RefObject, SetStateAction, useEffect} from "react";
import {Point} from "../types/presentationTypes";
import store from "../store/store";
import appReducer from "../store/reducer";

type DndProps = {
    ref: RefObject<HTMLTextAreaElement | SVGImageElement | null>,
    setPos: Dispatch<SetStateAction<Point>>
}

export function useDragAndDropElement(props: DndProps){
    let startPos = {x: 0, y: 0};
    let newPos = {x: 0, y: 0};

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
        // store.dispatch()
        document.addEventListener('mouseup', mouseUpHandler);
        event.preventDefault();
    };

    const mouseMoveHandler = (event) => {
        const delta = {
            x: event.pageX - startPos.x,
            y: event.pageY - startPos.y,
        }

        // newPos = {
        //     x:
        // }
    };

    const mouseUpHandler = () => {
        // set elem position
        // store.dispatch()

        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
    };
}