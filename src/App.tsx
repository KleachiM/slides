import React from 'react';
import styles from './App.module.css';
import Miniatures from "./components/Miniatures/Miniatures";
import ActiveSlide from "./components/ActiveSlide/ActiveSlide";
import Editor from "./components/Editor/Editor";
function App() {
  return (
      <div className={styles.app}>
          <div className={styles.editor}>
              <Editor/>
          </div>
          <div className={styles.presentation}>
              <Miniatures/>
              <ActiveSlide/>
          </div>
      </div>
  );
}

export default App;
