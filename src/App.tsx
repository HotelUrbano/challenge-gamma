import { useEffect, useState } from "react";
import { apiFetch } from "./Utils";
import { BING_IMAGE } from "./Utils/urls";

function App() {
  const [styles, setStyles] = useState({
    width: '100%',
    height: '100%',
    backgroundPosition: 'center center'
  })

  useEffect(() => {

    apiFetch(BING_IMAGE)
      .get()
      .then(response => response.json())
      .then(url => {
        setStyles(state => ({ ...state, backgroundImage: `url(${url})` }))
      })

  }, [])

  return (
    <div className="App" style={styles}>
    </div>
  );
}

export default App;
