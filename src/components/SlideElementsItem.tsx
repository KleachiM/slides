import React, {Dispatch, SetStateAction, useRef, useState} from "react";
import {Dimension, Point, SlideElement} from "../types/presentationTypes";
import {useDragAndDropElements} from "../customHooks/DragAndDrop";

type SlideElementProps = {
    slideElement: SlideElement,
    scale: number,
    setDelta?: Dispatch<SetStateAction<Point>>,
    deltaPoint?: Point,
    setDimension?: Dispatch<SetStateAction<Dimension>>,
    deltaDim?: Dimension
}

export function SlideElementsItem(props: SlideElementProps){
    const ref = useRef<HTMLTextAreaElement & SVGImageElement>(null);
    const elemId = props.slideElement.id;
    useDragAndDropElements({ref, setDelta: props.setDelta, elemId});

    // const deltaDim = {width: 0, height: 0};
    // const deltaPoint = props.deltaPoint === undefined ? {x: 0, y: 0} : {x: props.deltaPoint.x, y: props.deltaPoint.y};
    const scale = props.scale;
    if (props.slideElement.type === 'text')
        return <textarea
            key={props.slideElement.id}
            ref={ref}
            style={{
                top: props.slideElement.point.y * scale, //(props.slideElement.point.y + deltaPoint.y) * scale,
                left: props.slideElement.point.x * scale, //(props.slideElement.point.x + deltaPoint.x) * scale,
                width: props.slideElement.dimension.width * scale, //(props.slideElement.dimension.width + deltaDim.width) * scale,
                height: props.slideElement.dimension.height * scale, //(props.slideElement.dimension.height + deltaDim.height) * scale,
                position: "absolute"
            }}
            defaultValue={props.slideElement.content}
            />
    if (props.slideElement.type === "image")
        return <image
            key={props.slideElement.id}
            ref={ref}
            href={props.slideElement.source}
            x={props.slideElement.point.x * scale}
            y={props.slideElement.point.y * scale}
            width={props.slideElement.dimension.width * scale}
            height={props.slideElement.dimension.height * scale}
        />

    const unknownElement = <div></div>;
    return unknownElement
}