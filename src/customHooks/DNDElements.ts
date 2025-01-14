import {Dispatch, RefObject, SetStateAction, useEffect} from "react";
import {Point, SelectionType} from "../types/presentationTypes";
import {useAppActions, useAppSelector} from "../store/store";

type DndProps = {
    ref: RefObject<HTMLTextAreaElement | SVGImageElement | null>,
    setDelta: Dispatch<SetStateAction<Point>> | undefined,
    elemId: string
}

export function useDragAndDropElements(props: DndProps){
    let startPos = {x: 0, y: 0};
    let delta = {x: 0, y: 0};

    //todo: перенести useAppSelector в одно место
    const currentSelectionValue = useAppSelector(state => state.presentation.presentation.selection.value);
    const {setSelection, moveElement} = useAppActions();
    useEffect(() => {
          props.ref.current?.addEventListener('mousedown', mouseDownHandler);
          return () => props.ref.current?.removeEventListener('mousedown', mouseDownHandler);
    });

    const mouseDownHandler = (event) => {
        startPos = {x: event.pageX, y: event.pageY};
        if (!currentSelectionValue.includes(props.elemId)){
            let newSelection: SelectionType;
            if (event.shiftKey){
                if (!currentSelectionValue.includes(props.elemId))
                    newSelection = {type: 'element', value: [...currentSelectionValue, props.elemId]}
                else
                    newSelection = {type: 'element', value: [...currentSelectionValue]}
            }
            else
                newSelection = {type: 'element', value: [props.elemId]}

            setSelection(newSelection);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        event.preventDefault();
        event.stopPropagation();
    };

    const mouseMoveHandler = (event) => {
        //todo: валидация позиции курсора, чтобы элементы не выезжал за пределы слайда
        delta = {
            x: event.pageX - startPos.x,
            y: event.pageY - startPos.y,
        }

        if (props.setDelta)
            props.setDelta(delta);
    };

    const mouseUpHandler = () => {
        if ((delta.x || delta.y) && props.setDelta){
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