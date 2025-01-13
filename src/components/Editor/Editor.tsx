import React from "react";
import styles from './Editor.module.css'
import {useAppActions, useAppSelector} from "../../store/store";
import {TextBlock} from "../../types/presentationTypes";
import {DelayedInput} from "../DelayedInput/DelayedInput";

export default function Editor(){
    const title = useAppSelector(state => state.presentation.title);
    const selection = useAppSelector(state => state.presentation.selection);
    const activeSlideId = useAppSelector(state => state.presentation.activeSlideId);
    const slides = useAppSelector(state => state.presentation.slides);
    const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
    const activeSlideData = activeSlide.slideData;
    const {
        addSlide, deleteSlide, addImage, changeTextProperty,
        changeFontSize, changeItalic, changeUnderline, changeBold,
        undo, redo
    } = useAppActions();

    let isTextElementsSelected = true;

    if (selection.type !== 'element' || selection.value.length === 0)
        isTextElementsSelected = false;

    if (isTextElementsSelected)
        for (let id of selection.value)
            for (let element of activeSlideData)
                if (element.type !== 'text')
                    isTextElementsSelected = false;
//{`material-symbols-outlined ${styles.clickButton}`}
    return <>
        <div>
            <input className={styles.title} defaultValue={title} style={{width: title.length, minWidth: 300}}/>
        </div>
        <div className={styles.tools}>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Add slide" onClick={() => addSlide()}>add</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Delete slide" onClick={() => deleteSlide()}>delete</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Undo" onClick={() => undo()}>undo</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Redo" onClick={() => redo()}>redo</span>
            {/*<span className={`material-symbols-outlined ${styles.clickButton}`} title="Add rectangle">rectangle</span>*/}
            {/*<span className={`material-symbols-outlined ${styles.clickButton}`} title="Add triangle">change_history</span>*/}
            {/*<span className={`material-symbols-outlined ${styles.clickButton}`} title="Add circle">circle</span>*/}
            <label htmlFor="select_pic">
                <span className={`material-symbols-outlined ${styles.clickButton}`} title="Add image">image</span>
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
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Add text">text_fields</span>
            {isTextElementsSelected && (
                <div className={styles.buttonsPanel}>
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
                    <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => {
                        const needToInc = true;
                        changeFontSize(needToInc);
                    }}>text_increase</span>
                    <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => {
                        const needToInc = false;
                        changeFontSize(needToInc);
                    }}>text_decrease</span>
                    <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => {
                        changeItalic();
                    }}>format_italic</span>
                    <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => {
                        changeBold();
                    }}>format_bold</span>
                    <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => {
                        changeUnderline();
                    }}>format_underlined</span>
                </div>
            )}
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Save to pdf">picture_as_pdf</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Save to JSON">save</span>
            {/*<span className={`material-symbols-outlined ${styles.clickButton}`} title="Upload presentation">upload</span>*/}
            {/*<span className={`material-symbols-outlined ${styles.clickButton}`} title="Preview">preview</span>*/}
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Up to front">move_selection_down</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Push down">move_selection_up</span>
            <label htmlFor="select_color">
                <div className={styles.buttonsPanel}>
                    <span className={`material-symbols-outlined ${styles.clickButton}`} title="Color fill">format_color_fill</span>
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
                <span className={`material-symbols-outlined ${styles.clickButton}`} title="Change background">background_replace</span>
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
    </>
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