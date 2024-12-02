import React from "react";
import './Miniatures.css'
import {Slide} from "../types/presentationTypes";
import store from "../store/store";
import {connect} from "react-redux";

type MiniaturesProps = {
    slides: Array<Slide>
}
function Miniatures(props: MiniaturesProps){
    return <div className="miniatures">
        {props.slides.map((slide) => {
            return <div key={slide.id}
                style={typeof(slide.background) === 'string'
                    ? {backgroundColor: slide.background}
                    : {backgroundImage: slide.background.source}}>
                {/*Slide data (if elem.type === 'text' ... else ...)*/}
                Slide data
            </div>
        })}
    </div>
}

const mapStateToProps = () => ({
    slides: store.getState().slides
});

export default connect(mapStateToProps)(Miniatures);