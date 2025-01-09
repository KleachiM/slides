import React, {useState} from "react";
import './Editor.css'
import {useAppActions, useAppSelector} from "../../store/store";
import {SlideElement, TextBlock} from "../../types/presentationTypes";
import {DelayedInput} from "../DelayedInput/DelayedInput";

export default function Editor(){
    const title = useAppSelector(state => state.title);
    const selection = useAppSelector(state => state.selection);
    const activeSlideId = useAppSelector(state => state.activeSlideId);
    const slides = useAppSelector(state => state.slides);
    const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
    const activeSlideData = activeSlide.slideData;
    const {addSlide, deleteSlide, addImage, changeTextProperty, changeFontSize} = useAppActions();

    let isTextElementsSelected = true;

    if (selection.type !== 'element' || selection.value.length === 0)
        isTextElementsSelected = false;

    if (isTextElementsSelected)
        for (let id of selection.value)
            for (let element of activeSlideData)
                if (element.type !== 'text')
                    isTextElementsSelected = false;

    return <div>
        <div >
            <input className="title" defaultValue={title} style={{width: title.length, minWidth: 300}}/>
        </div>
        <div className="tools">
            <span className="material-symbols-outlined click-button" title="Add slide" onClick={() => addSlide()}>add</span>
            <span className="material-symbols-outlined click-button" title="Delete slide" onClick={() => deleteSlide()}>delete</span>
            <span className="material-symbols-outlined click-button" title="Undo">undo</span>
            <span className="material-symbols-outlined click-button" title="Redo">redo</span>
            {/*<span className="material-symbols-outlined click-button" title="Add rectangle">rectangle</span>*/}
            {/*<span className="material-symbols-outlined click-button" title="Add triangle">change_history</span>*/}
            {/*<span className="material-symbols-outlined click-button" title="Add circle">circle</span>*/}
            <label htmlFor="select_pic">
                <span className="material-symbols-outlined click-button" title="Add image">image</span>
            </label>
            <input
                type={'file'}
                id="select_pic"
                onChange={async (ev) => {
                    const res = await getBase64((ev.target.files || [])[0] as File);
                    addImage(res);
                }}
                style={{display: 'none'}}
            />
            <span className="material-symbols-outlined click-button" title="Add text">text_fields</span>
            {isTextElementsSelected && (
                <div className="text-edit-panel buttons-panel">
                    <select onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => {
                        changeTextProperty('fontFamily', ev.target.value)
                    }}>
                        <option value='roboto'>Roboto</option>
                        <option value='opensans'>OpenSans</option>
                        <option value='zeyada'>Zeyada</option>
                    </select>
                    <DelayedInput
                        key="delayedInput"
                        initVal={selection.value.length > 1
                            ? ""
                            : (activeSlideData.find(e => e.id === selection.value[0]) as TextBlock).fontSize}/>
                    {/*<input*/}
                    {/*    className="font-size-input"*/}
                    {/*    type="number"*/}
                    {/*    onChange={(ev) => {*/}
                    {/*        changeTextProperty('fontSize', Number(ev.target.value));*/}
                    {/*    }}*/}
                    {/*    value={(activeSlideData.find(e => e.id === selection.value[0]) as TextBlock).fontSize}*/}
                    {/*/>*/}
                    <span className="material-symbols-outlined click-button" onClick={() => {
                        const needToInc = true;
                        changeFontSize(needToInc);
                    }}>text_increase</span>
                    <span className="material-symbols-outlined click-button" onClick={() => {
                        const needToInc = false;
                        changeFontSize(needToInc);
                    }}>text_decrease</span>
                    <span className="material-symbols-outlined click-button" onClick={() => {
                        console.log("set itallic")
                    }}>format_italic</span>
                    <span className="material-symbols-outlined click-button" onClick={() => {
                        console.log("set bold")
                    }}>format_bold</span>
                    <span className="material-symbols-outlined click-button" onClick={() => {
                        console.log("set underlined")
                    }}>format_underlined</span>
                </div>
            )}
            <span className="material-symbols-outlined click-button" title="Save to pdf">picture_as_pdf</span>
            <span className="material-symbols-outlined click-button" title="Save to JSON">save</span>
            {/*<span className="material-symbols-outlined click-button" title="Upload presentation">upload</span>*/}
            {/*<span className="material-symbols-outlined click-button" title="Preview">preview</span>*/}
            <span className="material-symbols-outlined click-button" title="Up to front">move_selection_down</span>
            <span className="material-symbols-outlined click-button" title="Push down">move_selection_up</span>
            <label htmlFor="select_color">
                <div className="buttons-panel">
                    <span className="material-symbols-outlined click-button" title="Color fill">format_color_fill</span>
                </div>
            </label>
            <input
                type={'color'}
                id="select_color"
                onChange={async (ev) => {

                }}
                style={{display: 'none'}}
            />
            <label htmlFor="select_bkgr">
                <span className="material-symbols-outlined click-button" title="Change background">background_replace</span>
            </label>
            <input
                type={'file'}
                id="select_bkgr"
                onChange={async (ev) => {
                    const res = await getBase64((ev.target.files || [])[0] as File);
                    addImage(res);
                }}
                style={{display: 'none'}}
            />
        </div>
    </div>
}

function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!file) reject('not found file');
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}