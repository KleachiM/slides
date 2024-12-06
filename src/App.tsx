import React from 'react';
import './App.css';
import Miniatures from "./components/Miniatures";
import ActiveSlide from "./components/ActiveSlide";
import Editor from "./components/Editor";

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
