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