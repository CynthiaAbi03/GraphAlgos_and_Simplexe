export class ProblemeLineaireSimplexe {
    constructor(type, fonctionObjectif, contraintes, variables) {
        this.type = type; // 'maximiser' ou 'minimiser'
        this.fonctionObjectif = fonctionObjectif; // Tableau des coefficients de la fonction objectif
        this.contraintes = contraintes; // Tableau des contraintes
        this.variables = variables; // Tableau des variables (noms des variables)
    }

    resoudre() {
        let tableau = this.initialiserTableau();
        let iteration = 0;

        while (!this.estOptimal(tableau)) {
            iteration++;
            let colPivot = this.choisirColonnePivot(tableau);
            let lignePivot = this.choisirLignePivot(tableau, colPivot);
            this.pivoter(tableau, lignePivot, colPivot);
        }

        return this.extraireSolution(tableau);
    }

    initialiserTableau() {
        let nbContraintes = this.contraintes.length;
        let nbVariables = this.variables.length;

        let tableau = new Array(nbContraintes + 1).fill(0).map(() => new Array(nbVariables + nbContraintes + 1).fill(0));

        for (let i = 0; i < nbContraintes; i++) {
            for (let j = 0; j < nbVariables; j++) {
                tableau[i][j] = this.contraintes[i].coefficients[j];
            }
            tableau[i][nbVariables + i] = 1;
            tableau[i][nbVariables + nbContraintes] = this.contraintes[i].valeur;
        }

        for (let j = 0; j < nbVariables; j++) {
            tableau[nbContraintes][j] = this.type === 'maximiser' ? -this.fonctionObjectif[j] : this.fonctionObjectif[j];
        }

        return tableau;
    }

    estOptimal(tableau) {
        let ligneObjectif = tableau[tableau.length - 1];
        return ligneObjectif.every(coef => coef >= 0);
    }

    choisirColonnePivot(tableau) {
        let ligneObjectif = tableau[tableau.length - 1];
        let colPivot = 0;
        for (let j = 1; j < ligneObjectif.length - 1; j++) {
            if (ligneObjectif[j] < ligneObjectif[colPivot]) {
                colPivot = j;
            }
        }
        return colPivot;
    }

    choisirLignePivot(tableau, colPivot) {
        let minRatio = Infinity;
        let lignePivot = -1;
        for (let i = 0; i < tableau.length - 1; i++) {
            let ratio = tableau[i][tableau[i].length - 1] / tableau[i][colPivot];
            if (ratio > 0 && ratio < minRatio) {
                minRatio = ratio;
                lignePivot = i;
            }
        }
        return lignePivot;
    }

    pivoter(tableau, lignePivot, colPivot) {
        let pivot = tableau[lignePivot][colPivot];
        if (pivot !== 0) {
            for (let j = 0; j < tableau[lignePivot].length; j++) {
                tableau[lignePivot][j] /= pivot;
            }

            for (let i = 0; i < tableau.length; i++) {
                if (i !== lignePivot) {
                    let ratio = tableau[i][colPivot];
                    for (let j = 0; j < tableau[i].length; j++) {
                        tableau[i][j] -= ratio * tableau[lignePivot][j];
                    }
                }
            }
        }
    }


    extraireSolution(tableau) {
        let solution = {};
        for (let i = 0; i < this.variables.length; i++) {
            solution[this.variables[i]] = 0;
        }

        for (let i = 0; i < tableau.length - 1; i++) {
            for (let j = 0; j < this.variables.length; j++) {
                if (tableau[i][j] === 1) {
                    solution[this.variables[j]] = tableau[i][tableau[i].length - 1];
                }
            }
        }

        solution.z = tableau[tableau.length - 1][tableau[0].length - 1];
        return solution;
    }
}

// Exemple d'utilisation
const exempleProbleme = new ProblemeLineaireSimplexe(
    'maximiser',
    [8,10,7], // coefficients de la fonction objectif
    [
        { coefficients: [1, 3,2], type: '<=', valeur: 10 },
        { coefficients: [1, 5, 1], type: '<=', valeur: 8 },
        
    ],
    ['x1', 'x2', 'x3']
);

const solution = exempleProbleme.resoudre();
console.log('Solution:', solution);

