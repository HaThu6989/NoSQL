
/**
 * 01 Exercices liste inventory
*/
db.inventory.find({})
db.inventory.find({}).forEach(printjson)

/** 
 *  01. Affichez tous les articles de type journal. 
 * Et donnez la quantité total de ces articles (propriété qty). 
 * Pensez à faire un script en JS.
*/
const result = db.inventory.find({"type": "journal"}).toArray().map(elm =>elm.qty).reduce((acc,currValue) => acc + currValue, 0)
console.log(result);//159

//Formateur
let totalQty = 0;
db.inventory.find(
    { type: "journal" },
    { _id: 0, society: 1, qty: 1 }
).forEach(doc => {
    totalQty += doc.qty;
    console.log(doc.society);
});
console.log(totalQty);


//vDylan
const inventory = db.inventory;
const journals = inventory.find({ type: "journal" });
print("Articles de type journal :");
journals.forEach(printjson);
const totalQty2 = journals.toArray()
    .map(journal => journal.qty)
    .reduce((acc, qty) => acc + qty, 0);
print(`Quantité totale d'articles de type journal : ${totalQty}`);

//vCecile
db.inventory.find(
    { year: { $gte: 2018 } },
    { _id: 0, society: 1, qty: 1 }
);

let articles = db.inventory.find({ type: "journal" });
let totalQty3 = db.inventory.aggregate([
    { $match: { type: "journal" } },
    { $group: { _id: null, total: { $sum: "$qty" } } }
]).toArray()[0].total;

print("Articles de type journal : ");
while (articles.hasNext()) {
    printjson(articles.next());
}
print("Quantité totale : " + totalQty3);

/**  
 * 02. Affichez les noms de sociétés depuis 2018 avec leur quantité (sans agrégation)
*/
db.inventory.find({year: {$gte: 2018}}, {year: 1, qty: 1, _id: 0})

/**  
 * 03. Affichez les types des articles pour les sociétés dont le nom commence par A.
Vous utiliserez une expression régulière classique : /^A/
*/
db.inventory.find({"society": /^A/}, { _id: 0, type: 1, society: 1 })

db.inventory.find(
  { society: /^A/ },
  { _id: 0, type: 1, society: 1 }
).forEach(doc => {
  const { society, type } = doc;
  console.log(`Society ${society} type: ${type}`)
});


/**  
 * 04. Affichez le nom des sociétés dont la quantité d'articles est supérieur à 45.
Utilisez les opérateurs supérieur ou inférieur :
*/

// supérieur >=
// {field: {$gte: value} }

// supérieur
// {field: {$gt: value} }

// inférieur <=
// {field: {$lte: value} }

// inférieur <
// {field: {$lt: value} }

db.inventory.find({qty: {$gte: 45}}, {society: 1, qty: 1, _id: 0}).sort({qty : 1})

//Formateur
db.inventory.find(
  { qty: { $gt: 45 } },
  { _id: 0, society: 1, qty: 1 }
).sort({ qty: 1 }).forEach(doc => {
  const { qty, society } = doc;
  console.log(`Society ${society} quantity: ${qty}`)
});

/**  
 * 05. Affichez le nom des sociétés dont la quantité d'article(s) est strictement supérieur à 45 et inférieur à 90.
*/
// db.inventory.find({$and : [{qty: {$gt: 45}}, {qty: {$lt: 90}}]}, {society : 1, qty: 1, _id: 0}).sort({ qty: 1 })
db.inventory.find({
  $and : [
    {qty: {$gt: 45}}, 
    {qty: {$lt: 90}}
  ]},{society : 1, qty: 1, _id: 0}).sort({ qty: 1 })


/**  
 * 06. Affichez le nom des sociétés dont le statut est A ou dont le type est journal.
*/
db.inventory.find({
  $or : [{status: "A"}, {type: "journal"}]}).sort({ society: 1 })

//Formateur
db.inventory.find(
  {
    $or: [
        { status: "A" },
        { type: "journal" }
    ]
  },
  { _id: 0 }
).sort({ society : 1 }).forEach( invent => {
    console.log(invent.society, invent.qty);
});

/**  
 * 07. Affichez le nom des sociétés dont le statut est A 
 * OU dont le type est journal et la quantité inférieur strictement à 100.
*/
db.inventory.find({
  $and : [{qty: {$lt: 100}}, {$or: [{status: "A"}, {type: "journal"}]}]
}).sort({ society : 1 }).forEach( invent => {
  console.log(invent.society, invent.qty);
})




/**  
 * 08. Affichez le type des articles qui ont un prix de 0.99 ou 1.99 
 * et qui sont true pour la propriété sale 
 * OU ont une quantité strictement inférieur à 45.
*/
db.inventory.find(
    { $and : [
      {$or : [{"price" : 0.99}, {"price" : 1.99}]},
      {$or : [{"sale" : true},{qty : {$lte : 45}}]}
    ]}, 
  {price: 1, society: 1, qty: 1, _id: 0}).sort({ society: 1 }).forEach(invent => {
    const { society, price, qty } = invent;
    console.log(`Society : ${society} price :${price}, quantity : ${qty}`);
});


/**  
 * 09. Affichez le nom des sociétés et leur(s) tag(s) si et seulement si ces sociétés ont au moins un tag.
 * Vous pouvez utiliser l'opérateur d'existance de Mongo pour vérifier que la propriété existe, il permet de sélectionner ou non des documents :
 * { field: { $exists: <boolean> } }
*/
db.inventory.find({tags: {$exists: true}}, {"society": 1, tags: 1, _id: 0})

//Formateur
db.inventory.find({ tags: { $exists: true } }).sort({ society: 1 }).forEach(invent => {
  const { tags, society } = invent;

  console.log(`Society : ${society} tags :${tags.join(" ")}`);
});


/**  10. Affichez le nom des sociétés qui ont au moins un tag blank.*/
db.inventory.find({ tags: { $in: [ "blank" ] } },{"society": 1, tags: 1, _id: 0} )
db.inventory.find({ tags: "blank" },{"society": 1, tags: 1, _id: 0} )

//Formateur
db.inventory.find({ tags: "blank" }).sort({ society: 1 }).forEach(invent => {
  const { tags, society } = invent;

  console.log(`Society : ${society} tags :${tags.join(" ")}`);
});


/**
 * 02 Exercice faire une augmentation de 50% & 150%
 * Utilisez la méthode updateMany qui mettra l'ensemble des documents à jour.
 * 1. Augmentez de 50% la quantité de chaque document qui a un status C ou D.
 * 2. Augmentez maintenant de 150% les documents ayant un status A ou B et au moins un tag blank.
 */
// 1
db.inventory.updateMany(
  {$or : [{status : "C"}, {status : "D"}]},
  {$mul : {qty: 1.5}}
  ).forEach(printjson)

db.inventory.updateMany(
  {status: { $in: ['C', 'D'] }},
  { $mul: { qty: 1.5 } })

// 2
db.inventory.updateMany(
  {$and : [
    {$or : [{status : "A"}, {status : "B"}]},
    {tags : "blank"}
  ]},
  {$mul : {qty: 2.5}}
  ).forEach(printjson)

db.inventory.updateMany(
  {
      status: { $in: ['A', 'B'] },
      tags: 'blank'
  },
  {
      $mul: { qty: 2.5 }
  }
)
/**
 * 03 Exercice ajouter un champ et calculer
 * Dans cet exercice vous pouvez utiliser updateMany pour insérer un nouveau champ.
 * 1. Ajoutez un champ **scores** de type **array** 
 *    avec le score 19 pour les entreprises ayant une **qty** supérieure ou égale à 75.
 * 2. Puis mettre à jour les entreprises ayant au moins une lettre a 
 *    ou A dans leurs noms de société et ajouter leur un score 11 (champ scores).
 * 3. Affichez les docs qui ont un score de 11
 * 4. Ajoutez une clé **comment** pour les sociétés Alex et ajouter un commentaire : "Hello Alex". 
 * 5. Affichez maintenant tous les docs qui n'ont pas la clé comment.
 */

// 1
// Solution 1
// db.inventory.updateMany(
//   {qty : {$gte : 75}},
//   {$push: {"scores" : [19]}}
// )
// KQ : scores: [ [ 19 ] ] Phai dung solution 2

// Solution 2
// upsert:false =  s'il trouve pas les conditions dans la requete il fait pas un insert/update
// utilisé push à la place de addtoset
// set c'est pour créer le set, créer le table s'il n'exist pas! 
// addtoset, c'est just ajout dans un set existant
db.inventory.updateMany(
  { qty: { $gte: 75 } },
  { $set: { "scores": [19] } },
  { "upsert": false }
);

// 2 3
db.inventory.updateMany(
  { society: /[aA]/ },
  { $push: {scores: 11}}
)

// 3
db.inventory.find({ scores: { $in: [11] } }, { _id: 0, scores: 1, society: 1 });

// 4
// db.inventory.updateMany(
//   {"society" : "Alex"},
//   {$push: {comment : "Hello Alex"}}
// )

db.inventory.updateMany(
  { society: "Alex" },
  { $set: { "comment": "Hello Alex" } },
  { "upsert": false }
);

//5
db.inventory.find(
  {comment : {$exists : false}}
).forEach(printjson)

db.inventory.find({ comment: { $exists : false } }, { _id: 0, comment: 1, society: 1 });

// on peut vérifier que l'on affiche bien les documents avec le champ comment
db.inventory.find({ comment: { $exists : true } }, { _id: 0, comment : 1, society: 1 });

/**
 * 04 Exercice suppression d'un champ
 * 1. Supprimez la propriété level se trouvant dans un/les document(s). 
 * 2. Vérifiez qu'il existe au moins un doc qui possède le champ 
 *    ou la clé level à l'aide d'une requête avant cette action.
 * 3. Vérifiez que le champ **level** n'existe plus après suppression.
 */

db.inventory.find({ level: { $exists: true } }).count()

db.inventory.updateOne(
    { level: { $exists: true } },
    { $unset: { level: "" } }
)

// Vérification cette requête ne retourne rien 
db.inventory.find({ level: { $exists: true } }).count()


/**
 * 05 Exercice switch
 * L'opérateur size permet de compter le nombre d'élément(s) dans un array. 
 * Il faut cependant pré-fixer la propriété avec un dollar :
 * { $size :  "$tags" }
 * Ajoutez la propriété **label** pour les documents ayant la propriété tags uniquement. 
 * Label prendra les valeurs suivantes selon le nombre de tags :
  - si le nombre de tags est strictement supérieur à 1 : A
  - si le nombre de tags est strictement supérieur à 3 : AA
  - Et B sinon.
 */
db.inventory.updateMany(
  { tags: { $exists: true } },
  [
    {
      $set: {
        label: {
          $switch: {
            branches: [
              { case: {$gt: [{ $size: "$tags" }, 3]}, then: "AA" },
              { case: {$gt: [{ $size: "$tags" }, 1]}, then: "A" }   
            ],
            default: "B",
          },
        },
      },
    },
  ]
)

// Vérifier
db.inventory.find(
  { tags: { $exists: true } },
  { tags: 1, label: 1, _id: 0}
)


/**
 * 06 Exercice d'application (entrainement)
 */
// Insérez le document suivant dans la collection inventory :

db.inventory.insertOne( {
   name : "Test sur les dates",
   creationts: ISODate("2020-06-27T08:41:57.114Z"),
   expiryts: ISODate("2020-08-27T08:41:57.114Z")
})

// Pour récupérez le dernier document inséré tapez la ligne de commande suivante :
db.inventory.find().sort({_id: -1}).limit(1);

// Maintenant supprimez ce document en fonction de sa date d'expiration :
db.inventory.deleteOne( { "expiryts" : { $lte: ISODate("2020-08-27T08:41:57.114Z") } } );
// Vérifiez que ce document est bien supprimé de la collection.



/**
 * 01 Sujet Exercice inventory de synt
 * Reprenez la collection inventory.
 * 1. Donnez le nombre d'entreprise(s) qui ont/a exactement 2 tags.
 * 2. Trouvez toutes les entreprises dont les deux premières lettres sont identiques.©
 * 3. Faites la somme des quantités par status.
 * 4. Hydratation : créez les champs created_at et expired_at pour chaque document de la collection inventory.
 * Vous utiliserez la méthode ISODate pour créer une date aléatoire ainsi que l'objet Date de JS. Aidez-vous de l'exemple ci-dessous :
 * - Exemple : Décallage d'un jour par rapport à la date actuelle :
 */
// Pour un jour
// 1 x 24 hours x 60 minutes x 60 seconds x 1000 milliseconds
let day = 1*24*60*60*1000

// Ajoute un jour à la date actuel
new Date( ISODate().getTime() + day )

// db.inventory.aggregate( [
//   {
//     $group: {
//        _id: null,
//        count: { $sum: 1 }
//     }
//   }
// ] )
db.inventory.aggregate( [
  {
    $group: {
       type: "lux paper", 
       count: { $sum: 1 }
    }
  }
] )


/**
 * 5. Ajoutez un champ qui calcule le nombre de jours qui reste avant la suppression du document.
 * Vous pouvez utiliser les opérateurs suivants :
 * Pour faire une différence entre les dates : $subtract
 * Pour calculer le nombre de jour : $divide
 */

db.inventory.find({ society: /^(\w)\1/i }, { society: 1, _id: 0 });