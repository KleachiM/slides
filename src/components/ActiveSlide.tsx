import React from "react";
import {connect} from "react-redux";
import store from "../store/store";
import {Slide} from "../types/presentationTypes";
import {SlideElementsItem} from "./SlideElementsItem";
import './ActiveSlide.css'

type SlideProps = {
    slide: Slide
}

export function ActiveSlide(props: SlideProps){
    return <div className="slide-border">
        <div
            className="slide"
            style={typeof props.slide.background === 'string'
                ? {backgroundColor: props.slide.background}
                : {backgroundImage: props.slide.background.source}}>
            {props.slide.slideData.map(e =>
                <SlideElementsItem key={e.id} slideElement={e} scale={1}/>)}
        </div>
    </div>
}

const activeSlideId = store.getState().activeSlideId;
const mapStateToProps = () => ({
    slide: store.getState().slides.find(s => s.id === activeSlideId) || store.getState().slides[0]
});

export default connect(mapStateToProps)(ActiveSlide);