import React, {useRef} from "react";
import {useAppSelector} from "../store/store";
import {SlideElementsItem} from "./SlideElementsItem";
import './ActiveSlide.css'

export default function ActiveSlide(){
    const activeSlideId = useAppSelector(state => state.activeSlideId);
    const slides = useAppSelector(state => state.slides);
    const slide = slides.find(s => s.id === activeSlideId) || slides[0];
    return <div className="slide-border">
        <div
            className="slide"
            style={typeof slide.background === 'string'
                ? {backgroundColor: slide.background}
                : {backgroundImage: slide.background.source}}>
            {slide.slideData.map(e =>
                <SlideElementsItem key={e.id} slideElement={e} scale={1}/>)}
        </div>
    </div>
}
