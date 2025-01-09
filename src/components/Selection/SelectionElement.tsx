import React, {Dispatch, SetStateAction, useRef} from "react";
import "./Selection.css"
import {ResizeRef, ResizerPosition, useResizeElements} from "../../customHooks/Resize";
import {Dimension, Point} from "../../types/presentationTypes";

//todo: брать размеры из store.selection
type SelectionProps = {
    top: number,
    left: number,
    width: number,
    height: number,
    setDelta: Dispatch<SetStateAction<Point>>,
    setDim: Dispatch<SetStateAction<Dimension>>,
}
export default function SelectionElement(props: SelectionProps){
    const borderThickness = 10;

    // const resizers = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right'];
    const topLeftRef: ResizeRef = {position: ResizerPosition.TOP_LEFT, ref: useRef<HTMLDivElement>(null)};
    const topRightRef: ResizeRef = {position: ResizerPosition.TOP_RIGHT, ref: useRef<HTMLDivElement>(null)};
    const bottomLeftRef: ResizeRef = {position: ResizerPosition.BOTTOM_LEFT, ref: useRef<HTMLDivElement>(null)};
    const bottomRightRef: ResizeRef = {position: ResizerPosition.BOTTOM_RIGHT, ref: useRef<HTMLDivElement>(null)};
    const topRef: ResizeRef = {position: ResizerPosition.TOP, ref: useRef<HTMLDivElement>(null)};
    const bottomRef: ResizeRef = {position: ResizerPosition.BOTTOM, ref: useRef<HTMLDivElement>(null)};
    const leftRef: ResizeRef = {position: ResizerPosition.LEFT, ref: useRef<HTMLDivElement>(null)};
    const rightRef: ResizeRef = {position: ResizerPosition.RIGHT, ref: useRef<HTMLDivElement>(null)};

    const resizers = [topLeftRef, topRightRef, bottomLeftRef, bottomRightRef, topRef, bottomRef, leftRef, rightRef];

    const divArr = resizers.map((direction, index) => (
        <div
            key={direction.position}
            className={`resize-handle ${direction.position}`}
            ref={resizers[index].ref}
        ></div>
    ));

    useResizeElements({resizers, setPointDelta: props.setDelta, setDimDelta: props.setDim})
    return <div className="resizable"
        style={{
            top: props.top - borderThickness,
            left: props.left - borderThickness,
            width: props.width + borderThickness * 2,
            height: props.height + borderThickness * 2,
        }}
    >
        {divArr}
    </div>
}