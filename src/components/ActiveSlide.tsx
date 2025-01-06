import React, {useRef, useState} from "react";
import {useAppSelector} from "../store/store";
import {SlideElementsItem} from "./SlideElementsItem";
import SelectionElement from "./SelectionElement";
import './ActiveSlide.css'
import {useActiveSlideEvents} from "../customHooks/ActiveSlideEvents";
import {SlideElement} from "../types/presentationTypes";

//todo: в контектсте использовать границы слайда
export default function ActiveSlide(){
    const activeSlideId = useAppSelector(state => state.activeSlideId);
    const selection = useAppSelector(state => state.selection);
    const slides = useAppSelector(state => state.slides);
    const slide = slides.find(s => s.id === activeSlideId) || slides[0];

    const [deltaPoint, setPointDelta] = useState({x: 0, y: 0});
    const [deltaDim, setDimensionDelta] = useState({width: 0, height: 0});

    const slideRef = useRef<HTMLDivElement>(null);
    useActiveSlideEvents({slideRef});

    const isSelectionVisible = slide.slideData.length > 0 && selection.type === 'element' && selection.value.length > 0;

    // region SelectionInfo
    const minX = selection.type !== 'element' && selection.value.length === 0
        ? -1
        : slide.slideData.reduce((minVal, item) =>
            selection.value.includes(item.id) && item.point.x < minVal
                ? item.point.x
                : minVal,
            Infinity);

    const minY = selection.type !== 'element' && selection.value.length === 0
        ? -1
        : slide.slideData.reduce((minVal, item) =>
            selection.value.includes(item.id) && item.point.y < minVal
                ? item.point.y
                : minVal,
            Infinity);

    const maxX = selection.type !== 'element' && selection.value.length === 0
        ? -1
        : slide.slideData.reduce((maxVal, item) =>
            selection.value.includes(item.id) && (item.point.x + item.dimension.width - minX) > maxVal
                ? (item.point.x + item.dimension.width - minX)
                : maxVal,
            -1);

    const maxY = selection.type !== 'element' && selection.value.length === 0
        ? -1
        : slide.slideData.reduce((maxVal, item) =>
                selection.value.includes(item.id) && (item.point.y + item.dimension.height - minY) > maxVal
                    ? (item.point.y + item.dimension.height - minY)
                    : maxVal,
            -1);
    // endregion

    return <div className="slide-border">
        <div
            className="slide"
            style={typeof slide.background === 'string'
                ? {backgroundColor: slide.background}
                : {backgroundImage: slide.background.source}}
            ref={slideRef}
        >
            {slide.slideData.map(e =>
                <SlideElementsItem
                    key={e.id}
                    slideElement={e}
                    scale={1}
                    setDelta={setPointDelta}
                    deltaPoint={(selection.type === 'element' && selection.value.includes(e.id)) ? deltaPoint : undefined}
                />)
            }
            {isSelectionVisible && <SelectionElement
                top={minY + deltaPoint.y}
                left={minX + deltaPoint.x}
                width={maxX + deltaDim.width}
                height={maxY + deltaDim.height}
                setDelta={setPointDelta}
                setDim={setDimensionDelta}
            />}
        </div>
    </div>
}
