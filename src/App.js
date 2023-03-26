import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [files, setFiles] = useState([])
  const [fileTmp, setFileTmp] = useState()
  const [isOver, setIsOver] = useState(false)


  const textArea = useRef(null)

  useEffect(() => {
    console.log("new file tmp: ", fileTmp, files)
    if (fileTmp) {
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

  const onDragOver = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    setIsOver(true);
    // console.log("onDragOver", e)
  }

  const onDragLeave = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    // console.log("onDragOver", e)
    setIsOver(false);
  }

  const onDragEnter = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    console.log("onDragEnter", e)

  }

  const onFileDrop = (e) => {
    // e.stopPropagation();
    e.preventDefault();

    console.log("onFileDrop", e);


    let file = "";
    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      file =
        [...e.dataTransfer.items]
          .find((item) => item.kind === "file")
          .getAsFile();
    } else {
      // Use DataTransfer interface to access the file(s)
      file = e.dataTransfer.files[0];
    }
    setFileTmp(file)
    // alert("dropped")
  }

  const onPaste = (e) => {
    // console.log("paste event: ", event);
    var items = (e.clipboardData || e.originalEvent.clipboardData).items;
    // console.log(JSON.stringify(items)); // might give you mime types
    for (var index in items) {
      var item = items[index];
      // console.log("====> item: ", item)
      if (item.kind === 'file') {

        var blob = item.getAsFile();
        console.log("====> File: ", blob)
        setFileTmp(blob)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <textarea
          style={{
            border: isOver ? "2px solid lightblue" : "none"
          }}
          // onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onFileDrop}
          onPaste={onPaste}

          ref={textArea} id="message"
        />

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
