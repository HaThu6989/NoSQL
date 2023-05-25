# 01 Sujet Exercice inventory CORRECTION

Reprenez la collection inventory. (Repondez sans utiliser aggregate)

1. Donnez le nombre d'entreprise(s) qui ont/a exactement 2 tags.

```js
 db.inventory.find({ tags: { $size: 2 } }, { _id: 0, tags: 1, society: 1 })
```
2. Apres avoir effectué la requete suivante:
   
```js

    // modifions deux sociétés pour qu'elle est le même nom
    db.inventory.updateMany(
        { society: "Alex" },
        {
         $set: { society: "AAlex" },
         $currentDate: { lastModified: true }
        }
    );
```

 Retouvez l'entreprise en utilisant une regex qui verifie que les deux premières lettres sont identiques

```js
 db.inven

```
 
3. Faites la somme des quantités par status .

4. Hydratation : créez les champs **created_at** et **expired_at** pour chaque document de la collection inventory.

Vous utiliserez la méthode **ISODate** pour créer une date aléatoire ainsi que l'objet Date de JS. Aidez-vous de l'exemple ci-dessous :

- Exemple

Décallage d'un jour par rapport à la date actuelle :

```js
// Pour un jour
// 1 x 24 hours x 60 minutes x 60 seconds x 1000 milliseconds
let day = 1*24*60*60*1000

// Ajoute un jour à la date actuel
new Date( ISODate().getTime() + day )
```

5. Ajoutez un champ qui calcule le nombre de jours qui reste avant la suppression du document.

Vous pouvez utiliser les opérateurs suivants :

```js
// Pour faire une différence entre les dates
$subtract

// Pour calculer le nombre de jour
$divide
```


ma requete foireuse
```js

let col = db.inventory.distinct('_id');

col.forEach(( id => {
    db.inventory.updateOne(
        {_id: id},
        {
            $set: {
                dateDifference: {
                    $divide: [
                        {
                            $subtract: ["$expired_at", new Date()]
                        },
                        86400000
                    ]
                }
            }
        } 
    )
}))
```
la requete de chatgpt

```js
db.inventory.updateMany({},
    [
       {
          $addFields: {
            dateDifference: {
                $divide: [
                   {
                      $subtract: ["$expired_at", new Date()]
                   },
                   86400000
                ]
             }
          }
       }
    ]
)
```
db.inventory.find({},{_id:0,society:1,created_at:1,expired_at:1,dateDifference:1})
