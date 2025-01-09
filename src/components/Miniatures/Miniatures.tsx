import React from "react";
import './Miniatures.css'
import {useAppSelector} from "../../store/store";
import Miniature from "./Miniature";

export default function Miniatures(){
    const slides = useAppSelector(state => state.slides);
    const activeSlideId = useAppSelector(state => state.activeSlideId);
    return <div className="miniatures">
        {slides.map((slide) =>
            <Miniature key={slide.id} slide={slide} activeSlideId={activeSlideId}/>
        )}
    </div>
}
