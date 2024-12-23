import React, {useRef, useState} from "react";
import {SlideElement} from "../types/presentationTypes";
import {useDragAndDropElement} from "../customHooks/dragAndDrop";

type SlideElementProps = {
    slideElement: SlideElement,
    scale: number,
}

export function SlideElementsItem(props: SlideElementProps){
    // create common part of div
    const ref = useRef<HTMLTextAreaElement & SVGImageElement>(null);
    const [deltaPoint, setPointDelta] = useState({x: 0, y: 0});
    const [deltaDim, setDimensionDelta] = useState({width: 0, height: 0});
    const elemId = props.slideElement.id;
    useDragAndDropElement({ref, setDelta: setPointDelta, elemId});

    const point = {
        x: props.slideElement.point.x + deltaPoint.x,
        y: props.slideElement.point.y + deltaPoint.y
    }

    const dimension = {
        width: props.slideElement.dimension.width + deltaDim.width,
        height: props.slideElement.dimension.height + deltaDim.height
    }

    console.log(`Props x: ${props.slideElement.point.x}. Delta: ${deltaPoint.x}. Point: ${point.x}`)
    console.log(`Props y: ${props.slideElement.point.y}. Delta: ${deltaPoint.y}. Point: ${point.y}`)
    const scale = props.scale;
    if (props.slideElement.type === 'text')
        return <textarea
            key={props.slideElement.id}
            ref={ref}
            style={{
                top: point.y * scale,
                left: point.x * scale,
                width: dimension.width * scale,
                height: dimension.height * scale,
                position: "absolute"
            }}
            defaultValue={props.slideElement.content}
            />
    if (props.slideElement.type === "image")
        return <image
            key={props.slideElement.id}
            ref={ref}
            href={props.slideElement.source}
            x={point.x * scale}
            y={point.y * scale}
            width={dimension.width * scale}
            height={dimension.height * scale}
        />

    const unknownElement = <div></div>;
    return unknownElement
}