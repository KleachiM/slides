import {Slide} from "../../types/presentationTypes";
import {SlideElementsItem} from "../SlideElementsItem";
import React, {useRef} from "react";
import {useAppActions} from "../../store/store";

type MiniatureProps = {
    slide: Slide,
    activeSlideId: string,
}
export default function Miniature(props: MiniatureProps){
    const {setActiveSlide} = useAppActions();
    const miniatureRef = useRef<HTMLDivElement>(null);
    return <div
        key={props.slide.id}
        ref={miniatureRef}
        className={props.slide.id === props.activeSlideId ? "miniature active_slide" : "miniature"}
        style={typeof props.slide.background === 'string'
            ? {backgroundColor: props.slide.background}
            : {backgroundImage: props.slide.background.source}}
        onMouseDown={() => setActiveSlide(props.slide.id)}
    >
        {props.slide.slideData.map(e =>
            <SlideElementsItem key={e.id} slideElement={e} scale={0.25}/>
        )}
    </div>
}