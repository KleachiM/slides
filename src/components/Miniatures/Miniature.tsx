import {Slide} from "../../types/presentationTypes";
import {SlideElementsItem} from "../SlideElementsItem";
import React, {useEffect, useRef, useState} from "react";
import {useAppActions, useAppSelector} from "../../store/store";
import styles from "./Miniatures.module.css"

type MiniatureProps = {
    slide: Slide,
    activeSlideId: string,
}
export default function Miniature(props: MiniatureProps){
    const {setActiveSlide, changeSlidePosition} = useAppActions();
    const slides = useAppSelector(state => state.presentation.presentation.slides);
    const activeSlideId = useAppSelector(state => state.presentation.presentation.activeSlideId);

    const miniatureRef = useRef<HTMLDivElement>(null);

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

    return <div
        key={props.slide.id}
        ref={miniatureRef}
        className={props.slide.id === props.activeSlideId ? `${styles.miniature} ${styles.active_slide}` : styles.miniature}
        style={typeof props.slide.background === 'string'
            ? {backgroundColor: props.slide.background}
            : {backgroundImage: props.slide.background.source}}
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