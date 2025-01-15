import {useEffect} from "react";
import {useAppActions, useAppSelector} from "../store/store";

export function useDocumentKeyHandler(){
    const isFullScreen = useAppSelector(state => state.editor.fullscreenMode);
    const slides = useAppSelector(state => state.presentation.presentation.slides);
    const activeSlideId = useAppSelector(state => state.presentation.presentation.activeSlideId);
    const {setActiveSlide} = useAppActions();
    useEffect(()=>{
        const onKeyDownHandler = (event: KeyboardEvent) => {
                const activeSlideIndex = slides.findIndex(s => s.id === activeSlideId);
                if (event.key === "Space" || event.key === "ArrowRight") {
                    if (activeSlideIndex > -1 && activeSlideIndex < slides.length - 1) {
                        setActiveSlide(slides[activeSlideIndex + 1].id);
                    }
                }
                if (event.key === "ArrowLeft") {
                    if (activeSlideIndex > 0 && activeSlideIndex < slides.length) {
                        setActiveSlide(slides[activeSlideIndex - 1].id);
                    }
                }
        }

        document.addEventListener('keydown', onKeyDownHandler);
        return () => {document.removeEventListener('keydown', onKeyDownHandler);};
    });
}

export function useChangeFullScreenHandler(){
    const editorState = useAppSelector(state => state.editor.fullscreenMode);
    const {exitFullScreen} = useAppActions();
    useEffect(()=>{
       const fullScreenHandler = () => {
           if (!document.fullscreenElement)
               exitFullScreen();
       }
       document.addEventListener('fullscreenchange', fullScreenHandler);
       return () => {document.removeEventListener('fullscreenchange', fullScreenHandler);};
    });
}