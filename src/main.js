import Chart from 'chart.js/auto';
// utilisation d'un plugin afin d'avoir les labels sur les barres
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
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
    let dataFiltree;
    let temps;
    let joueurs;
    let datas;
    let colors;


    // défini le contenu de dataset (Chart) avec le temps de chacun par problème de la famille renseigné plus haut
    datas = Listeproblemes.map((probleme,index) => { // index permet d'être utilisé lors de return afin de savoir si c'est la première instance du index, pour masquer ou non par défault
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
            borderColor: colors,
            hidden: (index !== 0),
        }
        });

    joueurs = dataFiltree.map(item => item.name);   // Axe X

    let nomDuProbleme = famille;
    

    /*console.log("temps", temps);
    console.log("data", datas);*/

    const ctx = document.querySelector('#canva0');
    
    if (monGraphique) { // destroy précédent
        monGraphique.destroy();
    }
    monGraphique = new Chart(ctx, {
    type: 'bar',
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
                color: 'rgba(200, 200, 200, 0.5)',
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
                labels: {
                    padding: 10,
                }
            },
            title: {
                display: true,
                text: 'Problème : ' + nomDuProbleme, // Affiche le nom du problème en titre
                padding: {
                    top: 20,
                    bottom: 20,
                },
                color: '#393E46',
                font: {
                size: 24,      
                weight: 'bold', 
                family: 'Arial',
                },
                
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
            display: 'auto',
            color: '#393E46',
            anchor: 'end', 
            align: 'top',
            rotation: 0,
            formatter: function(value, context) {
                    if (value == 10000) return "";
                    return Math.round(value) + 's';
                }
            }
        },

}
    });
}

// On lance la fonction
init();