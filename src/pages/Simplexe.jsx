import React, { useState, useEffect } from 'react';
import './styles/popUp.css';
import './styles/assignment1.css';
import { ProblemeLineaireSimplexe } from '../algos/simplexe';

const Simplexe = () => {
  const [varNo, setVarNo] = useState();
  const [varNames, setVarNames] = useState([]);
  const [popUpVisible, setPopUpVisible] = useState(true);
  const [coeffNames, setCoeffNames] = useState([]);
  const [problemType, setProblemType] = useState('maximiser');
  const [linearEquations, setLinearEquations] = useState([]);
  const [objectiveFunction, setObjectiveFunction] = useState({});
  const [simplexeResult, setSimplexeResult] = useState();
  const maxVarNo = 5;

  const generateVar = (coeffNo) => {
    //to generate the variables
    const var_names = [];
    const coeff_names = [];
    for (let i = 1; i <= coeffNo; i++) {
      var_names.push(`x${i}`);
      coeff_names.push(`c${i}`);
    }
    setVarNames(var_names);
    setCoeffNames(coeff_names);
  };

  const generateLinearEquation = (VarNo) => {
    const equations = [];
    const equation = {};
    for (let j = 1; j <= VarNo; j++) {
      equation[`x${j}`] = 0; // Initialize all coefficients to 0 or some default value
    }
    equation.type = '<='; // or '==' or '>=' depending on your requirement
    equation.valeur = 0; //
    equations.push(equation);

    setLinearEquations(equations);
  };

  const generateObjectiveFunction = (VarNo) => {
    const objFunc = {};
    for (let j = 1; j <= VarNo; j++) {
      objFunc[`x${j}`] = 0;
    }
    setObjectiveFunction(objFunc);
  };

  const handleObjectiveChange = (key, value) => {
    setObjectiveFunction((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleAddLinearEquation = () => {
    const newEquation = {};
    for (let j = 1; j <= varNames.length; j++) {
      newEquation[`x${j}`] = 0;
    }
    newEquation.type = '<='; // or '==' or '>=' depending on your requirement
    newEquation.valeur = 0;
    setLinearEquations([...linearEquations, newEquation]);
  };

  const handleLinearEquationChange = (index, key, value) => {
    const updatedEquations = [...linearEquations];
    updatedEquations[index][key] =
      key === 'type' ? String(value) : Number(value);
    setLinearEquations(updatedEquations);
  };

  const handleDeleteEquation = (index) => {
    const newArray = [...linearEquations];
    newArray.splice(index, 1);
    setLinearEquations(newArray);
  };

  const handleProblemTypeChange = (e) => {
    setProblemType(e.target.value);
  };
  const handleEnterClick = () => {
    if (varNo < 0 || varNo > maxVarNo || varNo < 2) {
      alert('Veuillez saisir un nombre valide de variables (minimum 2)');
    } else {
      setPopUpVisible(false);
      generateVar(varNo);
      generateLinearEquation(varNo);
      generateObjectiveFunction(varNo);
    }
  };

  const convertToConstraintsFormat = (linearEquations, variableNames) => {
    return linearEquations.map((equation) => {
      const coefficients = variableNames.map(
        (varName) => equation[varName] || 0
      );
      return {
        coefficients,
        type: equation.type,
        valeur: equation.valeur,
      };
    });
  };
  const handleFinish = () => {
    try {
      const exempleProbleme = new ProblemeLineaireSimplexe(
        problemType,
        Object.values(objectiveFunction),
        convertToConstraintsFormat(linearEquations, varNames),
        varNames
      );
      console.log(exempleProbleme);
      const solution = exempleProbleme.resoudre();
      console.log('Solution:', solution);
      setSimplexeResult(solution);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log('Linear Equation', linearEquations);
    console.log('Objective Function', objectiveFunction);
    console.log('Variable names', varNames);
    console.log('probleme type', problemType);
  }, [varNames, linearEquations, problemType, objectiveFunction]);
  return (
    <>
      <div className="app-container">
        {popUpVisible ? (
          <div className="notepopup-main">
            <div className="notepopup-container">
              <div className="notepopup-content">
                <p>Entrez le nombre de variables</p>
                <input
                  type="number"
                  id="nodeNumber"
                  onChange={(e) => setVarNo(parseInt(e.target.value))}
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
                <h1>Projet de Recherche Operationnelle: Methode Simplexe</h1>
                <h2 className="algos-h2">
                  Voulez-vous résoudre un problème de maximisation ou de
                  minimisation ?
                </h2>
                <div className="choose-node-div">
                  <select
                    id="problemType"
                    className="basic-multi-select"
                    value={problemType}
                    onChange={handleProblemTypeChange}
                  >
                    <option value="maximiser">Maximisation</option>
                    <option value="minimiser">Minimisation</option>
                  </select>
                </div>
                <h2 className="algos-h2">
                  Entrez les coefficients de la fonction objectif. Type z = f(x)
                </h2>
                <div className="input-container-nodes center-style">
                  {Object.entries(objectiveFunction).map(
                    ([key, value], index) => (
                      <div key={index} className="from-container">
                        <label htmlFor={key} className="label">
                          {key}:
                        </label>
                        <input
                          className="input-simplexe"
                          type="number"
                          name={key}
                          id={key}
                          onChange={(e) =>
                            handleObjectiveChange(key, e.target.value)
                          }
                          onInput={(e) =>
                            e.target.validity.valid || (e.target.value = '')
                          }
                        />
                      </div>
                    )
                  )}
                </div>

                <h2 className="algos-h2">
                  Entrez les coefficients de vos équations de contrainte
                </h2>
                <div className="main-container-nodes">
                  {linearEquations.map((equation, eqIndex) => (
                    <div
                      key={eqIndex}
                      className="input-container-nodes center-style"
                    >
                      {varNames.map((varName, varIndex) => (
                        <div key={varIndex} className="from-container">
                          <label
                            htmlFor={`${varName}-${eqIndex}`}
                            className="label"
                          >
                            {varName}:
                          </label>
                          <input
                            className="input-simplexe"
                            type="number"
                            name={`${varName}-${eqIndex}`}
                            id={`${varName}-${eqIndex}`}
                            onChange={(e) =>
                              handleLinearEquationChange(
                                eqIndex,
                                varName,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                      <div className="from-container">
                        <label htmlFor={`type-${eqIndex}`} className="label">
                          Type d'égalité
                        </label>
                        <select
                          name={`type-${eqIndex}`}
                          id={`type-${eqIndex}`}
                          onChange={(e) =>
                            handleLinearEquationChange(
                              eqIndex,
                              'type',
                              e.target.value
                            )
                          }
                        >
                          <option value="<=">&le;</option>
                          <option value="=">=</option>
                          <option value=">=">&ge;</option>
                        </select>
                      </div>
                      <div className="from-container">
                        <label htmlFor={`Valeur-${eqIndex}`} className="label">
                          Valeur
                        </label>
                        <input
                          className="input-simplexe"
                          type="number"
                          name={`valeur-${eqIndex}`}
                          id={`valeur-${eqIndex}`}
                          onChange={(e) =>
                            handleLinearEquationChange(
                              eqIndex,
                              'valeur',
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
                          onClick={() => handleDeleteEquation(eqIndex)}
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
                    onClick={handleAddLinearEquation}
                  >
                    Ajouter une equation
                  </button>
                  <button className="finish-btn" onClick={handleFinish}>
                    Terminer
                  </button>
                </div>
                {/* <div className="table-display-simplexe">
                  <h2 className="algos-h2">Visualisation du tableau sans variables d'écart.</h2>
                  <div className="center-style">
                    <table>
                      <thead>
                        <tr>
                          {varNames.map((value, index) => (
                            <>
                              <th>{value}</th>
                            </>
                          ))}
                          <th>z</th>
                          <th>constant</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div> */}
                <div className="section2">
                  {simplexeResult && (
                    <>
                      <h2 className="algos-h2 color-h2">Solution Simplexe</h2>
                      <div className="result-simplexe">
                        {Object.entries(simplexeResult).map(
                          ([key, value], index) => (
                            <div key={index}>
                              <h2>
                                {key}: <span>{value}</span>
                              </h2>
                            </div>
                          )
                        )}
                        <h2>
                          La valeur maximale optimale est {simplexeResult.z}
                        </h2>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Simplexe;
