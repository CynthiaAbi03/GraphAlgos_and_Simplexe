import React, { useState, useEffect } from 'react';
import './styles/popUp.css';
import './styles/assignment1.css';
import { testDjikstra } from '../algos/djikstra';
import { testPrim } from '../algos/prim';
import { testKruskal } from '../algos/kruskal2';

const Assignment_1 = () => {
  const [nodesNo, setNodesNo] = useState();
  const [nodeName, setNodeName] = useState([]);
  const [popUpVisible, setPopUpVisible] = useState(true);
  const [edges, setEdges] = useState([]);
  const [startingNode, setStartingNode] = useState('A');
  const [endingNode, setendingNode] = useState('A');
  const [selectedoption, setSelectedoption] = useState('');
  const [djikstraResponse, setDjisktraResponse] = useState();
  const [primResponse, setPrimResponse] = useState('');
  const [kruskalResponse, setKruskalResponse] = useState('');
  const maxNodes = 10;

  const handleoptionchange = (event) => {
    setSelectedoption(event.target.value);
  };

  const handleEnterClick = () => {
    if (nodesNo < 0 || nodesNo > maxNodes || nodesNo < 3) {
      alert('Veuillez saisir un nombre valide de nœuds (minimum 3)');
    } else {
      setPopUpVisible(false);
      generateNodes(nodesNo);
    }
  };

  //   const generateNodes = (nodesNo) => {
  //     const names = [];
  //     for (let i = 1; i <= nodesNo; i++) {
  //       names.push(`N${i}`);
  //     }
  //     setNodeName(names);
  //   };
  const generateNodes = (nodesNo) => {
    const names = [];
    const alphabet = [
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
    for (let i = 0; i <= nodesNo - 1; i++) {
      const alValue = alphabet[i];
      names.push(`${alValue}`);
    }
    setNodeName(names);
  };

  const handleRelationshipChange = (index, key, value) => {
    const updatedRelationships = [...edges];

    // Parse value based on the key
    if (key === 'source' || key === 'voisin') {
      updatedRelationships[index][key] = String(value);
    } else if (key === 'poids') {
      updatedRelationships[index][key] = Number(value);
    } else {
      updatedRelationships[index][key] = value;
    }

    setEdges(updatedRelationships);
  };

  // Function to add a new relationship
  const handleAddRelationship = () => {
    // If the conditions are met or there are fewer than two edges, add the new relationship
    setEdges([...edges, { source: 'A', voisin: 'A', poids: '' }]);
  };

  const handleFinish = () => {
    const connectedNodes = new Set();
    const invalidEdges = [];
    //graph(nodesNo,edges);
    edges.forEach((edge) => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.voisin);

      if (edge.source === edge.voisin || edge.poids === '' || edge.poids < 1) {
        invalidEdges.push(edge);
      }
    });
    if (connectedNodes.size !== nodeName.length || invalidEdges.length > 0) {
      if (connectedNodes.size !== nodeName.length) {
        alert(
          'Tous les nœuds ne sont pas connectés. Veuillez établir des connexions pour tous les nœuds'
        );
      }
      if (invalidEdges.length > 0) {
        invalidEdges.forEach((edge) => {
          alert(
            `Relation non valide : De ${edge.source} à ${edge.voisin} avec le poids ${edge.poids}. Veuillez vous assurer que toutes les arêtes ont des nœuds source et destination différents, et que les poids sont supérieurs ou égaux à 1.`
          );
        });
      }
    } else {
      if (selectedoption == '') {
        alert('Veuillez selectionner un algorithme');
      } else {
        if (selectedoption === 'djikstra') {
          const resultDjikstra = testDjikstra(
            nodeName,
            edges,
            startingNode,
            endingNode
          );
          setDjisktraResponse(resultDjikstra);
          setPrimResponse('');
          setKruskalResponse('');
          console.log('distanceCourte:', resultDjikstra.distanceCourte);
          console.log('distanceCourtesFromA:', resultDjikstra.summaryDjikstra);
        }
        if (selectedoption === 'prim') {
          const resultPrim = testPrim(
            nodeName,
            edges,
            startingNode,
            endingNode
          );
          setPrimResponse(resultPrim);
          setDjisktraResponse('');
          setKruskalResponse('');
          console.log(
            'Minimum Spanning Tree Kruskal:',
            resultPrim.arbreMinimal
          );
          console.log(
            'Map representation of shortest path',
            resultPrim.summaryPrim
          );
        }
        if (selectedoption === 'krustal') {
          // Exemple d'utilisation
          const resultKruskal = testKruskal(
            nodeName,
            edges,
            startingNode,
            endingNode
          );
          setKruskalResponse(resultKruskal);
          setDjisktraResponse('');
          setPrimResponse('');
          console.log(
            'Minimum Spanning Tree Kruskal :',
            resultKruskal.minimumSpanningTree
          );
          console.log('Map representation:', resultKruskal.summaryKruskal);
        }
      }
    }
  };

  const handleDelete = (index) => {
    const newArray = [...edges];
    newArray.splice(index, 1);
    setEdges(newArray);
  };
  useEffect(() => {
    console.log('relationships', edges);
    console.log('starting_node', startingNode);
    console.log('ending_node', endingNode);
    console.log('node_name', nodeName);
    console.log('djikstraResponse', djikstraResponse);
  }, [edges, startingNode]);
  return (
    <>
      <div className="app-container">
        {popUpVisible ? (
          <div className="notepopup-main">
            <div className="notepopup-container">
              <div className="notepopup-content">
                <p>Entrez le nombre de nœuds</p>
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
            <div className="relatn-container-algos">
              <div className="section1">
                <h1>Projet de Recherche Operationnelle: Algorithme des Graphes</h1>
                <div className="choose-node-div">
                  <h2 className="algos-h2">Choisissez votre nœud de départ</h2>
                  <select
                    className="select-option"
                    id="nodes"
                    name="nodes"
                    value={startingNode}
                    onChange={(e) => setStartingNode(e.target.value)}
                  >
                    {nodeName.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <h2 className="algos-h2">Choisissez votre nœud d'arrivée</h2>
                  <select
                    className="select-option"
                    id="nodes"
                    name="nodes"
                    value={endingNode}
                    onChange={(e) => setendingNode(e.target.value)}
                  >
                    {nodeName.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <h2 className="heading algos-h2">
                  Établir la relation entre vos nœuds{' '}
                </h2>
                <div className="main-container-nodes">
                  {edges.map((relation, index) => (
                    <div key={index} className="input-container-nodes">
                      <div className="from-container">
                        <label className="label" htmlFor="nodes">
                          Source
                        </label>
                        <select
                          id="fromNode"
                          name="fromNode"
                          value={relation.source}
                          onChange={(e) =>
                            handleRelationshipChange(
                              index,
                              'source',
                              e.target.value
                            )
                          }
                        >
                          {nodeName.map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="from-container">
                        <label className="label" htmlFor="nodes">
                          Voisin
                        </label>
                        <select
                          id="toNode"
                          name="toNode"
                          value={relation.voisin}
                          onChange={(e) =>
                            handleRelationshipChange(
                              index,
                              'voisin',
                              e.target.value
                            )
                          }
                        >
                          {nodeName.map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="from-container">
                        <label htmlFor="" className="label">
                          Poids
                        </label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={relation.weight}
                          onChange={(e) =>
                            handleRelationshipChange(
                              index,
                              'poids',
                              e.target.value
                            )
                          }
                          onInput={(e) =>
                            e.target.validity.valid || (e.target.value = '')
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
                <div className="buttons">
                  <button
                    className="new-relatn"
                    onClick={handleAddRelationship}
                  >
                    Ajouter une relation
                  </button>
                </div>
                <div
                  style={{ marginTop: '16px' }}
                  className="finish_algorithms"
                >
                  <div className="algorith">
                    <h2 style={{ textAlign: 'center' }} className="heading">
                      Algorithmes{' '}
                    </h2>
                    <form>
                      <fieldset>
                        <legend>
                          Selectionnez l'algorithme de votre choix
                        </legend>
                        <div>
                          <input
                            type="radio"
                            id="djik"
                            name="algo"
                            value="djikstra"
                            checked={selectedoption === 'djikstra'}
                            onChange={handleoptionchange}
                          />
                          <label htmlFor="djik">Djikstra</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="prim"
                            name="algo"
                            value="prim"
                            checked={selectedoption === 'prim'}
                            onChange={handleoptionchange}
                          />
                          <label htmlFor="prim">Prim</label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="krustal"
                            name="algo"
                            value="krustal"
                            checked={selectedoption === 'krustal'}
                            onChange={handleoptionchange}
                          />
                          <label htmlFor="krustal">Krustal</label>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                  <div style={{ marginTop: '24px' }} className="finish">
                    <button className="finish-btn" onClick={handleFinish}>
                      Terminer
                    </button>
                  </div>
                </div>
              </div>
              <div className="section2">
                {djikstraResponse && (
                  <div>
                    <h2 className="algos-h2 color-h2">Solution Djikstra</h2>
                    {Array.from(djikstraResponse.distanceCourte.entries()).map(
                      ([key, value]) => (
                        <div className="algo-answers" key={key}>
                          {key}:{' '}
                          {value.map((item, index) => (
                            <span key={index}>
                              {item}
                              {index < value.length - 1 && ' ---> '}
                            </span>
                          ))}
                        </div>
                      )
                    )}

                    {djikstraResponse.summaryDjikstra.map((item, index) => (
                      <div className="algo-answers" key={index}>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {kruskalResponse && (
                  <div>
                    <h2 className="algos-h2 color-h2">Solution Kruskal</h2>
                    {kruskalResponse.summaryKruskal.map((item, index) => (
                      <h3 className="algo-answers" key={index}>
                        {item}
                      </h3>
                    ))}
                    <h3 className="algo-answers">L'Arbe Minimal Kruskal</h3>
                    <div className="kruskal-algo-answers">
                      {kruskalResponse.minimumSpanningTree.map(
                        (item, index) => (
                          <div className="kruskal-display" key={index}>
                            <div className="algo-answers">
                              Source: {item.source}
                            </div>
                            <div className="algo-answers">
                              Voisin: {item.voisin}
                            </div>
                            <div className="algo-answers">
                              Poids: {item.poids}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {primResponse && (
                  <div>
                    <h2 className="algos-h2 color-h2">Solution Prim</h2>
                    {primResponse.summaryPrim.map((item, index) => (
                      <h3 className="algo-answers" key={index}>
                        {item}
                      </h3>
                    ))}
                    <h3 className="algo-answers">L'Arbe Minimal Prim</h3>
                    <div className="kruskal-algo-answers">
                      {primResponse.arbreMinimal.map((item, index) => (
                        <div className="kruskal-display" key={index}>
                          <div className="algo-answers">
                            Source: {item.source}
                          </div>
                          <div className="algo-answers">
                            Voisin: {item.voisin}
                          </div>
                          <div className="algo-answers">
                            Poids: {item.poids}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Assignment_1;
