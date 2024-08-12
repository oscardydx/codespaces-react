import React, { useState, useEffect } from 'react';
import './Pestañas.css';

export const Pestañas = () => {
    // Declaración de hooks
    const [data, setData] = useState([]);

    const [dataPresident, setDataPresident] = useState([]);
    const [dataOutput, setDataOutput] = useState([]);

    const [dataTuristic, setDataTuristic] = useState([]);
    const [dataOutputTuristic, setDataOutputTuristic] = useState([]);

    const [dataAirports, setDataAirports] = useState([]);
    const [dataOutputAirports, setDataOutputAirports] = useState([]);
    const [dataOutputAirports2, setDataOutputAirports2] = useState([]);

    const [dataOutputAirports3, setDataOutputAirports3] = useState([]);

    const [fetchDuration, setFetchDuration] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState([]);

    const [dataDepartaments, setDataDepartaments] = useState([]);
    const [dataRegions, setDataRegions] = useState([]);

    //Almacenar Tab Escogido
    const [tabIndex, setTabIndex] = useState(0);

    // Efecto para cargar los datos
  useEffect(() => {
    const startTime = performance.now(); // Inicia el cronómetro
    let address;
    let puerta=false; 
    switch (tabIndex) {
        case 0:
            address = 'https://api-colombia.com/api/v1/President';
            if(dataPresident.length<1) puerta=true;
            break;
        case 1:
            address = 'https://api-colombia.com/api/v1/TouristicAttraction';
            if(dataTuristic.length<1) puerta=true;
            break;
        case 2:
            address = 'https://api-colombia.com/api/v1/Airport';
            if(dataAirports.length<1) puerta=true;
            break;
        default:
            return; // Si no hay un tabIndex válido, no hace nada
    }

    if(puerta){
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
                        setDataAirports(data);
                        break;
                    default:
                        return;
                }

                reorderData(data, tabIndex);
                setLoading(false);
                const endTime = performance.now();
                setFetchDuration(endTime - startTime);

                // Solo calcular la estructura anidada para el tab de aeropuertos
                if (tabIndex === 2) {
                    const dataOA = constructNestedStructure(dataOutputAirports2);
                    setDataOutputAirports3(dataOA);
                }
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }
    puerta=false;
    if (dataDepartaments.length < 1) {
        fetch('https://api-colombia.com/api/v1/Department')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La red no funciona de manera correcta.');
                }
                return response.json();
            })
            .then(data => {
                setDataDepartaments(data);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }

    if (dataRegions.length < 1) {
        fetch('https://api-colombia.com/api/v1/Region')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La red no funciona de manera correcta.');
                }
                return response.json();
            })
            .then(data => {
                setDataRegions(data);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }
}, [tabIndex, dataDepartaments, dataRegions]);

 // Solo se ejecuta cada vez que cambia el tab 

    // Función para reorganizar los datos
    const reorderData = (dataInput,IndexTab) => {
        let updatedDataOutput ; // Crear una copia de dataOutput
        
        //Ordenar Información de presidentes 
        if(IndexTab==0){
            updatedDataOutput = [...dataOutput];
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
            setDataOutput(updatedDataOutput.sort((a, b) => b.count - a.count)); 
            
        }
        //Ordenar Información de atracciones turisticas
        if(IndexTab==1){
            setDataOutputTuristic([]);
     
            updatedDataOutput = [...dataOutputTuristic];
            dataInput.forEach(data => {
                let dataFindIndex = updatedDataOutput.findIndex(dataOut => dataOut.city.toUpperCase() === data.city.name.toUpperCase());
                
                if (dataFindIndex > -1) {
                    // Si la ciudad ya existe en dataOutput, incrementa el contador
                    updatedDataOutput[dataFindIndex].count += 1;
                } else {
                    // Si no existe, agregar un nuevo objeto con departamento
                    let DepartmentIndex=dataDepartaments.findIndex(dataO=> dataO.id===data.city.departmentId);
                    if(DepartmentIndex>=0){
                        updatedDataOutput.push({department:dataDepartaments[DepartmentIndex].name, city: data.city.name, count: 1 });
                    }else{
                        updatedDataOutput.push({ department:null,city: data.city.name, count: 1 });
                    }
                }
            });
            
            setDataOutputTuristic(updatedDataOutput.
                sort((a, b) => {
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    if (a[0] > b[0]) {
                        return 1;
                    }
                    return 0;
                })); 
        }

           //Ordenar Información de Aeropuertos por Departamentos y ciudad
           if(IndexTab==2){
            setDataOutputAirports([]);
            setDataOutputAirports2([]);
            setDataOutputAirports3([]);

            updatedDataOutput = [...dataOutputAirports2];
            dataInput.forEach(data => {
                let dataFindIndex = updatedDataOutput.findIndex(dataOut => dataOut.city.toUpperCase() === data.city.name.toUpperCase());
                
                if (dataFindIndex > -1) {
                    // Si la ciudad ya existe en dataOutput, incrementa el contador
                    updatedDataOutput[dataFindIndex].count += 1;
                } else {
                    // Si no existe, agregar un nuevo objeto con departamento
               
                    updatedDataOutput.push({ department:data.department.name,city: data.city.name, count: 1 });
                    
                }
            });
            
            setDataOutputAirports(updatedDataOutput.
                sort((a, b) => {
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    if (a[0] > b[0]) {
                        return 1;
                    }
                    return 0;
                })); 
            
            //Agrupar por Región
            updatedDataOutput = [...dataOutputAirports2];
            dataInput.forEach(data => {
                let dataFindIndex = updatedDataOutput.findIndex(dataOut => (dataOut.city.toUpperCase() === data.city.name.toUpperCase()) 
                    && (dataOut.type.toUpperCase() === data.type.toUpperCase()) );
                
                if (dataFindIndex > -1) {
                    // Si la ciudad ya existe en dataOutput, incrementa el contador
                    updatedDataOutput[dataFindIndex].count += 1;
                } else {
                    // Si no existe, agregar un nuevo objeto con región

                    let RegionIndex=dataRegions.findIndex(dataO=> dataO.id===data.department.regionId);
                    if(RegionIndex>=0){
                        updatedDataOutput.push({region:dataRegions[RegionIndex].name ,department:data.department.name, city: data.city.name, type:data.type ,count: 1 });
                    }else{
                        updatedDataOutput.push({region:null ,department:data.department.name,city: data.city.name, type:data.type ,count: 1 });
                    }
               
                 
                    
                }
            });
            
            setDataOutputAirports2(updatedDataOutput.sort((a, b) => {
                if (a.region < b.region) {
                    return -1;
                }
                if (a.region > b.region) {
                    return 1;
                }
                return 0;
            }));
            
            const dataOA = constructNestedStructure(dataOutputAirports2);
            setDataOutputAirports3(dataOA);
        }

        
    };

    const constructNestedStructure = (dataArray) => {
        return dataArray.reduce((acc, item) => {
            // Verifica si la región ya existe
            if (!acc[item.region]) {
                acc[item.region] = {};
            }
    
            // Verifica si el departamento ya existe dentro de la región
            if (!acc[item.region][item.department]) {
                acc[item.region][item.department] = {};
            }
    
            // Verifica si la ciudad ya existe dentro del departamento
            if (!acc[item.region][item.department][item.city]) {
                acc[item.region][item.department][item.city] = {};
            }
    
            // Verifica si el tipo ya existe dentro de la ciudad y lo incrementa
            if (!acc[item.region][item.department][item.city][item.type]) {
                acc[item.region][item.department][item.city][item.type] = item.count;
            } else {
                acc[item.region][item.department][item.city][item.type] += item.count;
            }
    
            return acc;
        }, {});
    };
    // Función para renderizar la estructura anidada de dataOutputAirports3
    const renderNestedData = (data) => {
        return Object.keys(data).map((key) => {
            if (typeof data[key] === 'object') {
                return (
                    <div key={key} style={{ marginLeft: '20px' }}>
                        <strong>{key}:</strong>
                        <div>{renderNestedData(data[key])}</div>
                    </div>
                );
            } else {
                return (
                    <div key={key} style={{ marginLeft: '20px' }}>
                        {key}: {data[key]}
                    </div>
                );
            }
        });
    };

    // Función para alternar la expansión de las filas
    const toggleExpand = (index) => {
        setExpandedRows(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    // Función para mostrar el contenido de las pestañas
    const showTab = (index) => {
        setFetchDuration (0);
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

            <div id="tab-content-1" className="tab-content">
                <p>Número de registros: {dataTuristic.length}</p>
                <p>Tiempo de consulta: {(fetchDuration/1000).toFixed(3)} Segundos</p>
                
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Latitude</th>
                            <th>Longitud</th>
                            <th>Ciudad</th>
                            <th>Descripción</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        {dataTuristic.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name} </td>
                                    <td>{item.latitude} </td>
                                    <td>{item.longitude} </td>
                                    <td>{item.city.name} </td>
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
                <p>Atracciones turisticas agrupadas por Departamento y conteo por ciudad.</p>
               
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Departmento</th>
                            <th>Ciudad</th>
                            <th>Conteo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataOutputTuristic.map((item, index) => (
                            <tr key={index}>
                                <td>{item.department}</td>
                                <td>{item.city}</td>
                                <td>{item.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
     
            </div>

            <div id="tab-content-2" className="tab-content ">
                <p>Número de registros: {dataAirports.length}</p>
                <p>Tiempo de consulta: {(fetchDuration/1000).toFixed(3)} Segundos</p>
                
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Latitude</th>
                            <th>Longitud</th>
                            <th>Departamento</th>
                            <th>Ciudad</th>
                            <th>Tipo</th>
                            <th>iataCode</th>
                            <th>oaciCode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataAirports.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name} </td>
                                    <td>{item.latitude} </td>
                                    <td>{item.longitude} </td>
                                    <td>{item.department.name} </td>
                                    <td>{item.city.name} </td>
                                    <td>{item.type} </td>
                                    <td>{item.iataCode} </td>
                                    <td>{item.oaciCode} </td>
                              
                                </tr>
                            ))}
                    </tbody>
                </table>
                <p>Aeropuertos agrupados por Departamento y conteo por ciudad.</p>
               
               <table className="data-table">
                   <thead>
                       <tr>
                           <th>Departmento</th>
                           <th>Ciudad</th>
                           <th>Conteo</th>
                       </tr>
                   </thead>
                   <tbody>
                       {dataOutputAirports.map((item, index) => (
                           <tr key={index}>
                               <td>{item.department}</td>
                               <td>{item.city}</td>
                               <td>{item.count}</td>
                           </tr>
                       ))}
                   </tbody>
               </table>
               <p>Aeropuertos agrupados por Region y conteo por tipo.</p>

               <table className="data-table">
                   <thead>
                       <tr>
                           <th>Region</th>
                           <th>Departmento</th>
                           <th>Ciudad</th>
                           <th>Tipo</th>
                           <th>Conteo</th>
                       </tr>
                   </thead>
                   <tbody>
                       {dataOutputAirports2.map((item, index) => (
                           <tr key={index}>
                               <td>{item.region}</td>
                               <td>{item.department}</td>
                               <td>{item.city}</td>
                               <td>{item.type}</td>
                               <td>{item.count}</td>
                           </tr>
                       ))}
                   </tbody>
               </table>

               <p>Estructura de Consulta.</p>
               <div className="nested-structure">
                    {renderNestedData(dataOutputAirports3)}
                </div>
            </div>

        </div>
    );
};
