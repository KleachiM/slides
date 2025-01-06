import {Dispatch, RefObject, SetStateAction, useEffect} from "react";
import {useAppActions} from "../store/store";
import {SelectionType} from "../types/presentationTypes";

type ActiveSlideEventsProps = {
    slideRef: RefObject<HTMLDivElement | null>,
    // SetSelectionVisibility: Dispatch<SetStateAction<boolean>> | undefined,
}
export function useActiveSlideEvents(props: ActiveSlideEventsProps){
    const {setSelection} = useAppActions();

    useEffect(() => {
        props.slideRef.current?.addEventListener('mousedown', mouseDownHandler);
        return () => props.slideRef.current?.removeEventListener('mousedown', mouseDownHandler);
    });

    const mouseDownHandler = (event) => {

        const emptySelection: SelectionType = {type: 'element', value: []};
        setSelection(emptySelection);

        // if (props.SetSelectionVisibility)
        //     props.SetSelectionVisibility(false);

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        event.preventDefault();
    }

    const mouseMoveHandler = (event) => {

    }

    const mouseUpHandler = () => {

        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', mouseMoveHandler);
    }
}