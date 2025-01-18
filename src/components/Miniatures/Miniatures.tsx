import React, {MutableRefObject, useContext, useEffect, useRef} from "react";
import styles from './Miniatures.module.css'
import {useAppSelector} from "../../store/store";
import Miniature from "./Miniature";

type MiniaturesProps = {
    minRefs: MutableRefObject<HTMLDivElement[]>
}
export default function Miniatures(props: MiniaturesProps){
    const slides = useAppSelector(state => state.presentation.presentation.slides);
    const activeSlideId = useAppSelector(state => state.presentation.presentation.activeSlideId);

    props.minRefs.current = [];
    // useEffect(() => {
    //     props.minRefs.current = []
    // }, [slides]);

    const addToRefs = (el: HTMLDivElement) => {
        if (el && !props.minRefs.current.includes(el)) {
            props.minRefs.current.push(el);
        }
    };

    return <div className={styles.miniatures}>
        {slides.map((slide) =>
            <Miniature key={slide.id} slide={slide} activeSlideId={activeSlideId} addToRefs={addToRefs}/>
        )}
    </div>
}
