import React from 'react';
import './App.css';
import Miniatures from "./components/Miniatures";
import Slide from "./components/Slide";
import Editor from "./components/Editor";

function App() {
  return (
      <div className="app">
          <div className="editor">
              <Editor/>
          </div>
          <div className="presentation">
              <Miniatures/>
              <Slide/>
          </div>
      </div>
  );
}

export default App;
