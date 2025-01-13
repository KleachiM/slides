import React, {useEffect, useRef, useState} from "react";
import {useAppSelector} from "../../store/store";
import {SlideElementsItem} from "../SlideElementsItem";
import SelectionElement from "../Selection/SelectionElement";
import styles from './ActiveSlide.module.css'
import {useActiveSlideEvents} from "../../customHooks/ActiveSlideEvents";

//todo: в контектсте использовать границы слайда
export default function ActiveSlide(){
    const activeSlideId = useAppSelector(state => state.presentation.activeSlideId);
    const selection = useAppSelector(state => state.presentation.selection);
    const slides = useAppSelector(state => state.presentation.slides);
    const slide = slides.find(s => s.id === activeSlideId) || slides[0];

    const [deltaPoint, setPointDelta] = useState({x: 0, y: 0});
    const [deltaDim, setDimensionDelta] = useState({width: 0, height: 0});

    const slideRef = useRef<HTMLDivElement>(null);
    useActiveSlideEvents({slideRef});

    const [selectionX, setSelectionX] = useState(Infinity);
    const [selectionY, setSelectionY] = useState(Infinity);
    const [selectionWidth, setSelectionWidth] = useState(-1);
    const [selectionHeight, setSelectionHeight] = useState(-1);

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

    useEffect(() => {
        console.log(`in useEffect sel length: ${selection.value.length}`)
        if (selection.value.length > 0) {
            setSelectionX(minX);
            setSelectionY(minY);
            setSelectionWidth(maxX);
            setSelectionHeight(maxY);
        }
    }, [selection.value, slide.slideData]);

    // // region UseEffectSelection
    // const isElementsSelectionEmpty = selection.type !== 'element' && selection.value.length === 0;
    // setSelectionX(isElementsSelectionEmpty
    //     ? -1
    //     : slide.slideData.reduce((minVal, item) =>
    //             selection.value.includes(item.id) && item.point.x < minVal
    //                 ? item.point.x
    //                 : minVal,
    //         Infinity)
    // );
    //
    // setSelectionY(isElementsSelectionEmpty
    //     ? -1
    //     : slide.slideData.reduce((minVal, item) =>
    //             selection.value.includes(item.id) && item.point.y < minVal
    //                 ? item.point.y
    //                 : minVal,
    //         Infinity)
    // );
    //
    // setSelectionWidth(isElementsSelectionEmpty
    //     ? -1
    //     : slide.slideData.reduce((maxVal, item) =>
    //             selection.value.includes(item.id) && (item.point.x + item.dimension.width - selectionX) > maxVal
    //                 ? (item.point.x + item.dimension.width - selectionX)
    //                 : maxVal,
    //         -1)
    // );
    //
    // setSelectionHeight(isElementsSelectionEmpty
    //     ? -1
    //     : slide.slideData.reduce((maxVal, item) =>
    //             selection.value.includes(item.id) && (item.point.y + item.dimension.height - selectionY) > maxVal
    //                 ? (item.point.y + item.dimension.height - selectionY)
    //                 : maxVal,
    //         -1));
    //
    // // endregion

    return <div className={styles.slideBorder}>
        <div
            className={styles.slide}
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
