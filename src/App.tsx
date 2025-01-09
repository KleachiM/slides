import React from 'react';
import './App.css';
import Miniatures from "./components/Miniatures/Miniatures";
import ActiveSlide from "./components/ActiveSlide/ActiveSlide";
import Editor from "./components/Editor/Editor";
function App() {
  return (
      <div className="app">
          <div className="editor">
              <Editor/>
          </div>
          <div className="presentation">
              <Miniatures/>
              <ActiveSlide/>
          </div>
      </div>
  );
}

export default App;
