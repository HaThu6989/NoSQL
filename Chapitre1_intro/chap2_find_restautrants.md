# CRUD create/read/update/delete avec MongoDB avec la base de données ny

## Création d'une base de données

Pour créer une nouvelle base de données nommée `school`, tapez la ligne de commande suivante :

```bash
mongosh

> use school
```

> Si vous avez installé Studio 3T ou MongoDB Compass, vous pouvez également créer la base de données à l'aide de cet outil.

## Insertion de données

Créez la collection `authors` dans la base de données `school`

```js
db.createCollection("authors");
```

Insérer plusieurs données en même avec la méthode `insertMany()` :

```js
// La méthode prend un tableau en argument
db.authors.insertMany([
  {
    name: "Alan",
    grade: "master 5",
    notes: [11, 20, 18, 19],
    status: "A++",
  },
  {
    name: "Alice",
    grade: "master 4",
    notes: [11, 17, 19, 13],
    status: "A+",
  },
]);
```

Remarques : si on ne précise pas de propriété `_id` dans le document, elle sera automatiquement créée. Celle-ci est de type `ObjectId` (voir ci-après pour sa définition précise).

Les méthodes **insertMany** et **insertOne** permettent respectivement d'insérer plusieurs documents en même temps, ou un seul document.

Création d'un seul document avec `insertOne()`, et un `ObjectId` personnalisé :

```js
db.authors.insertOne({
  _id: ObjectId("5063114bd386d8fadbd6b004"),
  name: "Naoudi",
  grade: "master 5",
});
```

Vous pouvez créer votre propre `_id` avec une valeur de type scalaire (non mutable).

#### Précisions sur l'objet ObjectId

Il est codé sur 12 bytes :

- 4 bytes représentant le timestamp courant (nombre de secondes depuis epoch, naissance d'UNIX).
- 3 bytes pour idenfitication de la machine.
- 2 bytes pour représenter l’identifiant du processus.
- 3 bytes qui représentent un compteur qui démarre à un numéro aléatoire.

Tapez les lignes de code suivantes :

```js
const _id = ObjectId();
console.log(_id);
// ObjectId("5eef0c14591a8edc333898dd")

console.log(_id.getTimestamp());
// ISODate("2022-04-18T11:12:22.000Z")
```

## Méthode `find` : lecture des données

### Installez les données restaurants

Dans ce premier chapitre, vous allez travailler avec un jeu de données (fournies dans le dossier `/data` du chapitre d'installation) correspondant à une liste de restaurants de la ville de New York.

La commande `mongoimport` s'exécute dans votre terminal. Attention, elle ne doit pas être lancée dans la console `mongosh`.
Elle peut prendre plusieurs options :

- `--db` pour donner un nom à votre base de données.
- `--collection` indique le nom de votre collection
- `--file` indique le nom du fichier à intégrer dans la base de données
- `--drop` supprimera au préalable les collections existantes.

#### 1.a. Procédure avec Docker :

À l'intérieur du conteneur, il faut donc importer dans MongoDB ces données et créer la base de données `ny` et la collection `restaurants` :

```bash
# Connectez-vous au conteneur 
docker exec -it docker_mongo bash

# Déplacez vous dans le dossier contenant les données
cd data/db

# (Ces données sont partagées de votre machine hôte vers 
#  le conteneur Docker, grâce au volume déclaré dans
#  le fichier stack.yml)

# Importez les données JSON dans une base MongoDB 'ny'
mongoimport --db ny \
            --collection restaurants \
            --authenticationDatabase admin \
            --username root \
            --password example \
            --drop \
            --file ./restaurants.json
```


#### 1.b. Procédure pour une installation manuelle :

Vous devez importer les données depuis un terminal ouvert à l'emplacement de l'intérieur du dossier `/data` du chapitre d'installation.

Puis, importez les données de `restaurants.json` :

```bash
# Importez les données JSON dans une base MongoDB 'ny'
mongoimport --db ny --collection restaurants --drop --file restaurants.json
```


#### 2. Vérification

Pour vérifier que vous avez vos données, connectez-vous à votre serveur, logguez-vous à la base de données `ny`, et vérifiez que vous avez bien importé les documents :

```bash
mongosh

test> use ny

ny> db.restaurants.countDocuments()
# 25359
```

(À noter que ces données sont aussi [en libre accès](https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json) sur le site officiel de MongoDB)

Si vous souhaitez à l'inverse faire une sauvegarde d'une collection au format BJSON, il faudra taper la ligne de commande suivante : la sauvegarde se fera dans un dossier `dump`, dans le dossier où votre terminal a été ouvert.


```bash
mongodump --collection restaurants --db ny
```

---
### Find pour rechercher des documents

L'instruction suivante correspond à un `SELECT * FROM restaurants` en SQL :

```js
db.restaurants.find({});
```

En SQL on peut faire des sélections précises à l'aide d'une restriction partie WHERE :

```sql
SELECT *
FROM restaurants
WHERE cuisine = "Delicatessen";
```

En MongoDB cela donnerait :

```js
db.restaurants.find({ cuisine: "Delicatessen" });
```

Plus généralement la structure de la méthode find ressemble à :

```js
db.collection.findOne(restriction, projection);
```

Par exemple on sélectionne les restaurants qui font de la cuisine Delicatessen en affichant que les champs : cuisine et address :

```js
db.restaurants
  .find({ cuisine: "Delicatessen" }, { _id: 0, cuisine: 1, address: 1 });
```

### Opérateur IN

Vous pouvez également utiliser les query operators comme dans l'exemple suivant, ici on cherche à sélectionner les types de cuisines Delicatessen ou American dans la collection restaurants

```js
db.restaurants.find({ cuisine: { $in: ["Delicatessen", "American"] } });
```

Cet opérateur est similaire à l'opérateur IN de SQL.

### Opérateurs AND et OR

- On peut également utiliser un opérateur logique ET comme suit :

```js
db.restaurants.find({ borough: "Brooklyn", cuisine: "Hamburgers" });

// De manière équivalente
db.restaurants.find({
  $and: [{ borough: "Brookyn" }, { cuisine: "Hamburgers" }],
});
```

- Syntaxe de l'opérateur or :

```js
// { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }

// Exemple sur la table authors
db.authors.find({ $or: [{ name: "Alan" }, { name: "Alice" }] });
```

### Notion sur les Regex

Regex signifie en réalité Regular Expressions. Mais c'est un mot issu d'une fusion d'autres mots dont Regular Expressions en fait parti.

Les expressions rationnelles (regex) sont issues de la théorie des mathématiques et spécialementdes des langages formels définies dans les années 1940. Le regex ont la capacité à décrire **avec concision** des ensembles réguliers ou pattern.

Le standard POSIX a permi de normaliser la syntaxe et fonctionnalités des différents éditeurs de Regex.

Vous trouverez une librairie PCRE (Perl Compatible Regex) implémentée dans de nombreux langages comme dans Mongo et JS par exemple.

Pour utiliser une Regex complexe avec Mongo il faudra utiliser la syntaxe suivante :

```js
{ <field>: { $regex: /pattern/, $options: '<options>' } }
```

MongoDB utilise Perl compatible regular expressions (i.e. "PCRE" ) version 8.42 en 2021 avec le support UTF-8.

## 01 Exercice analyser une requête

Analysez la requête suivante sans l'exécuter dans MongoDB. Et expliquez ce qu'elle récupère.

Voici un exemple de condition logique en utilisant OR et AND. Remarquez le deuxième argument de la méthode find, il permet de faire une projection, c'est-à-dire de sélectionner uniquement certaine(s) propriété(s) du document :

```js
db.restaurants.find(
  {
    borough: "Brooklyn",
    $or: [{ name: /^B/ }, { name: /^W/ }],
  },
  { name: 1, borough: 1 }
);
```

Cela correspondrait (...) en SQL à la requête suivante :

```sql
SELECT
`name`, borough
FROM restaurants
WHERE borough = "Brooklyn"
AND ( `name` LIKE '/^B/' OR `name` LIKE '/^W/')
```

### Présentation des opérateurs MongoDB pour le filtrage des données

Exemple de filtres classiques :

```js
// plus grand que
$gt, $gte;

// Plus petit que
$lt, $lte;

// collection inventory  quantité < 20
db.inventory.find({ quantity: { $lt: 20 } });
```

D'autres filtres :

```js
// différent de
$ne
"number" : {"$ne" : 10}

// fait partie de ...
$in, $nin
"notes" : {"$in" : [10, 12, 15, 18] }
"notes" : {"$nin" : [10, 12, 15, 18] }

// Ou
$or
"$or" : [
  { "notes" : { "$gt" : 10 } },
  { "notes" : { "$lt" : 5  } }
]
// and
$and
"$and" : [
  { "notes" : { "$gt" : 10 } },
  { "notes" : { "$lt" : 5  } }
]

// négation
$not
"notes" : {"$not" : {"$lt" : 10} }

// existe
$exists
"notes" : {"$exists" : true}

// tous les documents qui possède(nt) la propriété level
db.inventory.find( { level : { $exists: true } } )

// tous les documents qui ne possède(nt) pas la propriété level
db.inventory.find( { level : { $exists: false } } )

// test sur la taille d'une liste
$size
"notes" : {"$size" : 4}

// element match

/*
{
    "content" : [
        { "name" : <string>, year: <number>, by: <string> }
        ...
    ]
}
*/

{ "content": { $elemMatch: { "name": "Turing Award", "year": { $gt: 1980 } } } }

// recherche avec une Regex simple
$regex
{ "name": /^A/  }

```
## Note de cours sur la notion de cursor

La méthode find permet de lire les documents dans une collection, par défaut elle ne retournera que 20 documents au maximum (sinon limite de 16Mo).

```js
db.restaurants.find();
```

Dans le terminal vous pouvez utiliser la commande it pour avancer dans la lecture du document.

- Utilisation d'un curseur pour lire le document :

```js
const resCursor1 = db.restaurants.find();

while (resCursor1.hasNext()) {
  print(tojson(resCursor1.next()));
}

// n'affichera rien car il n'y a plus rien dans la pile elle a été vidé dans la première boucle
while (resCursor1.hasNext()) {
  print(tojson(resCursor1.next()));
}
```
Attention pour utiliser la methode tojson() il faut taper :
`snippet install mongocompat` dans le terminal mongo sinon 
->ReferenceError: tojson is not defined 

Avec la méthode **forEach** :

```js
const resCursor2 = db.restaurants.find();

resCursor2.forEach(printjson);
```

Vous pouvez également récupérez l'ensemble des documents dans un array :

```js
const resCursor3 = db.restaurants.find();
const resArray = resCursor3.toArray();
print(resArray[3].name);
```
