import logo from './logo.svg';
import loading from './loading.svg';

import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [files, setFiles] = useState([])
  const [fileTmp, setFileTmp] = useState()
  const [isOver, setIsOver] = useState(false)
  const [isOutside, setIsOutside] = useState(false)
  const [urlMeta, setUrlMeta] = useState({})
  const [url, setUrl] = useState(null)

  const textArea = useRef(null)

  const onDragStart = (e) => {
    // e.stopPropagation();
    e.preventDefault();
    // setIsOver(true);
    console.log("onDragStart", e)
  }

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
    setIsOver(true);

    console.log("onDragEnter", e)

  }

  const onFileDrop = (e) => {
    // e.stopPropagation();
    e.preventDefault();

    console.log("onFileDrop", e);

    setIsOver(false);

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

  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  const onChange = (e) => {
    if (e.target.value.match(regex)) {
      setUrl(e.target.value);
    }
  }

  const decode = (str) => str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  })

  const retrieveMetaData = async (url) => {
    if (url?.match(regex)) {
      const data = await fetch(url);
      let htmlString = await data.text();
      console.log("===> FETCHED ", url, htmlString);
      var metadata = {};
      const parser = new DOMParser();
      const html = parser.parseFromString(htmlString, "text/xml");
      console.log(html)
      htmlString.replace(/<meta.+(property|name)="(.*?)".+content="(.*?)".*\/>/igm, (m, p0, p1, p2) => { console.log("===>", m, "||", p0, "||", p1, "||", p2); metadata[p1] = decode(p2) });
      console.log(metadata)
    }
  }

  useEffect(() => {
    console.log("url: ", url)
    retrieveMetaData(url)
  }, [url])



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

  useEffect(() => {
    document.addEventListener("dragover", function (e) {
      console.log("drag over", e, e.target)
      setIsOutside(true)
    });

    document.addEventListener("dragleave", function (e) {
      console.log("drag leave", e, e.target)
      setIsOutside(false)

    });
    document.addEventListener("drop", function (e) {
      console.log("drop", e, e.target)
      setIsOutside(false)
    });

    // return () => {
    //   second
    // }
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <img width={30} src={loading} className="loading" alt="loading" />
        <svg className='loading-svg' width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="8" height="8" rx="4" fill="#73777A" />
          <g clip-path="url(#clip0_6333_20015)">
            <path d="M6.25 4.00011C6.24998 4.47526 6.09953 4.9382 5.82023 5.32259C5.54093 5.70698 5.14712 5.99309 4.69522 6.1399C4.24332 6.28671 3.75655 6.2867 3.30466 6.13986C2.85277 5.99302 2.45897 5.70689 2.17969 5.32249C1.90041 4.93808 1.75 4.47513 1.75 3.99998C1.75 3.52484 1.90043 3.06189 2.17971 2.67749C2.45899 2.29308 2.8528 2.00696 3.30469 1.86013C3.75658 1.7133 4.24336 1.71329 4.69525 1.86011" stroke="white" stroke-width="0.333333" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_6333_20015">
              <rect width="6" height="6" fill="white" transform="translate(1 1)" />
            </clipPath>
          </defs>
        </svg>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <textarea
          style={{
            border: isOver ? "2px solid red" : isOutside ? "2px solid green" : "none"
          }}
          onDragEnter={onDragEnter}
          // onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onFileDrop}
          onPaste={onPaste}
          onDragStart={onDragStart}
          onChange={onChange}
          ref={textArea}
          id="message"
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
