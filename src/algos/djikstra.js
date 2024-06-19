import { map } from "d3";

class Noeud {
  constructor(nom) {
    this.nom = nom;
    this.voisins = new Map();
    this.distance = Infinity;
    this.precedent = null;
  }

  ajouterVoisin(noeud, poids) {
    this.voisins.set(noeud, poids);
  }
}

function dijkstra(graphe, depart) {
  depart.distance = 0;

  let noeudsNonVisites = new Set(Object.values(graphe));

  while (noeudsNonVisites.size > 0) {
    let noeudCourant = obtenirNoeudPlusProche(noeudsNonVisites);
    // console.log(noeudCourant);
    for (let [voisin, poids] of noeudCourant.voisins) {
      let distanceTemp = noeudCourant.distance + poids;

      if (distanceTemp < voisin.distance) {
        voisin.distance = distanceTemp;
        voisin.precedent = noeudCourant;
      }
    }

    noeudsNonVisites.delete(noeudCourant);
  }
}

function obtenirNoeudPlusProche(noeuds) {
  let plusPetiteDistance = Infinity;
  let noeudPlusProche = null;

  for (let noeud of noeuds) {
    if (noeud.distance < plusPetiteDistance) {
      plusPetiteDistance = noeud.distance;
      noeudPlusProche = noeud;
    }
  }

  return noeudPlusProche;
}

function createNodesFromList(nodeNames) {
  const graphe = {};

  for (const name of nodeNames) {
    const newNode = new Noeud(name);
    graphe[name] = newNode;
  }

  return graphe;
}
//pour ajouter les voisins a partir d'un tableau
function ajouterVoisinFromTableau(graphe, tableau) {
  for (const { source, voisin, poids } of tableau) {
    if (graphe.hasOwnProperty(source) && graphe.hasOwnProperty(voisin)) {
      graphe[source].ajouterVoisin(graphe[voisin], poids);
    }
  }
}


function afficherDistancesPlusCourtes(graphe) {
  const summary = [];
  for (const [nom, noeud] of Object.entries(graphe)) {
    summary.push(`Distance la plus courte du noeud A vers le nœud ${nom} est : ${noeud.distance}`);
  }
  return summary;
}



function afficherCheminPlusCourt(graphe, noeudFinal) {
  let chemin = [];
  let noeudCourant = noeudFinal;

  while (noeudCourant !== null) {
    chemin.unshift(noeudCourant.nom);
    noeudCourant = noeudCourant.precedent;
  }

  // console.log(chemin);
  // console.log(`Le plus court chemin vers le nœud ${noeudFinal.nom} : ${chemin.join(' -> ')}`);
  return chemin;
}

function cheminLePlusCourtVersToutNoeud(graphe, liste) {
  let tab = new Map();

  for (const nomNoeud of liste) {

    let chemin = afficherCheminPlusCourt(graphe, graphe[nomNoeud]);

    tab.set(nomNoeud, chemin);
  }
  // console.log(tab);
  return tab;
}



let nodeNames = ['A', 'B', 'C', 'D', 'E'];
const graphe = createNodesFromList(nodeNames);
// console.log("le graphe", graphe);

const tableauVoisins = [
  { source: 'A', voisin: 'B', poids: 4 },
  { source: 'A', voisin: 'C', poids: 2 },
  { source: 'B', voisin: 'D', poids: 5 },
  { source: 'C', voisin: 'B', poids: 1 },
  { source: 'C', voisin: 'D', poids: 8 },
  { source: 'C', voisin: 'E', poids: 10 },
  { source: 'D', voisin: 'E', poids: 2 }
];
ajouterVoisinFromTableau(graphe, tableauVoisins);
//la fonction est appliker entre le graphe et le noeud de depart ki est le premier noeud du tableau nodeNames
dijkstra(graphe, graphe['A']);

// afficherDistancesPlusCourtes(graphe);
afficherCheminPlusCourt(graphe, graphe['D']);
const grapheMinimal = [];

//noeud c'est un nom, graphe[noeud] c'est un noeud dontenant l'attribut voisin ki est une map de cle la distance par rapport a noeud et de valeur un noeud ki a son nom
for (const noeud in graphe) {
  graphe[noeud].voisins.forEach((key, element) => {
    // console.log(element.nom, key);
    const tab = { source: noeud, voisin: element.nom, poids: key }
    grapheMinimal.push(tab);

  });
}

cheminLePlusCourtVersToutNoeud(graphe, nodeNames)

export function testDjikstra(nodeName, edges, startingNode, endingNode) {
  const graphe = createNodesFromList(nodeName);
  ajouterVoisinFromTableau(graphe, edges);
  dijkstra(graphe, graphe[startingNode]);
  const summaryDjikstra = afficherDistancesPlusCourtes(graphe);
  afficherCheminPlusCourt(graphe, graphe[endingNode]);
  const distanceCourte = cheminLePlusCourtVersToutNoeud(
    graphe,
    nodeName
  );
  return {
    distanceCourte,
    summaryDjikstra
  };
  // console.log('DIJKSTRA: Les chemins les plus courts quittant du noeud A sont', distanceCourte);
}
const { distanceCourte, summaryDjikstra } = testDjikstra(nodeNames, tableauVoisins, 'A', 'E');
for (const [key, value] of distanceCourte.entries()) {
  console.log('Key:', key);
  console.log('Value:', value);
}
console.log('distanceCourte:', distanceCourte);
console.log('distanceCourtesFromN1:', summaryDjikstra);

// const map2 = new Map([
//   ['A', ['A']],
//   ['B', ['B', 'C', 'D']],
//   ['C', ['C', 'D']],
//   ['D', ['D', 'E', 'F']],
// ]);

// for (const [key, value] of map2.entries()) {
//   console.log('Key:', key);
//   console.log('Value:', value);
// }