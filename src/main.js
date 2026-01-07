import Chart from 'chart.js/auto';

// URL de JSON permettant d'importer le fichier
const url_json = 'https://www.cril.univ-artois.fr/~lecoutre/teaching/jssae/code5/results.json'; 

let monGraphique = null; // stocker l'instance du graphique

async function afficherGraphique() {
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

    chargerUneFamille('AztecDiamond', data[2].data);
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
    // permet de grouper par fullname et ses données une famille
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
    console.log(dataFamille);
    Listeproblemes.forEach(probleme => {
        dataFiltree = dataFamille[probleme]
            .sort((a, b) => a.time - b.time);   
    });
    
    let nomDuProbleme = famille;
    
    // Données d'une famille
    const joueurs = dataFiltree.map(item => item.name);   // Axe X
    const temps = dataFiltree.map(item => item.time); // Axe Y
    
    
    const datas = Listeproblemes.map(probleme => {
        return {
            label: probleme,
            data: temps,
            borderWidth: 1,
            backgroundColor: 'rgba(56, 143, 143, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)'
        }
    })

    // 4. Création du graphique
    const ctx = document.querySelector('#canva1'); // On cible le canvas
    
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
        scales: {
            y: { beginAtZero: true }
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Problème : ' + nomDuProbleme // Affiche le nom du problème en titre
            }
        }
    }
    });
}

// On lance la fonction
afficherGraphique();