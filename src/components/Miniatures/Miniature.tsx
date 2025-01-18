import {Image, Slide} from "../../types/presentationTypes";
import {SlideElementsItem} from "../SlideElementsItem";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {useAppActions, useAppSelector} from "../../store/store";
import styles from "./Miniatures.module.css"
import {backGroundTypeIsImage} from "../../utils/utils";

type AddToRefsType = (el: HTMLDivElement) => void;

type MiniatureProps = {
    slide: Slide,
    activeSlideId: string,
    // refs: MutableRefObject<HTMLDivElement[]>,
    addToRefs: AddToRefsType
}
export default function Miniature(props: MiniatureProps){
    const {setActiveSlide, changeSlidePosition} = useAppActions();
    const slides = useAppSelector(state => state.presentation.presentation.slides);
    const activeSlideId = useAppSelector(state => state.presentation.presentation.activeSlideId);

    // const miniatureRef = useRef<HTMLDivElement>(null);

    const [draggedIndex, setDraggedIndex] = useState<number>(-1);

    useEffect(() =>
    {
        let index = slides.findIndex(s => s.id === activeSlideId);
        setDraggedIndex(index);
    }, [activeSlideId]);
    const handleDragStart = () => {
        let index = slides.findIndex(s => s.id === activeSlideId);
        setDraggedIndex(index);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (id) => {
        if (draggedIndex < 0){
            return;
        }

        const newIndex = slides.findIndex(s => s.id === id);
        changeSlidePosition(newIndex);
    };

    const handleMouseDown = (id) => {
        setActiveSlide(id);
    }

    let style = {
        backgroundColor: '',
        backgroundImage: ''
    }
    if (backGroundTypeIsImage(props.slide.background))
        style.backgroundImage = `url(${(props.slide.background as Image).source})`;
    else
        style.backgroundColor = `${props.slide.background}`

    return <div
        key={props.slide.id}
        ref={props.addToRefs}
        className={props.slide.id === props.activeSlideId ? `${styles.miniature} ${styles.active_slide}` : styles.miniature}
        style={style}
        onMouseDown={() => handleMouseDown(props.slide.id)}
        onDragStart={() => handleDragStart()}
        onDrop={() => handleDrop(props.slide.id)}
        onDragOver={handleDragOver}
        draggable={true}
    >
        {props.slide.slideData.map(e =>
            <SlideElementsItem key={e.id} slideElement={e} scale={0.25}/>
        )}
    </div>
}