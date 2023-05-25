# Update Delete

## Partie 3 inventory

## Création d'une nouvelle base de données shop

Créez une base de données **shop** et insérez les données suivantes, utilisez la méthode insertMany qui est plus sémantique :

```js
use shop;

db.createCollection("inventory");

db.inventory.insertMany( [{
      "sale" : true, "price" : 0.99,
      "society" : "Alex", type: "postcard", qty: 19,
      size: { h: 11, w: 29, uom: "cm" },
      status: "A",
      tags: ["blank", "blank", "blank"], 
      "year" : 2019  
    },
   { 
       "sale" : false,
       "price" : 1.99,
       "society" : "Alan",
       type: "journal",
       qty: 25,
       size: { h: 14, w: 21, uom: "cm" },
       status: "A",
       tags: ["blank", "red", "blank", "blank"],
       "year" : 2019  
   },
    { 
       "sale" : true,
       "price" : 1.5,
       "society" : "Albert",
       type: "notebook",
       qty: 50,
       size: { h: 8.5, w: 11, uom: "in" },
       status: "A",  
       tags: ["gray"],
       year : 2019
   },
   { 
       "sale" : true, 
       "price" : 7.99, 
       "society" : "Alice", 
       type: "lux paper", 
       qty: 100, 
       size: { h: 8.5, w: 11, uom: "in" }, 
       status: "D", 
       year : 2020 
   },
    { 
       "sale" : true, 
       "price" : 2.99, 
       "society" : "Sophie", 
       type: "planner", 
       qty: 75, 
       size: { h: 22.85, w: 30, uom: "cm" }, 
       status: "D", 
       tags: ["gel", "blue"], 
       year : 2017 
   },
   {
       "sale" : false, 
       "price" : 0.99, 
       "society" : "Phil", 
       type: "postcard", 
       qty: 45, 
       size: { h: 10, w: 15.25, uom: "cm" }, 
       status: "A", 
       tags: ["gray"], 
       year : 2018 
   },
   { 
       "sale" : true, 
       "price" : 4.99, 
       "society" : "Nel", 
       type: "journal", 
       qty: 19, 
       size: { h: 10, w: 21, uom: "cm" }, 
       status: "B", 
       tags: ["blank", "blank", "blank", "red"], 
       "year" : 2019, 
       level : 100  
   },
   { 
       "sale" : true, 
       "price" : 4.99, 
       "society" : "Alex", 
       type: "journal", 
       qty: 15, 
       size: { h: 17, w: 20, uom: "cm" }, 
       status: "C", 
       tags: ["blank"], 
       "year" : 2019  
   },
   { 
       "sale" : false, 
       "price" : 5.99, 
       "society" : "Tony", 
       type: "journal", 
       qty: 100, 
       size: { h: 14, w: 21, uom: "cm" }, 
       status: "B", 
       tags: ["blank","blank", "blank", "red"], 
       "year" : 2020  
   },
]);

```

## Modification du curseurs

```js
// Retourne la collection à partir du 6 documents
db.students.find().skip( 5 )
// Limite le nombre de documents
db.students.find().limit( 5 )
```

Les méthodes combinées suivantes modifiants le curseur sont équivalentes (même résultat) :

```js
db.students.find().sort( { name: 1 } ).limit( 5 )
db.students.find().limit( 5 ).sort( { name: 1 } )
```

## Suppression un document ou d'une collection

Repartons de la collection inventory, la méthode deleteOne permet de modifier un document selon un critère de recherche.

## db.collection.deleteOne

La méthode suivante permet de supprimer un document à l'aide d'une condition :

```js
 db.orders.deleteOne( { "_id" : ObjectId("563237a41a4d68582c2509da") } );
```
## db.collection.deleteMany

Cette méthode permet de supprimer plusieurs documents à l'aide d'un critère de sélection.

Remarque : pour supprimer l'ensemble des documents dans une collection utilisez la syntaxe suivante.

```js
db.inventory.deleteMany({})
```
Notez que vous pouvez également supprimer des documents en spécifiant une restriction. Par exemple ci-dessous on souhaite supprimer toutes les entreprises dont la quantité est supérieur ou égale à 100 :

```js
db.inventory.deleteMany({ qty : { $gte : 100 }});
```

Pour supprimer la collection elle-même, utilisez la méthode drop :

```js
db.inventory.drop()
```

## updateOne modification

- Exemple de modification avec la méthode updateOne

Structure :

- critère de recherche

- Modification avec l'opérateur set

Dans l'exemple suivant on modifie le premier document trouvé dont le status vaut B :

```js
db.inventory.updateOne(
   { status: "B" },
   {
     $set: { "size.uom": "cm", status: "X" },
     $currentDate: { lastModified: true }
   }
)
```

*Remarque : Si il y a plusieurs documents qui correspondent au critère de recherche, seulement le premier document dans l'ordre naturel ou l'ordre des mises jours, sera modifié.*

Si MongoDB ne trouve pas le document, vous pouvez ajouter la propriété **upsert** qui permet de créer une ligne supplémentaire dans le document, sans cette option aucune ligne ne sera créée.

```js
db.inventory.updateOne(
   { status: "XXX" },
   {
     $set: { "size.uom": "cm", status: "SUPER" },
     $currentDate: { lastModified: true }
   },
    {"upsert": true}
)

// ici on aura un nouveau document
 // { "_id" : ObjectId("5ef43c659c3a4c119caf7ef5"), "status" : "SUPER" }
```

Vous pouvez également mettre à jour plusieurs documents en même temps à l'aide de la méthode suivante :

collection.updateMany()

## Ajouter des valeurs à un champ de type array

Pour ajouter une valeur seulement, si elle n'existe pas dans le array du champ en question, on utilise l'opérateur **addToSet** suivant :


```js
// On utilise $addToSet
db.inventory.updateOne(
   { society: "Phil" },
   { $addToSet: { tags: "gray" } } // ["gray", "blue" ] // n'ajoute pas gray si celui existe déjà dans ce tableau
);
```
Pour ajouter une valeur, même si elle existe quand même, on utilise l'opérateur **push** de Mongo :

```js
// On utilise $push 
db.inventory.updateOne(
   { society: "Phil" },
   { $push: { tags: "blue" } } // ["gray", "blue", "bleu" ] ajoute la valeur même si elle existe
);
```

Vous avez également les opérateurs suivants : **mul** et **inc** qui vous permettent de multiplier, de diviser et d'ajouter ou retirer des valeurs à un champ numérique :

```js
// une augmentation de 50  qty*0.5 + qty = qty( 0.5 + 1) = qty * 1.5
db.inventory.updateMany({ society: "Alan" }, { $mul: { qty: 1.5 } }) 
// ici on ajoute 5 à qty pour la/les société(s) Alan
db.inventory.updateMany({ society: "Alan" }, { $inc: { qty: 5 } }) 
```

La division se fait grâce à l'opérateur **mul** aussi.
Pour diviser par une valeur, il suffit de multiplier par 1/valeur.
Exemple pour diviser par 4 par 2 : 4 * 1/2. 


## Méthode unset

Vous pouvez également supprimer un champ ou clé d'un document à l'aide de l'opérateur **unset**, ci-dessous on supprime les champs qty et status du premier document qui match avec la recherche :

```js
   db.inventory.updateOne(
      { status: "A" },
      { $unset: { qty: "", status: "" } }, // supprime les champs entre les accolades
      {"upsert": false} // prendre garde à ne pas ajouter un document par défaut ce champ est à false
   )
```
## Opérateur switch

L'opérateur `$switch` est un opérateur **d'aggregation** permettant de modifier un document selon une liste de cas.

> _(Nous aborderons plus tard en détail le principe de l'aggregation, pour l'instant admettez simplement les éléments qui vont suivre)_

Pour l'exemple, nous allons tenter de modifier le champs `type` de la collection `inventory`. Récupérez d'abord tous les types distincts :

```js
db.inventory.distinct('type');

// [ 'journal', 'lux paper', 'notebook', 'planner', 'postcard' ]
```

On souhaiterait mettre à jour tous les `type` des documents en les traduisant :

```
'journal'   -> 'Actualité'
'lux paper' -> 'Papier LUX'
'notebook'  -> 'Carnet de texte'
'planner'   -> 'Calendrier'
'postcard'  -> 'Carte postale'
```

La syntaxe du `$switch` ressemblerait à ceci :
```js
$switch: {
   branches: [
      // En fonction de la valeur du champs '$type', on génère une nouvelle valeur
      { case: { $eq: ['$type', 'journal'] }, then: 'Actualité' },
      { case: { $eq: ['$type', 'lux paper'] }, then: 'Papier LUX' },
      { case: { $eq: ['$type', 'notebook'] }, then: 'Carnet de texte' },
      { case: { $eq: ['$type', 'planner'] }, then: 'Calendrier' },
      { case: { $eq: ['$type', 'postcard'] }, then: 'Carte postale' },
   ],
   default: 'Pas de type'
}
```
https://www.mongodb.com/docs/manual/reference/operator/aggregation/switch/

Lorsque vous utilisez `$switch`, faites attention à l'ordre dans lequel vous allez écrire vos case. Si un case match avec la condition alors le `$switch` va automatiquement « break » et retourner une valeur.

Afin d'implémenter le `$switch` avec la méthode `updateMany`, on ferait ceci :

```js
db.inventory.updateMany(
  // 1. Requête
  { type: { $exists: true } },
  
  // 2. Tableau -> Pipeline d'aggregation
  [
    {
      // Opérateurs d'aggregation ($set, $match, …)
      $set: {
        // Le champs que l'on va modifier est le champs 'type'
        type: {
          // Début du $switch
          $switch: {
            branches: [
              // En fonction de la valeur du champs '$type', on génère une nouvelle valeur
              { case: { $eq: ["$type", "journal"] }, then: "Actualité" },
              { case: { $eq: ["$type", "lux paper"] }, then: "Papier LUX" },
              { case: { $eq: ["$type", "notebook"] }, then: "Carnet de texte" },
              { case: { $eq: ["$type", "planner"] }, then: "Calendrier" },
              { case: { $eq: ["$type", "postcard"] }, then: "Carte postale" },
            ],
            default: "Pas de type",
          },
        },
      },
    },
  ]
);
```

Notez que la syntaxe d'un `case` prend une **expression** comme valeur. Cette expression doit impérativement contenir un/des opérateur(s) d'aggrégation (comme `$eq` dans l'exemple ci-dessus):
https://www.mongodb.com/docs/manual/reference/operator/aggregation/

``` js
SELECT COUNT(*) FROM sales;

db.inventory.aggregate( [
  {
    $group: {
       _id: null,
       count: { $sum: 1 }
    }
  }
] )
// affichera
{ "_id" : null, "count" : 8 }
```