class Noeud {
  constructor(nom) {
    this.nom = nom; // Correction ici
    this.voisins = new Map();
    this.precedent = null; // Ajout de la propriété 'precedent'
  }

  ajouterVoisin(noeud, poids) {
    this.voisins.set(noeud, poids);
  }
}

class UnionFind {
  constructor(elements) {
    this.parent = new Map();
    this.rank = new Map();

    for (const elem of elements) {
      this.parent.set(elem, elem);
      this.rank.set(elem, 0);
    }
  }

  find(elem) {
    if (this.parent.get(elem) !== elem) {
      this.parent.set(elem, this.find(this.parent.get(elem)));
    }
    return this.parent.get(elem);
  }

  union(elem1, elem2) {
    const root1 = this.find(elem1);
    const root2 = this.find(elem2);

    if (root1 !== root2) {
      const rank1 = this.rank.get(root1);
      const rank2 = this.rank.get(root2);

      if (rank1 > rank2) {
        this.parent.set(root2, root1);
      } else if (rank1 < rank2) {
        this.parent.set(root1, root2);
      } else {
        this.parent.set(root2, root1);
        this.rank.set(root1, rank1 + 1);
      }
    }
  }
}

export function kruskal(graphe) {
  const arbreMinimal = [];
  const arêtes = [];

  for (const noeud of Object.values(graphe)) {
    for (const [voisin, poids] of noeud.voisins) {
      arêtes.push({ source: noeud, voisin: voisin, poids: poids });
    }
  }

  arêtes.sort((a, b) => a.poids - b.poids);

  const unionFind = new UnionFind(Object.values(graphe));

  for (const arête of arêtes) {
    if (unionFind.find(arête.source) !== unionFind.find(arête.voisin)) {
      arbreMinimal.push(arête);
      unionFind.union(arête.source, arête.voisin);
      arête.voisin.precedent = arête.source; // Mettre à jour le précédent
    }
  }

  return arbreMinimal;
}

export function createNodeFromListKruskal(nodeNames) {
  const graphe = {};

  for (const name of nodeNames) {
    const newNode = new Noeud(name);
    graphe[name] = newNode;
  }

  return graphe;
}

export function ajouterVoisinFromTableauKruskal(graphe, tableau) {
  for (const { source, voisin, poids } of tableau) {
    if (graphe.hasOwnProperty(source) && graphe.hasOwnProperty(voisin)) {
      graphe[source].ajouterVoisin(graphe[voisin], poids);
    }
  }
}

export function afficherCheminPlusCourtKruskal(noeudDepart, noeudFinal) {
  let chemin = [];
  let cheminKruskal = []
  let noeudCourant = noeudFinal;

  while (noeudCourant !== null && noeudCourant !== noeudDepart) {
    chemin.unshift(noeudCourant.nom);
    noeudCourant = noeudCourant.precedent;
  }

  if (noeudCourant === noeudDepart) {
    chemin.unshift(noeudDepart.nom);
    cheminKruskal.push(`Le plus court chemin de ${noeudDepart.nom} à ${noeudFinal.nom} : ${chemin.join(' -> ')}`)
  } else {
    console.log(`Aucun chemin de ${noeudDepart.nom} à ${noeudFinal.nom} trouvé.`);
  }
  return cheminKruskal;
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
  { source: 'D', voisin: 'E', poids: 2 },

];


export function testKruskal(nodeName, edges, startingNode, endingNode) {
  const graph = createNodeFromListKruskal(nodeName);
  ajouterVoisinFromTableauKruskal(graph, edges);
  const minimumSpanningTree_first = kruskal(graph);
  const noeudDepart = graph[startingNode];
  const noeudFinal = graph[endingNode];
  const summaryKruskal = afficherCheminPlusCourtKruskal(noeudDepart, noeudFinal);
  const minimumSpanningTree = minimumSpanningTree_first.map(edge => ({
    source: edge.source.nom,
    voisin: edge.voisin.nom,
    poids: edge.poids
  }));
  return { minimumSpanningTree, summaryKruskal };
}
const kruskalAnswer = testKruskal(nodeNames, tableauVoisins, 'A', 'E')
console.log('Minimum spanning tree', kruskalAnswer.minimumSpanningTree);
console.log(kruskalAnswer.summaryKruskal);



