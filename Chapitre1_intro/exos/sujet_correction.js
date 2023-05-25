// 1. Donnez le nombre d'entreprise(s) qui ont/a exactement 2 tags.

db.inventory.find({ tags: { $size: 2 } }, { _id: 0, tags: 1, society: 1 })


// 2. Apres avoir effectué la requete suivante:
db.inventory.updateMany(
  { society: "Alex" },
  {
   $set: { society: "AAlex" },
   $currentDate: { lastModified: true }
  }
);

// Retouvez l'entreprise en utilisant une regex qui verifie que les deux premières lettres sont identiques
db.inventory.find({ society: /^(.)\1/i }, { society: 1, _id: 0 });

// 3. Faites la somme des quantités par status .
let res = {}
db.inventory.find(
  {qty: {$exists : true}},
  {status : 1, qty : 1, _id: 0}
).forEach(({status, qty}) => {
  if(!res[status]) res[status] = 0;
  res[status] += qty
})
/**
 * db.inventory.find( { qty: { $exists: true } }, { status: 1, qty: 1, _id: 0 })
 * KQ:
[
  { qty: 47.5, status: 'A' },
  { qty: 62.5, status: 'A' },
  { qty: 50, status: 'A' },
  { qty: 150, status: 'D' },
  { qty: 112.5, status: 'D' },
  { qty: 45, status: 'A' },
  { qty: 47.5, status: 'B' },
  { qty: 22.5, status: 'C' },
  { qty: 250, status: 'B' }
]
 */
print(res) // { A: 205, D: 262.5, B: 297.5, C: 22.5 }

// Avec aggregate
db.inventory.aggregate(
  [
    {
      $group: {
        _id: "$status",
        totalQuantity: {$sum: "$qty"}
      }
    }
  ]
)
/** KQ
[
  { _id: 'B', totalQuantity: 297.5 },
  { _id: 'D', totalQuantity: 262.5 },
  { _id: 'A', totalQuantity: 205 },
  { _id: 'C', totalQuantity: 22.5 }
]
 */

// 4. Hydratation : créez les champs **created_at** et **expired_at** pour chaque document de la collection inventory.
// Vous utiliserez la méthode **ISODate** pour créer une date aléatoire ainsi que l'objet Date de JS. Aidez-vous de l'exemple ci-dessous :
// - Exemple
// Décallage d'un jour par rapport à la date actuelle :

// Pour un jour
// 1 x 24 hours x 60 minutes x 60 seconds x 1000 milliseconds
let day = 1*24*60*60*1000

// Ajoute un jour à la date actuel
new Date( ISODate().getTime() + day )

db.inventory.find({}, { '_id': 1 }).forEach(doc => {
  const days = Math.floor(Math.random() * 100) * 24 * 60 * 60 * 1000;

  db.inventory.updateOne(
      { '_id': doc._id },
      [
          { $set: { created_at: new Date() } },
          { $set: { expired_at: new Date(ISODate().getTime() + days) } }
      ]
  );
})


// 5. Ajoutez un champ qui calcule le nombre de jours qui reste avant la suppression du document.
// Vous pouvez utiliser les opérateurs suivants :

// Pour faire une différence entre les dates
$subtract

// Pour calculer le nombre de jour
$divide

db.inventory.updateMany(
  { _id: { $exists: true } },
  [
      { 
        $set: 
        { 
          life: 
          { 
            $divide: 
            [
              { $subtract: ["$expired_at", "$created_at",] }, 
              1000 * 60 * 60 * 24
            ] 
          } 
        } 
      },
  ]
);

// 1.
db.inventory.find = (rest, proj = null) => {
  if (proj === null)
      return db.inventory.find(rest);
  else
      return db.inventory.find(rest, proj);
};

let total = 0;

db.inventory.find({ type: "journal" }).forEach(doc => {
  const { qty } = doc;

  total += qty;
});

print(`Total des produits : ${total}`);

// 1. Deuxième solution

total = 0;
db.inventory.find({ type: "journal" }).forEach(doc => {
  const { qty } = doc; // destructuration

  total += qty;

});

// 2.
db.inventory.find({ year: { $gte: 2018 } }, { society: 1, qty: 1, _id: 0 }).forEach(doc => {
  const { society, qty } = doc;

  print(society, qty);
});

























// ma requete foireuse
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


// la requete de chatgpt
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

db.inventory.find({},{_id:0,society:1,created_at:1,expired_at:1,dateDifference:1})
