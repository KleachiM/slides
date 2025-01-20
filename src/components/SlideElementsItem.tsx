import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {Dimension, Point, SlideElement} from "../types/presentationTypes";
import {useDragAndDropElements} from "../customHooks/DNDElements";
import {useAppActions, useAppSelector} from "../store/store";

type SlideElementProps = {
    slideElement: SlideElement,
    scale: number,
    setDelta?: Dispatch<SetStateAction<Point>>,
    deltaPoint?: Point,
    setDimension?: Dispatch<SetStateAction<Dimension>>,
    deltaDim?: Dimension
}

export function SlideElementsItem(props: SlideElementProps){
    const {changeTextProperty} = useAppActions();
    const ref = useRef<HTMLTextAreaElement & HTMLImageElement>(null);
    const elemId = props.slideElement.id;
    useDragAndDropElements({ref, setDelta: props.setDelta, elemId});

    const currentSelection = useAppSelector(state => state.presentation.presentation.selection);

    const [textValue, setText] = useState('');
    useEffect(() => {
        if (!isReadOnly){
            console.log(`changing selection val: ${textValue}`)
            changeTextProperty('content', textValue);
        }
    }, [currentSelection]);

    const scale = props.scale;
    const isReadOnly = props.scale < 1;
    if (props.slideElement.type === 'text')
        return <textarea
            key={props.slideElement.id}
            ref={ref}
            readOnly={isReadOnly}
            onDoubleClick={(event) => {
                if (!isReadOnly) {
                    event.preventDefault();
                    ref.current?.focus();
                }
            }}
            onChange={(event) => {
                if (!isReadOnly)
                    console.log('setting txt on change')
                    setText(event.target.value);
            }}
            onBlur={(event) => {
                if (!isReadOnly) {
                    changeTextProperty('content', event.target.value);
                }
            }}

            style={{
                border: 'unset',
                outline: 'unset',
                backgroundColor: "transparent",
                top: props.slideElement.point.y * scale,
                left: props.slideElement.point.x * scale,
                width: props.slideElement.dimension.width * scale,
                height: props.slideElement.dimension.height * scale,
                position: "absolute",
                fontFamily: props.slideElement.fontFamily,
                fontSize: props.slideElement.fontSize * scale,
                fontStyle: props.slideElement.fontStyle,
                fontWeight: props.slideElement.fontWeight,
                color: props.slideElement.fontColor
            }}
            defaultValue={props.slideElement.content}
            />
    if (props.slideElement.type === "image")
        return <img
            key={props.slideElement.id}
            ref={ref}
            src={props.slideElement.source}
            width={props.slideElement.dimension.width * scale}
            height={props.slideElement.dimension.height * scale}
            style={{position: 'absolute', left: props.slideElement.point.x * scale, top: props.slideElement.point.y * scale}}
        />

    const unknownElement = <div></div>;
    return unknownElement
}