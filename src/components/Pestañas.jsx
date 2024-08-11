import React, { useState, useEffect } from 'react';
import './Pestañas.css';

export const Pestañas = () => {
    // Declaración de hooks
    const [data, setData] = useState([]);

    const [dataPresident, setDataPresident] = useState([]);
    const [dataOutput, setDataOutput] = useState([]);
    const [dataTuristic, setDataTuristic] = useState([]);

    const [fetchDuration, setFetchDuration] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState([]);

    //Almacenar Tab Escogido
    const [tabIndex, setTabIndex] = useState(0);

    // Efecto para cargar los datos
    useEffect(() => {
        const startTime = performance.now(); // Inicia el cronómetro
        let address;
        switch (tabIndex) {
            case 0:
                address='https://api-colombia.com/api/v1/President';
              break;
            case 1:
                address='https://api-colombia.com/api/v1/TouristicAttraction';
              break;
            case 2:
                address='https://api-colombia.com/api/v1/Airport';
              break;
        }
      
        fetch(address)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La red no funciona de manera correcta.');
                }
                return response.json();
            })
            .then(data => {
                switch (tabIndex) {
                    case 0:
                        setDataPresident(data);
                      break;
                    case 1:
                        setDataTuristic(data);
                      break;
                    case 2:
                        setDataPresident(data);
                      break;
                }
             
                reorderData(data,tabIndex); // Reorganizar los datos después de cargarlos
                setLoading(false);
                const endTime = performance.now(); // Detiene el cronómetro
                setFetchDuration (endTime - startTime); // Calcula el tiempo de ejecución
               
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    },  [tabIndex]); // Solo se ejecuta cada vez que cambia el tab 

    // Función para reorganizar los datos
    const reorderData = (dataInput,IndexTab) => {
        let updatedDataOutput = [...dataOutput]; // Crear una copia de dataOutput
        
        //Ordenar Información de presidentes 
        if(IndexTab==0){

            dataInput.forEach(data => {
                let dataFindIndex = updatedDataOutput.findIndex(dataOut => dataOut.politicalParty.toUpperCase() === data.politicalParty.toUpperCase());
                
                if (dataFindIndex > -1) {
                    // Si el partido político ya existe en dataOutput, incrementa el contador
                    updatedDataOutput[dataFindIndex].count += 1;
                } else {
                    // Si no existe, agregar un nuevo objeto
                    updatedDataOutput.push({ politicalParty: data.politicalParty, count: 1 });
                }
            });
        }
        //Ordenar Información de atracciones turisticas
        if(IndexTab==1){

            dataInput.forEach(data => {
          
            });
        }

        setDataOutput(updatedDataOutput.sort((a, b) => b.count - a.count)); // Actualizar el estado con la nueva versión de dataOutput
    };

    // Función para alternar la expansión de las filas
    const toggleExpand = (index) => {
        setExpandedRows(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    // Función para mostrar el contenido de las pestañas
    const showTab = (index) => {
       
        setTabIndex(index);
    
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
                contents[i].classList.add('active');
            } else {
                tab.classList.remove('active');
                contents[i].classList.remove('active');
            }
        });


    };

    // Manejo de estados de carga y error
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="tab-container">
            <div className="tabs">
                <div className="tab active" onClick={() => showTab(0)}>Presidentes</div>
                <div className="tab" onClick={() => showTab(1)}>Atracciones Turísticas</div>
                <div className="tab" onClick={() => showTab(2)}>Aeropuertos</div>
            </div>

            <div id="tab-content-0" className="tab-content active">
                <p>Número de registros: {dataPresident.length}</p>
                <p>Tiempo de consulta: {(fetchDuration/1000).toFixed(3)} Segundos</p>
                
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Inicio</th>
                            <th>Final</th>
                            <th>Partido Político</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataPresident.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name} {item.lastName}</td>
                                <td>{item.startPeriodDate}</td>
                                <td>{item.endPeriodDate}</td>
                                <td>{item.politicalParty}</td>
                                <td>
                                    <div className="description-container">
                                        <p className={expandedRows.includes(index) ? 'expanded' : 'collapsed'}>
                                            {item.description}
                                        </p>
                                        <button onClick={() => toggleExpand(index)}>
                                            {expandedRows.includes(index) ? 'Leer menos' : 'Ver más'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>Presidentes según partido político.</p>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Partido Político</th>
                            <th>Número de Presidentes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataOutput.map((item, index) => (
                            <tr key={index}>
                                <td>{item.politicalParty}</td>
                                <td>{item.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Otros tabs aquí */}

            <div id="tab-content-1" className="tab-content active">
                <p>Número de registros: {dataTuristic.length}</p>
                <p>Tiempo de consulta: {(fetchDuration/1000).toFixed(3)} Segundos</p>
                
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Latitude</th>
                            <th>Longitud</th>
                            <th>Ciudad</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {dataTuristic.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name} </td>
                                    <td>{item.latitude} </td>
                                    <td>{item.longitude} </td>
                                    <td>{item.city.name} </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
     
            </div>

            <div id="tab-content-2" className="tab-content active">
                <p>Número de registros: {data.length}</p>
                <p>Tiempo de consulta: {(fetchDuration/1000).toFixed(3)} Segundos</p>
                
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                    
                    </tbody>
                </table>
     
            </div>

        </div>
    );
};
