import React, {createContext, MutableRefObject, RefObject, useEffect, useRef, useState} from 'react';
import styles from './App.module.css';
import Miniatures from "./components/Miniatures/Miniatures";
import ActiveSlide from "./components/ActiveSlide/ActiveSlide";
import Editor from "./components/Editor/Editor";
import {useDocumentKeyHandler, useChangeFullScreenHandler} from "./customHooks/DocumentKeyEvents";

export function App() {
    const minRefs = useRef<HTMLDivElement[]>([]);

    useDocumentKeyHandler();
    useChangeFullScreenHandler();
    return (
            <div className={styles.app}>
                    <div className={styles.editor}>
                        <Editor minRefs={minRefs}/>
                    </div>
                    <div className={styles.presentation}>
                        <Miniatures minRefs={minRefs}/>
                        <ActiveSlide/>
                    </div>
            </div>
    );
}

