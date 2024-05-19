export const textOc = `Contexte
Alisa’s Closet est un détaillant de vêtements français depuis plus de 10 ans. Grâce
à une application en ligne, les acheteurs peuvent se faire livrer les articles achetés.
Aujourd’hui la demande de livraison est de plus en plus forte, et il existe certaines
incohérences dans le système de livraison des vêtements. Le fonctionnement
actuel est qu’il existe un centre de livraison duquel partent l’intégralité des colis à
expédier chez l’acheteur en ligne.
Spécifications
Objectifs
Par souci économique et environnemental, l’entreprise souhaite optimiser son
système de livraison des colis en incluant une nouvelle application Web nommée
DeliveryFit. L’application devrait s’interfacer avec le site de vente en ligne existant
de manière transparente, et effectuer un certain nombre d'actions avant la
validation de paiement de l’acheteur en ligne.
L’appli aura notamment pour objectif de déterminer, pour une adresse de
livraison donnée, le site d’envoi le plus proche de l’adresse – le centre de livraison
ou un magasin ayant l’article stocké – et d’organiser la livraison en fonction de
proximité (depuis le centre de livraison s’il est plus proche de l’adresse ; depuis le
magasin s’il est plus proche de l’adresse).
Fonctionnement
Le rôle de cette application sera d’identifier le moment où l'acheteur en ligne
clique sur le bouton de validation du panier. À ce moment, DeliveryFit intervient
pour récupérer :
● l'adresse de livraison ;
● la liste des articles achetés par le client ;
● la liste de tous les magasins existants de l’enseigne.
Back End
Le Back End de DeliveryFit doit déterminer si un magasin de vente est plus
proche du domicile d’expédition que le centre de livraison. Si un magasin est plus
proche, il faut vérifier également que tous les articles achetés y sont bien
présents. Après avoir réalisé ce calcul, le Back End doit renvoyer le résultat au
Front End.
Front End
Le Front End de DeliveryFit apparaît à la validation du panier sur le site en ligne
original. Une page “Recherche du point d’expédition” s’affiche alors. Le Front End
attend alors la réponse du Back End pour connaître le(s) site(s) d'expédition de la
commande. Puis la page Web affiche une confirmation du panier avec le lieu
d’expédition, l’adresse de livraison, et la date d’expédition trouvés. Une fois que
l’acheteur valide son panier, DeliveryFit redirige l’acheteur vers l'application
initiale, de manière transparente.
Organisation
Ressources humaines
Pour réaliser le projet, vous avez à disposition une équipe de trois personnes à
temps plein. Parmi eux, deux développeurs confirmés (respectivement spécialisés
Front End et Back End) et un architecte logiciel ayant une grande expérience
dans le développement d'applications. L'architecte logiciel à également des
compétences en gestion de base de données. Les TJM (tarif journalier moyen) des
deux développeurs sont de 700 €, et celui de l’architecte de 800 €.
Organisation de projet
Pour ce qui est de l’organisation du projet, il est préférable de travailler en Agile
car l’ensemble de l’équipe est déjà habitué à travailler avec la méthodologie
Scrum. Le projet sera organisé sous forme de sprint et des livraisons du produit
devront être prévues au client (une ou deux selon la longueur du projet). Il sera
possible d’organiser une (ou plusieurs) démonstration(s) du produit au client pour
montrer l’avancement.
Budget Total
Pour la réalisation de cette application, un budget maximum a déjà été défini, et
ne doit pas être dépassé dans la proposition finale. L’enveloppe mise à disposition
pour l’intégralité du projet est de 10.000 €.
Dans ce budget, il faut prévoir plusieurs parties, à savoir :
● Estimation/découpage des tâches
● Développement des fonctionnalités (marge de sécurité à prévoir)
● Gestion de projet
● Corrections à prévoir`

export  const tasksList = `[
    {task : 'develop the backend of the app using spring boot'},
    {task : 'develop the frontend using angular'},
    {task : 'intercept the right url and redirect the user to DeliveryFit'},
    {task : 'transmit the delivery details : products, contact, delivery address'},
    {task : 'compare the distance between all the stores containing the products from the customer address'},
    {task : 'find the closest store or shipping facility from the customer house'},
    {task : 'design the shopping cart with the expedition details'},
    {task : 'implement the redirection from deliveryfit to the main website'},
    {task : 'send a notification to the store selected as the sender'},
]`

export  const tasksList2 = `[
{task : 'develop the backend of DeliveryFit using Spring Boot'},
{task : 'design and develop the frontend of DeliveryFit using Angular'},
{task : 'intercept the right URL and redirect the user to DeliveryFit from the main website'},
{task : 'transmit the delivery details: products, contact, delivery address from the main website to DeliveryFit'},
{task : 'compare the distance between all the stores containing the products from the customer's address using Google Maps API'},
{task : 'find the closest store or shipping facility from the customer's house using Google Maps API'},
{task : 'design and implement the shopping cart with expedition details on DeliveryFit'},
{task : 'implement the redirection from DeliveryFit to the main website after successful delivery'},
{task : 'send a notification to the selected store for shipment confirmation'}
]`