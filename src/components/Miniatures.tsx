import React from "react";
import './Miniatures.css'
import {useAppSelector} from "../store/store";
import {SlideElementsItem} from "./SlideElementsItem";

export default function Miniatures(){
    const slides = useAppSelector(state => state.slides);
    return <div className="miniatures">
        {slides.map((slide) => {
            return <div
                key={slide.id}
                className="miniature"
                style={typeof slide.background === 'string'
                    ? {backgroundColor: slide.background}
                    : {backgroundImage: slide.background.source}}>
                {slide.slideData.map(e =>
                    <SlideElementsItem key={e.id} slideElement={e} scale={0.25}/>
                )}
            </div>
        })}
    </div>
}
