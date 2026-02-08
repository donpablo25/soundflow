
import 'bulma/css/bulma.min.css';

import { BrowserRouter } from 'react-router-dom'
import Router from './router/router'
import './App.css'
import "./index.css"

function App() {

  return (
    <>
    <BrowserRouter>
      <Router/>
    </BrowserRouter>

    </>
  )
}

export default App
