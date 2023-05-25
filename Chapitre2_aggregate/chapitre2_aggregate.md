## Introduction à l'agrégation 

Voici comment on peut faire une requête SQL qui compterait le nombre d'items dans la collection.

En SQL :

```sql
SELECT COUNT(*) FROM sales;
```

En MongoDB on utiliserait aggregate comme suit, group permet de regrouper selon un champ ou une clé. Si la clé vaut null alors on regroupe toute les lignes

```js
db.inventory.aggregate( [
  {
    $group: {
       _id: null,
       count: { $sum: 1 }
    }
  }
] )
// affichera
// vi ko co condition gi nen KQ count = 9 => length of array
[{ "_id" : null, "count" : 8 }]

db.inventory.aggregate( [
  {
    $group: {
       _id: "$borough",
       total: { $sum: 1 }
    }
  }
] )
// affichera 
// total: { $sum: 1 } => total des quartiers (nhung ten giong nhau tinh 1 lan)
[ { _id: null, total: 9 } ]



```

# Aggrégation

find permet d'extraire une liste de documents. Des traitements plus complexes pour grouper les données seront réalisés à l'aide du framework d'agrégation de MongoDB.

Opérations de pipeline d'agrégation. La méthode aggregate prend une liste d'opérateurs.

```js
// pipeline d'opération
db.collection.aggregate([
        { $match : { filtrage }}, // premier  filtrer  les données 
        { $project : { projection }},  // projection hérite de la première instruction
        // on regroupe les données en fonction d'un champ $field puis on exécute une fonction d'agrégation sur les données regroupées.
        { $group : { _id :  <$field>,  <field> : <function aggregation> }}, 
        { $sort : { <field> : - 1}}, 
])

Attention, à l'ordre des opérations vous devez faire la projection après le filtrage match.

On peut à titre d'exemple montrer que la méthode aggregate est pour certains opérateurs identiques à la méthode find :

```js
db.restaurants.aggregate([
    { $match : {
        "grades.grade" : "A"
    }},
    { $project : {
         "name" : 1, "_id" : 0
        }
    }
])

// avec find on aurait
db.restaurants.find( {  "grades.grade" : "A" } , {   "name" : 1, "_id" : 0 } )
```
Avec le framework d'agrégation de MongoDB vous pouvez faire autant de sous-requêtes que vous souhaitez, dans l'ordre que vous voulez modulo l'ordre match/project.

Voici un premier exemple utilisant les stages `$match` et `$project` sur la collection `restaurants` :

```js
db.restaurants.aggregate([
    // ====================
    // Stages d'aggregation
    // ====================

    // $match : Permet de filtrer (comme un .find classique)
    { $match: {
        cuisine: 'Italian'
    } },

    // $project : Permet de modifier les valeurs précédentes
    { $project: {
        _id: 0,
        cuisine: 1,
        enseigne: { $toUpper : '$name' }
    } },

    // Nouveau $match
    { $match: {
        enseigne: /^A/gi
    } }

]);

db.restaurants.aggregate([
    { $match: {
        cuisine: 'Italian'
    } },
    { $project: {
        _id: 0,
        cuisine: 1,
        enseigne: { $toUpper : '$name' }
    } },
    { $match: {
        enseigne: /^A/gi
    } }
]);
/*
[
  { cuisine: 'Italian', enseigne: 'ANGELO OF MULBERRY ST.' },
  { cuisine: 'Italian', enseigne: "ARTURO'S" },
  { cuisine: 'Italian', enseigne: "AUNT BELLA'S REST OF LITTLE NECK" },
  { cuisine: 'Italian', enseigne: "ARTURO'S" },
  { cuisine: 'Italian', enseigne: 'ARNO RISTORANTE' },
  { cuisine: 'Italian', enseigne: 'AREO RESTAURANT' },
  { cuisine: 'Italian', enseigne: 'ACAPPELLA RESTAURANT' },
  { cuisine: 'Italian', enseigne: 'ARTE RESTAURANT' },
  { cuisine: 'Italian', enseigne: "ANTHONY'S PLACE" },
  { cuisine: 'Italian', enseigne: 'ARTUSO PASTRY SHOP' },
  { cuisine: 'Italian', enseigne: 'ARTE CAFE' },
  { cuisine: 'Italian', enseigne: "ARTIE'S" },
  { cuisine: 'Italian', enseigne: 'AL-DENTE' },
  { cuisine: 'Italian', enseigne: "ALDO'S II PIZZA AND RESTAURANT" },
  { cuisine: 'Italian', enseigne: 'APPETITO RESTAURANT' },
  { cuisine: 'Italian', enseigne: 'AL DI LA' },
  { cuisine: 'Italian', enseigne: 'ANTICA TRATTORIA' },
  { cuisine: 'Italian', enseigne: 'ACQUA SANTA' },
  { cuisine: 'Italian', enseigne: 'ALBELLA RISTORANTE & BAR' },
  { cuisine: 'Italian', enseigne: 'ACQUISTA TRATTORIA' }
]
*/
// filtre les contenus ~ find
{ $match : {}}

// le second paramètre du find projection
{ $project : {}}

// group opérateur d'aggrégation
{ $group : {}}

// sort
{ $sort : {}}

```


- $match : Cette opération permet de filtrer les documents dans une collection en fonction de certains critères.

- $sort : Cette opération permet de trier les documents dans une collection en fonction de certains critères.

- $limit : Cette opération permet de limiter le nombre de documents renvoyés dans une requête.

- $skip : Cette opération permet de sauter un certain nombre de documents dans une requête.

- $project : Cette opération permet de sélectionner et de renommer les champs dans les documents d'une collection.

- $unwind : Cette opération permet de dérouler les tableaux imbriqués dans les documents d'une collection.

- $lookup : Cette opération permet de joindre les données de deux collections dans une seule requête.

```js
// Exemple de $group
// =================
// Groupe tous les restaurants par type de cuisine,
// et affiche le nombre de restaurants, le total de notes déposées, et la moyenne

db.restaurants.aggregate([
    { 
        $project: {
        cuisine: 1,
        grades: '$grades.score',
        nbGrades: { $size: '$grades' },
        gradesAvg: { $avg: '$grades.score' },
    }}
])
/*
[
  {
    _id: ObjectId("64468384b0441f70cbd3e2fb"),
    cuisine: 'Irish',
    grades: [ 2, 11, 12, 12 ],
    nbGrades: 4,
    gradesAvg: 9.25
  },
  {
    _id: ObjectId("64468384b0441f70cbd3e2fc"),
    cuisine: 'Jewish/Kosher',
    grades: [ 20, 13, 13, 25 ],
    nbGrades: 4,
    gradesAvg: 17.75
  },
  ...
]
*/

db.restaurants.aggregate([
    { 
        $project: {
        cuisine: 1,
        grades: '$grades.score',
        nbGrades: { $size: '$grades' },
        gradesAvg: { $avg: '$grades.score' },
    }},

     // Obtenir la moyennes des restaurants, classés par type de cuisine

    { 
        $group: {
        _id: '$cuisine',
        nbRestaurants: { $sum: 1 },
        nbNotes: { $sum: '$nbGrades'},
        avgNotation: { $avg: '$gradesAvg' },
    }},
       // On refait un $match pour ne conserver les types de cuisine les mieux notées
    
    { $match: {
        avgNotation: { $gte: 15 }
    }}
])

db.restaurants.aggregate([
    { 
        $project: {
        cuisine: 1,
        grades: '$grades.score',
        nbGrades: { $size: '$grades' },
        gradesAvg: { $avg: '$grades.score' },
    }},
    { 
        $group: {
        _id: '$cuisine',
        nbRestaurants: { $sum: 1 },
        nbNotes: { $sum: '$nbGrades'},
        avgNotation: { $avg: '$gradesAvg' },
    }},
    { $match: {
        avgNotation: { $gte: 15 }
    }}
])

/*[
  {
    _id: 'Chinese/Japanese',
    nbRestaurants: 59,
    nbNotes: 195,
    avgNotation: 15.143062397372741
  },
  {
    _id: 'Creole',
    nbRestaurants: 24,
    nbNotes: 93,
    avgNotation: 15.181845238095237
  },
  {
    _id: 'Iranian',
    nbRestaurants: 2,
    nbNotes: 8,
    avgNotation: 18.583333333333332
  }
]*/


```



### Groupement avec le stage `$group`

Nous allons donner un exemple de groupement simple, nous allons compter le nombre de restaurants qui font de la cuisine italienne par quartier. Notez bien que la clé désignant le quartier doit commencer par un dollar, en effet pour MongoDB c'est un paramètre variable :
```js
db.restaurants.aggregate([
    { $match : { "cuisine" : "Italian" }   },
    { $group : {"_id" : "$borough", "total" : {$sum : 1}}},
])
// chaque fois avoir restau cuisine italien dans quartier Queens=> total = total + 1
// => {$sum : 1} = le nombre de restaurants qui font de la cuisine italienne par quartier
/*
{ "_id" : "Queens", "total" : 131 }
{ "_id" : "Bronx", "total" : 52 }
{ "_id" : "Brooklyn", "total" : 192 }
{ "_id" : "Manhattan", "total" : 621 }
{ "_id" : "Staten Island", "total" : 73 }
*/

// on les regroupe tous
db.restaurants.aggregate([
    { $group : {"_id" : "$borough", "total" : {$sum : 1}}},
])
```

Nous pouvons également organiser la requête en JS de manière plus lisible.

```js
const match = {
    "cuisine" : "Italian"
};

const group = {
    "_id" : "$borough",
    "total" : { $sum : 1 }
};

db.restaurants.aggregate([
    {$match: match},
    {$group: group}
]);
```
## Compter le nombre d'éléments d'une collection

En SQL lorsqu'on veut compter le nombre de ligne dans une table sales par exemple on écrira :

```sql
SELECT COUNT(*) AS count FROM sales
```

Dans MongoDB vous utiliserez le code suivant :

```js
db.sales.aggregate([
    {
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    }
]);