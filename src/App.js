import './App.css';

import Home from './pages/Home';
import 'semantic-ui-css/semantic.min.css'

function App() {
  return (
    <div>
    <div className="topheading">
      <div className="headingtext">
        Real-time speech analysis
      </div>
    </div>
    <Home />
    </div>
  );
}

export default App;
