## 01 Exercices liste

### 01. Combien y a t il de restaurants qui font de la cuisine italienne et qui ont eu au moins une fois un score de 10 ?

*Affichez également le nom, les scores et les coordonnées GPS de ces restaurants. Ordonnez les résultats par ordre décroissant sur les noms des restaurants.*

**Remarque** pour la dernière partie de la question utilisez la méthode sort :

```js
db.collection.find(query, restriction).sort({ key: 1 }); // 1 pour ordre croissant et -1 pour décroissant
```

### 02 03. Quels sont les restaurants qui ont eu un grade A et un score supérieur ou égal à 20 ? Affichez uniquement les noms et ordonnez les par ordre décroissant. Affichez le nombre de résultat.

Remarque pour la dernière partie de la question utilisez la méthode count :

```js
db.collection.findOne(query, restriction).count();
```

### 04. A l'aide de la méthode distinct trouvez tous les quartiers distincts de NY.

```js
db.restaurants.distinct("borough");
```

### 05. Trouvez tous les types de restaurants dans le quartiers du Bronx. Vous pouvez là encore utiliser distinct et un deuxième paramètre pour préciser sur quel ensemble vous voulez appliquer cette close :

```js
db.restaurants.distinct("field", { key: "value" });
```

### 06 Trouvez tous les restaurants dans le quartier du Bronx qui ont eu 4 grades.

### 07. Sélectionnez les restaurants dont le grade est A ou B dans le Bronx.

### 08. Même question mais, on aimerait récupérer les restaurants qui ont eu à la dernière inspection (elle apparaît théoriquement en premier dans la liste des grades) un A ou B. Vous pouvez utilisez la notion d'indice sur la clé grade :

```js
"grades.2.grade";
```

### 09. Sélectionnez maintenant tous les restaurants qui ont le mot "Coffee" ou "coffee" dans la propriété name du document. Puis, même question mais uniquement dans le quartier du Bronx.

Comptez également leurs nombres total et calculez la différences avec Coffee et coffee. Utilisez une Regex :

```js
/[aA]lan/
```

### 10. Trouvez tous les restaurants avec les mots Coffee ou Restaurant et qui ne contiennent pas le mot Starbucks. Puis, même question mais uniquement dans le quartier du Bronx.

### 11. Trouvez tous les restaurants qui ont dans leur nom le mot clé coffee, qui sont dans le bronx ou dans Brooklyn, qui ont eu exactement 4 appréciations (grades).

### 12. Reprenez la question 11 et affichez tous les noms de ces restaurants en majuscule avec leur dernière date et permière date d'évaluation.


### Exercices supplémentaires 

1. Affichez la liste des restaurants dont le nom commence et se termine par une voyelle.

2. Affichez la liste des restaurants dont le nom commence et se termine par une même lettre.

Remarque vous pouvez soit programmer cet affichage, soit directement utiliser une regex. Dans ce cas lisez les indications suivantes :

```js
() // les parenthèses captures une chaîne de caractère(s)
\1 // permet de récupérer la première chaîne de caractère(s) capturée(s)
\2 // permet de récupérer la deuxième chaîne de caractère(s) capturée(s)
```


## Recherche de restaurants à proximité d'un lieu

MongoDB permet de gérér des points GPS. Dans la collection restaurants nous avons un champ address.coord qui correspond à des coordonnées GPS (longitude & latitude).

Nous allons utiliser les coordonnées sphériques de MongoDB. Pour l'implémenter dans la collection vous devez créer un index particulier sur le champ coord :

```js
db.restaurants.createIndex({ "address.coord": "2dsphere" });
```

### 04 Exercice GPS

Après avoir créer l'index 2dsphere ci-dessus, trouvez tous les restaurants qui sont à 5 miles autour du point GPS suivant, donnez leurs noms, leur quartier ainsi que les coordonnées GPS en console, aidez-vous des indications ci-après :

```js
const coordinate = [-73.961704, 40.662942];
```

Indications : vous utiliserez la syntaxe suivante avec les opérateurs MongoDB :

```js
// opérateur
{ $nearSphere: { $geometry: { type: "Point", coordinates: coordinate }, $maxDistance: VOTRE_DISTANCE_EN_METRE } }
```

## Exercice Recherche par rapport à la date (répondre sans coder)

Sans exécutez la requête suivante, qu'affiche-t-elle ?

```js
db.restaurants.find(
  {
    "grades.0.date": ISODate("2013-12-30T00:00:00Z"),
  },
  { _id: 0, name: 1, borough: 1, "grades.date": 1 }
);
```