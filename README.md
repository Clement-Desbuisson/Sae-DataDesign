# Sae-DataDesign
# composition de l'équipe : 
Desbuisson Clément MMI2 A1
# Problème rencontré :
J'ai eu du mal a donner le bon temps a mes données, elle avaient toutes les valeurs des derniers temps de chaque famille groupé et non pas le temps par fullname, c'est a dire que  Ace avait le même temps pour toutes épreuves de la famille AztecDiamond etc pour chaque famille avec le temps de la dernière épreuve de chaque famille.
J'ai fini par faire un .map au lieu de mon .forEach, et mieux structurer et y inclure mon assignation de time afin qu'il contiennet bien les infos de cette épreuve et non qu'elle se fasse écraser a la fin puis être assigné.

J'ai eu du mal a faire fonctionner le plugin de labels sur les barres, après de longues recherche j'ai réussi a trouver les paramètres que je voulais et réussi a les implémenter approximativement.

J'ai aussi eu du mal a stylisé le graph avec les données d'autant plus que ce ne sont que des paramètres a connaitre et j'ai du chercher très souvent comment si ou ça, a force j'ai remarqué des similitude dans les paramètres mais desfois cela ne marche pas non plus. 

j'ai eu énormément de mal a comprendre ce qu'était les données que nous avons eu n'ayant pas vu les messages de précisions sur facebook mais j'ai réussi à analyser et faire des recherches sur les solvers.

# Visualisation proposé : 
Je suis parti sur le principe que l'on veut voir le score de tout les algorithmes sur une famille précise, c'est a dire que l'on voit toutes les sous-épreuves qui sont de plus en plus difficile et l'on peut comparer le temps que met l'algo a réussir toutes les sous-épreuves mais aussi en voir une sous-épreuve particulière sur toutes. J'ai donc compartimenté par famille et mit en rouge celle qui sont TIME Out c'est a dire qui n'ont pas réussi dans les temps.


# Utilisation d'un plugin & chart.js: 
npm install chartjs-plugin-datalabels
npm install chart.js