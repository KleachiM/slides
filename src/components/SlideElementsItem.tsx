import React, {Dispatch, SetStateAction, useRef, useState} from "react";
import {Dimension, Point, SlideElement} from "../types/presentationTypes";
import {useDragAndDropElements} from "../customHooks/DNDElements";

type SlideElementProps = {
    slideElement: SlideElement,
    scale: number,
    setDelta?: Dispatch<SetStateAction<Point>>,
    deltaPoint?: Point,
    setDimension?: Dispatch<SetStateAction<Dimension>>,
    deltaDim?: Dimension
}

export function SlideElementsItem(props: SlideElementProps){
    const ref = useRef<HTMLTextAreaElement & HTMLImageElement>(null);
    const elemId = props.slideElement.id;
    useDragAndDropElements({ref, setDelta: props.setDelta, elemId});

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
            onBlur={(event) => {
                if (!isReadOnly) {
                    // store.dispatch(presentationActions.setText(event.target.value));
                }
            }}
            style={{
                top: props.slideElement.point.y * scale,
                left: props.slideElement.point.x * scale,
                width: props.slideElement.dimension.width * scale,
                height: props.slideElement.dimension.height * scale,
                position: "absolute",
                fontFamily: props.slideElement.fontFamily,
                fontSize: props.slideElement.fontSize * scale,
                fontStyle: props.slideElement.fontStyle,
                fontWeight: props.slideElement.fontWeight
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