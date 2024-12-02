import React from "react";
import {SelectionType} from "../types/presentationTypes";
import './Editor.css'
import store from "../store/store";
import {connect} from "react-redux";

type EditorProps = {
    title: string,
    selection?: SelectionType
}
function Editor(props: EditorProps){
    return <div>
        <div className="title">
            {props.title}
        </div>
        <div className="tools">
            <span className="material-symbols-outlined click-button" title="Add slide">add</span>
            <span className="material-symbols-outlined click-button" title="Delete slide">delete</span>
            <span className="material-symbols-outlined click-button" title="Undo">undo</span>
            <span className="material-symbols-outlined click-button" title="Redo">redo</span>
            <span className="material-symbols-outlined click-button" title="Add rectangle">rectangle</span>
            <span className="material-symbols-outlined click-button" title="Add triangle">change_history</span>
            <span className="material-symbols-outlined click-button" title="Add circle">circle</span>
            <span className="material-symbols-outlined click-button" title="Add image">image</span>
            <span className="material-symbols-outlined click-button" title="Save to pdf">picture_as_pdf</span>
            <span className="material-symbols-outlined click-button" title="Save to JSON">save</span>
            <span className="material-symbols-outlined click-button" title="Upload presentation">upload</span>
            <span className="material-symbols-outlined click-button" title="Preview">preview</span>
            <span className="material-symbols-outlined click-button" title="Up to front">move_selection_down</span>
            <span className="material-symbols-outlined click-button" title="Push down">move_selection_up</span>
            <label htmlFor="select_color">
                <div className="buttons-panel">
                    <span className="material-symbols-outlined click-button" title="Color fill">format_color_fill</span>
                </div>
            </label>
        </div>
    </div>
}

const mapStateToProps = () => ({
    title: store.getState().title
});

export default connect(mapStateToProps)(Editor);