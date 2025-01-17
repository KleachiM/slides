import React, {useEffect, useRef, useState} from "react";
import {useAppActions, useAppSelector} from "../../store/store";
import {SlideElementsItem} from "../SlideElementsItem";
import SelectionElement from "../Selection/SelectionElement";
import styles from './ActiveSlide.module.css'
import {useActiveSlideEvents} from "../../customHooks/ActiveSlideEvents";
import {Image} from "../../types/presentationTypes";
import {backGroundTypeIsImage} from "../../utils/utils";
import * as url from "url";

//todo: в контектсте использовать границы слайда
export default function ActiveSlide(){
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

    let style = {
        backgroundColor: '',
        backgroundImage: '',
        backgroundSize: '',
        backgroundPosition: '',
        backgroundRepeat: ''
    }
    if (backGroundTypeIsImage(slide.background)) {
        style.backgroundImage = `url(${(slide.background as Image).source})`;
        style.backgroundSize = '100% 100%';
        style.backgroundPosition = 'center';
        style.backgroundRepeat = 'no-repeat';
    }
    else
        style.backgroundColor = `${slide.background}`


// no-repeat center / color
    return <div className={styles.slideBorder}>
        <div
            className={styles.slide}
            style={style}
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
