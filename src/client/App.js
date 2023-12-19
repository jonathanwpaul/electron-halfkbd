import './App.css'
import { channels } from '../shared/constants'
const { ipcRenderer } = window.require('electron')

const getData = () => {
  console.log('clicked');
  ipcRenderer.send(channels.GET_DATA, { product: 'notebook' })   
}

function App() {
  

  return (
    <div className="App">
      <header className="App-header">
        <p>HELLO WORLD</p>
      </header>
      <button onClick={getData}>Get data</button>
      <p>this is the body of the app</p>
    </div>
  )
}

export default App
