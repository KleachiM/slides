import React, {MutableRefObject, useContext} from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import styles from './Editor.module.css'
import {useAppActions, useAppSelector} from "../../store/store";
import {Image, Presentation, TextBlock} from "../../types/presentationTypes";
import {DelayedInput} from "../DelayedInput/DelayedInput";
import {useNavigate} from "react-router";

type EditorProps = {
    minRefs: MutableRefObject<HTMLDivElement[]>
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
        addSlide, deleteSlide, addImage, addText, changeTextProperty,
        changeFontSize, changeItalic, changeUnderline, changeBold,
        undo, redo, fromJson, setBackgroundColor, setBackgroundImage,
        setFullScreen, deleteElement
    } = useAppActions();

    const minRefs = props.minRefs;

    const navigate = useNavigate();
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

    const waitForImagesToLoad = async (div: HTMLDivElement) => {
        const images = Array.from(div.querySelectorAll("img"));
        await Promise.all(
            images.map(
                (img) =>
                    new Promise<void>((resolve, reject) => {
                        if (img.complete) {
                            resolve();
                        } else {
                            img.onload = () => resolve();
                            img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
                        }
                    })
            )
        );
    };

    const saveToPdf = async () => {
        const pdf = new jsPDF();
        const promises = minRefs.current.map(async (div, index) => {
            await waitForImagesToLoad(div);
            const canvas = await html2canvas(div, {
                scale: 4, // Увеличиваем масштаб в 4 раза
                imageTimeout: 15000,
                useCORS: true
            });
//todo: настроить масштабирование при выгрузке в pdf
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190; // ширина изображения в PDF
            const pageHeight = 297; // высота страницы PDF в мм (A4)
            // const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const imgHeight = 300;
            if (index > 0) pdf.addPage(); // добавляем новую страницу для всех, кроме первой
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        });

        await Promise.all(promises);
        pdf.save('output.pdf');
    };

    let isTextElementsSelected = true;

    if (selection.type !== 'element' || selection.value.length === 0)
        isTextElementsSelected = false;

    if (isTextElementsSelected)
        for (let id of selection.value)
            for (let element of activeSlideData)
                if (id === element.id && element.type !== 'text')
                    isTextElementsSelected = false;

    return <>
        <div>
            <input className={styles.title} defaultValue={title} style={{width: title.length, minWidth: 300}}/>
        </div>
        <div className={styles.tools}>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Add slide"
                  onClick={() => addSlide()}>add</span>
            <span className={`material-symbols-outlined ${styles.clickButton}`} title="Delete slide"
                  onClick={() =>{
                          if (selection.type === 'element')
                              deleteElement()
                          else
                              deleteSlide()
                      }}>delete</span>
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
            <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => {addText()}} title="Add text">text_fields</span>
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
                    {/*<span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => {*/}
                    {/*    changeUnderline();*/}
                    {/*}}>format_underlined</span>*/}
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
            <span className={`material-symbols-outlined ${styles.clickButton}`} onClick={() => navigate("/player")} title="Preview">preview</span>
            {/*<span className={`material-symbols-outlined ${styles.clickButton}`}*/}
            {/*      title="Up to front">move_selection_down</span>*/}
            {/*<span className={`material-symbols-outlined ${styles.clickButton}`}*/}
            {/*      title="Push down">move_selection_up</span>*/}
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
                    const res = ev.target.value
                    if (!isTextElementsSelected)
                        setBackgroundColor(res)
                    else
                        changeTextProperty('fontColor', res);
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
                    // const image: Image = {type: 'image', source: res}
                    setBackgroundImage(res);
                }}
                style={{display: 'none'}}
            />
        </div>
    </>
}

function getJsonFileContent(file: File): Promise<string> {
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

