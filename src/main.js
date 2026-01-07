import Chart from 'chart.js/auto';
// utiliser un plugin


// URL de JSON permettant d'importer le fichier
const url_json = 'https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json'; 

let monGraphique = null; // stocker l'instance du graphique
let divHide = document.getElementById('loose');

async function init() {
    try {
    // Récupération des données
    const reponse = await fetch(url_json);
    if (!reponse.ok) throw new Error('Erreur réseau');
    const data = await reponse.json();

    

    //débugage pour comprendre les données reçu
    /*console.log("Données reçues :", data);
    console.log(data[2].data);*/

    // Préparation des données

    // permet d'avoir toutes les familles dans le tab cat
    let cat = data[2].data
        .map(item => item.family);
    cat = [...new Set(cat)]; // enlève les doublons

    /*console.log(cat);*/

    let btnZone = document.getElementById('button-container');
    

    cat.forEach(famille => {
        let btn = document.createElement('button');
        btn.innerText = famille;

        btn.onclick = () => {
            /*console.log(famille);*/
            chargerUneFamille(famille, data[2].data);
            divHide.style.display = "block";
        } 
        btnZone.appendChild(btn);
    });
    /*

    // charger les données de chaque famille groupé
    cat.forEach(famille => {
        chargerUneFamille(famille, data[2].data);
    });

    */

    /*
        // permet d'avoir les données d'un fullname
        const dataFiltree = data[2].data
            .filter(item => item.fullname.includes('AztecDiamond-050'))
            .sort((a, b) => a.time - b.time);     
    */
    /*
        // permet d'avoir tout les fullname d'une famille
        const dataFamily = data[2].data
            .filter(item => item.fullname && item.family.includes('AztecDiamond'))
            .reduce((acc,item) => { // defini reduce un objet et la liste des item filtré.
                const cle = item.fullname; // defini la valeur de la clé avec l'item suivant
                if (!acc[cle]) { // vérifie si un groupe avec cette clé existe
                    acc[cle] = [];  // si non on crée un nouveau groupe
                }
                acc[cle].push(item);    // on push l'item au groupe
                return acc; // rend le groupe pour l'item suivant
            },{});  // défini acc, soit un objet vide

        console.log(dataFamily);
    */

    } catch (erreur) {
    console.error("Problème :", erreur);
    alert("Erreur lors du chargement des données. Regarde la console.");
    }
}

function chargerUneFamille(famille, data){
    // permet de grouper par fullname et ses données une famille, il comprend tout les données d'un famille
    const dataFamille = data
        .filter(item => item.fullname && item.family.includes(famille))
        .reduce((acc,item) => { // defini reduce un objet et la liste des item filtré.
            const cle = item.fullname; // defini la valeur de la clé avec l'item suivant
            if (!acc[cle]) { // vérifie si un groupe avec cette clé existe
                acc[cle] = [];  // si non on crée un nouveau groupe
            }
            acc[cle].push(item);    // on push l'item au groupe
            return acc; // rend le groupe pour l'item suivant
        },[]);  // défini acc, soit un objet vide

    // une liste des problèmes de cette famille
    let Listeproblemes = data
        .filter(item => item.fullname && item.family.includes(famille))
        .map(item => item.fullname);
    Listeproblemes = [...new Set(Listeproblemes)]; // enlève les doublons

    afficherFamille(dataFamille, Listeproblemes, famille);

    /*console.log("famille : ", famille, dataFamille);
    console.log("fullname : ", Listeproblemes);*/
}


function afficherFamille(dataFamille, Listeproblemes, famille) {

    // Défini dataFiltree avec les données de la famille données et ces problèmes associés
    let dataFiltree;
    let temps;
    let joueurs;
    let datas;
    let colors;


    // défini le contenu de dataset (Chart) avec le temps de chacun par problème de la famille renseigné plus haut
    datas = Listeproblemes.map(probleme => {
        dataFiltree = dataFamille[probleme]
            .sort((a, b) => a.time - b.time);
        //console.log(dataFiltree);
        temps = dataFiltree.map(item => item.time); // Axe y

        colors = temps.map(temp => {
            if (temp >= 10000) {
                return colors = '#FA5C5C';
            }
            else {
                return colors = '#222831';
            }
        }); 
        //console.log(temps);
        return {
            label: probleme,
            data: temps,
            borderWidth: 1,
            backgroundColor: colors,
            borderColor: colors
        }
        });

    joueurs = dataFiltree.map(item => item.name);   // Axe X

    let nomDuProbleme = famille;
    

    /*console.log("temps", temps);
    console.log("data", datas);*/

    // 4. Création du graphique
    const ctx = document.querySelector('#canva0'); // On cible le canvas
    
    if (monGraphique) { // permet de détruire le précédent 
        monGraphique.destroy();
    }
    monGraphique = new Chart(ctx, {
    type: 'bar', // Types possibles: 'bar', 'line', 'pie', 'doughnut'
    data: {
        labels: joueurs,
        datasets: datas
    },
    options: {
        borderRadius: 2,
        scales: {
            x: {
                grid: {
                display: false, 
                drawBorder: false // ligne bas false
                },
                title: {
                display: true,
                text: 'Algorithmes (Solveurs)', // Titre en bas
                color: 'rgba(0, 0, 0, 1)',
                }
            },
            y: { 
                type: 'logarithmic',
                grid: {
                color: 'rgba(200, 200, 200, 0.5)', // Lignes horizontales très discrètes pour rendre ça plus beau
                },
                title: {
                display: true,
                text: 'Temps (en s)' // Titre à gauche
                },
                beginAtZero: true 
            }
        },
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Problème : ' + nomDuProbleme // Affiche le nom du problème en titre
            },
            tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 10,
            cornerRadius: 4,
            callbacks: {
                // cela rajoute sec après les datas de l'info bulles
                label: function(context) {
                    return context.dataset.label + ': ' + context.raw + ' sec';
                    }
                }
            },
            datalabels: {
            color: 'black',
            anchor: 'end', // Ancré à la fin de la barre
            align: 'top',  // Affiché au-dessus
            formatter: function(value, context) {
                    // Tu peux changer le texte ici (ex: ajouter "s")
                    return value + ' s';
                }
            }
        },

}
    });
}

// On lance la fonction
init();