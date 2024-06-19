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

export function prim(graphe) {
  const arbreMinimal = [];
  const ensembleNoeuds = new Set(Object.values(graphe));
  const noeudDepart = ensembleNoeuds.values().next().value;
  noeudDepart.distance = 0;

  while (ensembleNoeuds.size > 0) {
    const noeudCourant = obtenirNoeudAvecDistanceMinimale(ensembleNoeuds);
    ensembleNoeuds.delete(noeudCourant);

    if (noeudCourant.precedent !== null) {
      arbreMinimal.push({
        source: noeudCourant.precedent.nom,
        voisin: noeudCourant.nom,
        poids: noeudCourant.distance
      });
    }

    for (const [voisin, poids] of noeudCourant.voisins) {
      if (ensembleNoeuds.has(voisin) && poids < voisin.distance) {
        voisin.distance = poids;
        voisin.precedent = noeudCourant;
      }
    }
  }

  return arbreMinimal;
}

function obtenirNoeudAvecDistanceMinimale(ensembleNoeuds) {
  let noeudMin = null;

  for (const noeud of ensembleNoeuds) {
    if (noeudMin === null || noeud.distance < noeudMin.distance) {
      noeudMin = noeud;
    }
  }

  return noeudMin;
}

export function createNodeFromList(nodeNames) {
  const graphe = {};

  for (const name of nodeNames) {
    const newNode = new Noeud(name);
    graphe[name] = newNode;
  }

  return graphe;
}

export function ajouterVoisinFromTableau(graphe, tableau) {
  for (const { source, voisin, poids } of tableau) {
    if (graphe.hasOwnProperty(source) && graphe.hasOwnProperty(voisin)) {
      graphe[source].ajouterVoisin(graphe[voisin], poids);
    }
  }
}

export function afficherCheminPlusCourt(graphe, noeudDepart, noeudFinal) {
  let chemin = [];
  let summaryPrim = [];
  let noeudCourant = noeudFinal;

  while (noeudCourant !== noeudDepart) {
    chemin.unshift(noeudCourant.nom);
    noeudCourant = noeudCourant.precedent;
  }

  chemin.unshift(noeudDepart.nom);
  summaryPrim.push(`Le plus court chemin de ${noeudDepart.nom} à ${noeudFinal.nom} : ${chemin.join(' -> ')}`)
  // console.log(
  //   `Le plus court chemin de ${noeudDepart.nom} à ${noeudFinal.nom} : ${chemin.join(' -> ')}`
  // );
  return summaryPrim;
}

// Exemple d'utilisation

let nodeNames = ['A', 'B', 'C', 'D', 'E'];
const tableauVoisins = [
  { source: 'A', voisin: 'B', poids: 4 },
  { source: 'A', voisin: 'C', poids: 2 },
  { source: 'B', voisin: 'D', poids: 5 },
  { source: 'C', voisin: 'B', poids: 1 },
  { source: 'C', voisin: 'D', poids: 8 },
  { source: 'C', voisin: 'E', poids: 10 },
  { source: 'D', voisin: 'E', poids: 2 }
];

export function testPrim(nodeName, edges, startingNode, endingNode) {
  const graphe = createNodeFromList(nodeName);
  ajouterVoisinFromTableau(graphe, edges);
  const arbreMinimal = prim(graphe);
  const noeudDepart = graphe[startingNode];
  const noeudFinal = graphe[endingNode];
  const summaryPrim = afficherCheminPlusCourt(graphe, noeudDepart, noeudFinal);
  return {
    arbreMinimal,
    summaryPrim
  }
}
const resultKruskal = testPrim(nodeNames, tableauVoisins, 'A', 'E')
console.log(resultKruskal.arbreMinimal)
console.log(resultKruskal.summaryPrim)