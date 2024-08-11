import './App.css';
import { Pestañas } from './components/Pestañas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="IconAnalitic.png" className="App-logo" alt="logo" />
        <p>
           <span className="heart">♥️</span> Análisis de datos nacionales
        </p>
      
    

        <Pestañas></Pestañas>
      </header>
      <p className="small"> * Imagen tomada de:
      <a href="https://www.freepik.es/icono/resistencia_15710348#fromView=search&page=1&position=3&uuid=e801aab2-f8a2-4e73-a052-c4f91dfb34f0">Icono de Dewi Sari</a>
        </p>
    </div>
  );
}

export default App;
