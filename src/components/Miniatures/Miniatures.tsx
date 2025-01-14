import React from "react";
import styles from './Miniatures.module.css'
import {useAppSelector} from "../../store/store";
import Miniature from "./Miniature";

export default function Miniatures(){
    const slides = useAppSelector(state => state.presentation.presentation.slides);
    const activeSlideId = useAppSelector(state => state.presentation.presentation.activeSlideId);
    return <div className={styles.miniatures}>
        {slides.map((slide) =>
            <Miniature key={slide.id} slide={slide} activeSlideId={activeSlideId}/>
        )}
    </div>
}
