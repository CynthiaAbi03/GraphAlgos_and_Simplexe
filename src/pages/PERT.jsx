import React, { useState, useEffect } from 'react';
import { TagsInput } from 'react-tag-input-component';
import './styles/PERT.css';
import './styles/popUp.css';
import './styles/assignment1.css';
import Select from 'react-select';
import { pert } from '../algos/pert';

const PERT = () => {
  const [nodesNo, setNodesNo] = useState();
  const [taskName, setTaskName] = useState([]);
  const [popUpVisible, setPopUpVisible] = useState(true);
  const [taches, setTaches] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [possibleOptions, setpossibleOptions] = useState([]);
  const [pertResult, setPertResult] = useState([]);
  const [pertResultVisible, setPertResultVisible] = useState(false);

  const selectOptions = () => {
    const options = [];
    for (let i = 0; i < taskName.length; i++) {
      options.push({ value: `${i}`, label: `${taskName[i]}` });
    }
    setpossibleOptions(options);
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    selectOptions();
    console.log(possibleOptions, 'possible options');
    console.log(selectedOption, 'selected option');
  }, [taskName]);

  useEffect(() => {
    console.log('These are the tasks', taches);
    parseTaskArray(taches);
  }, [taches]);

  const maxNodes = 10;

  const handleEnterClick = () => {
    if (nodesNo < 0 || nodesNo > maxNodes || nodesNo < 3) {
      alert('Veuillez saisir un nombre valide de tâches (minimum 3)');
    } else {
      setPopUpVisible(false);
      generateNodes(nodesNo);
    }
  };

  const generateNodes = (nodesNo) => {
    const names = ['Aucune'];
    const alphabet = [
      '0',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    for (let i = 1; i <= nodesNo; i++) {
      const alValue = alphabet[i];
      names.push(`${alValue}`);
    }
    setTaskName(names);
  };
  const handleAddRelationship = () => {
    // If the conditions are met or there are fewer than two edges, add the new relationship
    setTaches([...taches, { task_name: 'A', duree: 1, precedents: [] }]);
  };

  const handleRelationshipChange = (index, key, value) => {
    const updatedRelationships = [...taches];
    if (key === 'duree' && value !== '') {
      updatedRelationships[index][key] = parseInt(value, 10); // Ensure 'duree' is a number
    } else if (key === 'precedents') {
      updatedRelationships[index][key] = value.map((option) => option.label);
    } else {
      updatedRelationships[index][key] = value;
    }
    setTaches(updatedRelationships);
  };

  const handleDelete = (index) => {
    const newArray = [...taches];
    newArray.splice(index, 1);
    setTaches(newArray);
  };

  const parseTaskArray = (taches) => {
    let tasks = [];
    for (let i = 0; i < taches.length; i++) {
      // Ensure task_name is always a string
      const taskName = String(taches[i].task_name);

      // Check if precedents is ['Aucune'], set it to an empty array
      const precedents =
        taches[i].precedents[0] === 'Aucune' ? [] : taches[i].precedents;

      // Extract the rest of the object properties
      const { task_name, precedents: _, ...rest } = taches[i];

      // Create the output object
      const output = { [taskName]: { ...rest, precedents } };
      tasks.push(output);
    }
    // return console.log(tasks, 'hellooo');
    return tasks;
  };

  const handleFinish = () => {
    try {
      const final_tasks = parseTaskArray(taches);
      const final_result = pert(final_tasks);
      setPertResult(final_result);
      setPertResultVisible(true);
      console.log(final_result, 'final_result');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="app-container">
        {popUpVisible ? (
          <div className="notepopup-main">
            <div className="notepopup-container">
              <div className="notepopup-content">
                <p>Entrez le nombre de tâches</p>
                <input
                  type="number"
                  id="nodeNumber"
                  onChange={(e) => setNodesNo(parseInt(e.target.value))}
                />
                <div className="notePopup-btn-div">
                  <button onClick={handleEnterClick}>Entrez</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relatn-container">
            <h1>Projet de Recherche Operationnelle: Methode PERT</h1>

            <h2 className="heading">
              Entrez les détails des tâches de votre projet
            </h2>
            <div className="main-container-nodes">
              {taches.map((value, index) => (
                <div key={index} className="input-container-nodes">
                  <div className="from-container">
                    <label className="label" htmlFor="nodes">
                      Tâche
                    </label>
                    <select
                      id="fromNode"
                      name="fromNode"
                      value={value.task_name}
                      onChange={(e) =>
                        handleRelationshipChange(
                          index,
                          'task_name',
                          e.target.value
                        )
                      }
                    >
                      {taskName.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="from-container">
                    <label htmlFor="" className="label">
                      Durée de la tâche
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={value.duree}
                      onChange={(e) =>
                        handleRelationshipChange(index, 'duree', e.target.value)
                      }
                      onInput={(e) =>
                        e.target.validity.valid || (e.target.value = '')
                      }
                    />
                  </div>
                  <div className="from-container">
                    <label className="label" htmlFor="nodes">
                      Prédécesseurs
                    </label>
                    <Select
                      isMulti
                      name="precedents"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      options={possibleOptions}
                      value={value.precedents.map((precedent) => ({
                        value: index,
                        label: precedent,
                      }))}
                      onChange={(selectedOption) =>
                        handleRelationshipChange(
                          index,
                          'precedents',
                          selectedOption
                        )
                      }
                    />
                  </div>
                  <div className="from-container">
                    <button
                      onClick={() => handleDelete(index)}
                      className="supprimer-btn"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '48px' }} className="buttons">
              <button className="new-relatn" onClick={handleAddRelationship}>
                Ajouter une tâche
              </button>
              <button className="finish-btn" onClick={handleFinish}>
                Terminer
              </button>
            </div>
            {pertResultVisible && (
              <div style={{ marginTop: '24px' }} className="finish_algorithms">
                <h2>Résultat du réseau P.E.R.T</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Tâche</th>
                      <th>Durée</th>
                      <th>Precedents</th>
                      <th>Début au plus tôt</th>
                      <th>Début au plus tard</th>
                      <th>Fin au plus tôt</th>
                      <th>Fin au plus tard</th>
                      <th>Marge</th>
                      <th>Critique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pertResult.taskDetails.map((value, index) => (
                      <tr key={index}>
                        <th>{value.name}</th>
                        <td>{value.duration}</td>
                        {/* {value.precedents.map((index2, data) => (
                          <td key={index2}>{data}</td>
                        ))} */}
                        <td>{value.precedents}</td>
                        <td>{value.earlyStart}</td>
                        <td>{value.lateStart}</td>
                        <td>{value.earlyFinish}</td>
                        <td>{value.lateFinish}</td>
                        <td>{value.marge}</td>
                        {value.marge === 0 ? (

                            <td>oui</td>
                        ): (
                            <td>non</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className='important-text'>Durée minimum du projet : <span className='red-text'> {pertResult.totalDuration}</span></p>
                <p className='important-text'>Chemin critique du projet : <span className='red-text'>{pertResult.criticalPath}</span> </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PERT;
