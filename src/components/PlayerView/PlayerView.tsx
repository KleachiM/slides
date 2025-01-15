import {useAppSelector} from "../../store/store";
import React, {useEffect, useRef, useState} from "react";
import {useActiveSlideEvents} from "../../customHooks/ActiveSlideEvents";
import styles from "../ActiveSlide/ActiveSlide.module.css";
import {SlideElementsItem} from "../SlideElementsItem";
import SelectionElement from "../Selection/SelectionElement";
import {useChangeFullScreenHandler, useDocumentKeyHandler} from "../../customHooks/DocumentKeyEvents";

export default function PlayerView(){
    const activeSlideId = useAppSelector(state => state.presentation.presentation.activeSlideId);
    const selection = useAppSelector(state => state.presentation.presentation.selection);
    const slides = useAppSelector(state => state.presentation.presentation.slides);
    const slide = slides.find(s => s.id === activeSlideId) || slides[0];

    const isFullScreen = useAppSelector(state => state.editor.fullscreenMode);
    const [deltaPoint, setPointDelta] = useState({x: 0, y: 0});
    const [deltaDim, setDimensionDelta] = useState({width: 0, height: 0});

    const slideRef = useRef<HTMLDivElement>(null);
    useActiveSlideEvents({slideRef});

    const [selectionX, setSelectionX] = useState(Infinity);
    const [selectionY, setSelectionY] = useState(Infinity);
    const [selectionWidth, setSelectionWidth] = useState(-1);
    const [selectionHeight, setSelectionHeight] = useState(-1);

    const isSelectionVisible = !isFullScreen
        && slide.slideData.length > 0 && selection.type === 'element' && selection.value.length > 0;

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
        if (selection.value.length > 0) {
            setSelectionX(minX);
            setSelectionY(minY);
            setSelectionWidth(maxX);
            setSelectionHeight(maxY);
        }
    }, [selection.value, slide.slideData]);

// no-repeat center / color
    useDocumentKeyHandler();
    useChangeFullScreenHandler();

    return <div className={`${styles.slideBorder} ${styles.preview}`}>
        <div
            className={`${styles.slide} ${styles.preview}`}
            style={typeof slide.background === "string"
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