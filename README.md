# Sae-DataDesign
composition de l'équipe : 
Desbuisson Clément MMI2 A1
Problème rencontré :
J'ai eu du mal a donner le bon temps a mes données, elle avaient toutes les valeurs des derniers temps de chaque famille groupé et non pas le temps par fullname, c'est a dire que  Ace avait le même temps pour toutes épreuves de la famille AztecDiamond etc pour chaque famille avec le temps de la dernière épreuve de chaque famille.
J'ai fini par faire un .map au lieu de mon .forEach, et mieux structurer et y inclure mon assignation de time afin qu'il contiennet bien les infos de cette épreuve et non qu'elle se fasse écraser a la fin puis être assigné.


Visualisation proposé : 
Je suis parti sur le principe que l'on veut voir le score de tout les algorithme sur une famille précise, c'est a dire que l'on voit toutes les sous-épreuves qui sont de plus en plus difficile et l'on peut comparer le temps que met l'algo a réussir toutes les sous-épreuves mais aussi en voir une particulière sur toutes. J'ai donc compartimenté par famille et mit en rouge celle qui sont TIME Out c'est a dire qui n'ont pas réussi dans les temps.