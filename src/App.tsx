import React, {useRef} from 'react';
import styles from './App.module.css';
import Miniatures from "./components/Miniatures/Miniatures";
import ActiveSlide from "./components/ActiveSlide/ActiveSlide";
import Editor from "./components/Editor/Editor";
import {useDocumentKeyHandler, useChangeFullScreenHandler} from "./customHooks/DocumentKeyEvents";

function App() {
    const appRef = useRef<HTMLDivElement>(null);

    useDocumentKeyHandler();
    useChangeFullScreenHandler();
    return (
        <div ref={appRef} className={styles.app}>
            <div className={styles.editor}>
                <Editor appRef={appRef} />
            </div>
            <div className={styles.presentation}>
                <Miniatures/>
                <ActiveSlide/>
            </div>
        </div>
    );
}

export default App;
