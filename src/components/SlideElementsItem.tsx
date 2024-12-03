import React from "react";
import {SlideElement} from "../types/presentationTypes";

type SlideElementProps = {
    slideElement: SlideElement
}
export function SlideElementsItem(props: SlideElementProps){
    // create common part of div
    if (props.slideElement.type === 'text')
        return <div
            style={{top: props.slideElement.point.x}}>
            Text element
        </div>

    if (props.slideElement.type === "image")
        return <image
            href={props.slideElement.source}
            x={props.slideElement.point.x}
            y={props.slideElement.point.y}
            width={props.slideElement.dimension.width}
            height={props.slideElement.dimension.height}
        />

    const unknownElement = <></>;
    return unknownElement
}