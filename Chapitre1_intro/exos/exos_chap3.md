## 01 Exercices liste inventory

### 01. Affichez tous les articles de type journal. Et donnez la quantité total de ces articles (propriété qty). Pensez à faire un script en JS.

### 02. Affichez les noms de sociétés depuis 2018 avec leur quantité (sans agrégation)

### 03. Affichez les types des articles pour les sociétés dont le nom commence par A.

Vous utiliserez une expression régulière classique : /^A/

### 04. Affichez le nom des sociétés dont la quantité d'articles est supérieur à 45.

Utilisez les opérateurs supérieur ou inférieur :

```js
// supérieur >=
// {field: {$gte: value} }

// supérieur
// {field: {$gt: value} }

// inférieur <=
// {field: {$lte: value} }

// inférieur <
// {field: {$lt: value} }

```

### 05. Affichez le nom des sociétés dont la quantité d'article(s) est strictement supérieur à 45 et inférieur à 90.

### 06. Affichez le nom des sociétés dont le statut est A ou dont le type est journal.

### 07. Affichez le nom des sociétés dont le statut est A ou dont le type est journal et la quantité inférieur strictement à 100.

### 08. Affichez le type des articles qui ont un prix de 0.99 ou 1.99 et qui sont true pour la propriété sale ou ont une quantité strictement inférieur à 45.

### 09. Affichez le nom des sociétés et leur(s) tag(s) si et seulement si ces sociétés ont au moins un tag.

Vous pouvez utiliser l'opérateur d'existance de Mongo pour vérifier que la propriété existe, il permet de sélectionner ou non des documents :

```js
{ field: { $exists: <boolean> } }
```

### 10. Affichez le nom des sociétés qui ont au moins un tag blank.

-------------------------------

## 02 Exercice faire une augmentation de 50% & 150%

Utilisez la méthode updateMany qui mettra l'ensemble des documents à jour.

1. Augmentez de 50% la quantité de chaque document qui a un status C ou D.

2. Augmentez maintenant de 150% les documents ayant un status A ou B et au moins un tag blank.

------------------------------------------------

## 03 Exercice ajouter un champ et calculer

Dans cet exercice vous pouvez utiliser updateMany pour insérer un nouveau champ.

- 1. Ajoutez un champ **scores** de type **array** avec le score 19 pour les entreprises ayant une **qty** supérieure ou égale à 75.

- 2. Puis mettre à jour les entreprises ayant au moins une lettre a ou A dans leurs noms de société et ajouter leur un score 11 (champ scores).

- 3. Affichez les docs qui ont un score de 11

- 4. Ajoutez une clé **comment** pour les sociétés Alex et ajouter un commentaire : "Hello Alex". 

- 5. Affichez maintenant tous les docs qui n'ont pas la clé comment.

---------------------------------
## 04 Exercice suppression d'un champ

Supprimez la propriété level se trouvant dans un/les document(s). Vérifiez qu'il existe au moins un doc qui possède le champ ou la clé level à l'aide d'une requête avant cette action.

Vérifiez que le champ **level** n'existe plus après suppression.

## 05 Exercice switch

L'opérateur size permet de compter le nombre d'élément(s) dans un array. Il faut cependant pré-fixer la propriété avec un dollar :

```js
{ $size :  "$tags" }
```

Ajoutez la propriété **label** pour les documents ayant la propriété tags uniquement. Label prendra les valeurs suivantes selon le nombre de tags :

- si le nombre de tags est strictement supérieur à 1 : A
- si le nombre de tags est strictement supérieur à 3 : AA
- Et B sinon.


### 06 Exercice d'application

Insérez le document suivant dans la collection inventory :

```js

db.inventory.insertOne( {
   name : "Test sur les dates",
   creationts: ISODate("2020-06-27T08:41:57.114Z"),
   expiryts: ISODate("2020-08-27T08:41:57.114Z")
})
```

Pour récupérez le dernier document inséré tapez la ligne de commande suivante :

```js
db.inventory.find().sort({_id: -1}).limit(1);
```

Maintenant supprimez ce document en fonction de sa date d'expiration :

```js
db.inventory.deleteOne( { "expiryts" : { $lte: ISODate("2020-08-27T08:41:57.114Z") } } );
```

Vérifiez que ce document est bien supprimé de la collection.