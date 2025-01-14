import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import styles from './Editor.module.css'
import {useAppActions, useAppSelector} from "../../store/store";
import {Presentation, TextBlock} from "../../types/presentationTypes";
import {DelayedInput} from "../DelayedInput/DelayedInput";

type EditorProps = {
    appRef: React.RefObject<HTMLDivElement>
}

export default function Editor(props: EditorProps) {
    const presentation = useAppSelector(state => state.presentation.presentation);
    const title = useAppSelector(state => state.presentation.presentation.title);
    const selection = useAppSelector(state => state.presentation.presentation.selection);
    const activeSlideId = useAppSelector(state => state.presentation.presentation.activeSlideId);
    const slides = useAppSelector(state => state.presentation.presentation.slides);
    const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];
    const activeSlideData = activeSlide.slideData;
    const {
        addSlide, deleteSlide, addImage, changeTextProperty,
        changeFontSize, changeItalic, changeUnderline, changeBold,
        undo, redo, fromJson,
        setFullScreen
    } = useAppActions();

    function saveToJson() {
        const presentationName = title + ".json";
        const newVariable: any = window.navigator;
        const presentationToSave: Presentation = {
            ...presentation,
            selection: {type: 'slide', value: []}
        }
        const presentationFile = new Blob([JSON.stringify(presentationToSave)], {type: 'json'});
        if (newVariable && newVariable.msSaveOrOpenBlob) {
            newVariable.msSaveOrOpenBlob(presentationFile, presentationName);
        } else {
            const a = document.createElement('a'),
                url = URL.createObjectURL(presentationFile);
            a.href = url;
            a.download = presentationName;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    const saveToPdf = async () => {
        console.log("saveToPdf");
        if (!props.appRef.current)
            return;

        console.log("saveToPdf after first");
        const canvas = await html2canvas(props.appRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("document.pdf");
    };

    let isTextElementsSelected = true;

    if (selection.type !== 'element' || selection.value.length === 0)
        isTextElementsSelected = false;

    if (isTextElementsSelected)
        for (let id of selection.value)
            for (let element of activeSlideData)
                if (element.type !== 'text')
                    isTextElementsSelected = false;

    return <>
        <div>
            <input className={styles.title} defaultValue={title} style={{width: title.length, minWidth: 300}}/>
        </div>
        <div className={styles.tools}>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Add slide"
                  onClick={() => addSlide()}>add</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Delete slide"
                  onClick={() => deleteSlide()}>delete</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Undo"
                  onClick={() => undo()}>undo</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Redo"
                  onClick={() => redo()}>redo</span>
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
            <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => saveToPdf()}
                  title="Save to pdf">picture_as_pdf</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => saveToJson()}
                  title="Save to JSON">save</span>
            <label htmlFor="select_json">
                <span className={`material-symbols-outlined ${styles.clickButton}`}
                      title="Upload presentation">upload</span>
            </label>
            <input
                type={'file'}
                id="select_json"
                onChange={async (ev) => {
                    const content = await getJsonFileContent((ev.target.files || [])[0] as File);
                    fromJson(content);
                }}
                style={{display: 'none'}}
            />
            <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => setFullScreen()} title="Preview">preview</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`}
                  title="Up to front">move_selection_down</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`}
                  title="Push down">move_selection_up</span>
            <label htmlFor="select_color">
                <div className={styles.buttonsPanel}>
                    <span className={`material-symbols-outlined ${styles.clickButton}`}
                          title="Color fill">format_color_fill</span>
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
                <span className={`material-symbols-outlined ${styles.clickButton}`}
                      title="Change background">background_replace</span>
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

function getJsonFileContent(file: File): Promise<string> {
    console.log("getting content")
    return new Promise((resolve, reject) => {
        if (!file) reject('not found file');
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const target: any = e.target;
            resolve(target.result as string);
        };
        reader.onerror = error => reject(error);
    });
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

