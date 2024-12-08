import React from "react";
import {SlideElement} from "../types/presentationTypes";

type SlideElementProps = {
    slideElement: SlideElement,
    scale: number
}
export function SlideElementsItem(props: SlideElementProps){
    // create common part of div
    const scale = props.scale;
    if (props.slideElement.type === 'text')
        return <textarea key={props.slideElement.id}
            style={{
                top: props.slideElement.point.x * scale,
                left: props.slideElement.point.y * scale,
                width: props.slideElement.dimension.width * scale,
                height: props.slideElement.dimension.height * scale,
                position: "absolute"
            }}
            defaultValue={props.slideElement.content}
            />
    if (props.slideElement.type === "image")
        return <image key={props.slideElement.id}
            href={props.slideElement.source}
            x={props.slideElement.point.x}
            y={props.slideElement.point.y}
            width={props.slideElement.dimension.width}
            height={props.slideElement.dimension.height}
        />

    const unknownElement = <div></div>;
    return unknownElement
}