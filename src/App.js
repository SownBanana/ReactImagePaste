import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [files, setFiles] = useState([])
  const [fileTmp, setFileTmp] = useState()

  const textArea = useRef(null)
  // console.log("===> print this shit")
  useEffect(() => {
    // console.log("set paste event: ", textArea)
    textArea.current.onpaste = function (event) {
      // console.log("paste event: ", event);
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;
      console.log(JSON.stringify(items)); // might give you mime types
      for (var index in items) {
        var item = items[index];
        // console.log("====> item: ", item)
        if (item.kind === 'file') {

          var blob = item.getAsFile();
          console.log("====> File: ", blob)
          setFileTmp(blob)
         
        }
      }
    };
    return () => {
      textArea.current.onpaste = null;
    }
  }, [])

  useEffect(() => {
    console.log("new file tmp: ", fileTmp, files)
    if(fileTmp){
      var reader = new FileReader();
      reader.onload = function (event) {
        // console.log(event.target.result); // data url!
        fileTmp.src = event.target.result
        setFiles([...files, fileTmp])
      };
      reader.readAsDataURL(fileTmp);
    }
  }, [fileTmp])

  useEffect(() => {
    console.log("new files: ", files)
  }, [files])



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <textarea ref={textArea} id="message" />

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`Learn React ${files.length}`}
        </a>
      </header>
    </div>
  );
}

export default App;
