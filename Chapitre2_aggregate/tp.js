// ## Aggrégation de somme et création d'un nouveau document
// Créez une collection **sales** dans MongoDB dans la base de données restaurants.
// Rappelons la syntaxe pour créer une collection :
db.createCollection(name, options)


// Créez le document sales suivant, nous créerons au préalable un schéma cette collection afin de préciser à MongoDB le type de chaque propriété :
db.createCollection("sales", 
    { capped : true, size : 5242880, max : 5000, validator : {
            $jsonSchema : {
                bsonType : "object",
                required : ["price"],
                properties : {
                    agency : {
                        bsonType: "string"
                    },
                    price : {
                        bsonType : "decimal",
                        description : "must be a number and is required"
                    },
                    date : {
                        bsonType : "date",
                    },
                    restaurant_id : {
                        bsonType : "string"
                    }
                }
            }
        }
    }
)

// Insertion
db.sales.insertMany([
  {  "restaurant_id" : "5e79995fee344ac7b3cde77d", "agency" : "abc" , "price" : NumberDecimal("100000"),  "date" : ISODate("2014-03-01T08:00:00Z") },
  {  "restaurant_id" : "5e79995fee344ac7b3cde784", "agency" : "xyz" , "price" : NumberDecimal("200000"),  "date" : ISODate("2014-03-01T09:00:00Z") },
  { "restaurant_id" : "5e79995fee344ac7b3cde77f", "agency" : "abc" , "price" : NumberDecimal("5000000"),  "date" : ISODate("2014-03-15T09:00:00Z") },
  {  "restaurant_id" : "5e79995fee344ac7b3cde785", "agency" : "uvw" , "price" : NumberDecimal("5000000"),  "date" : ISODate("2014-04-04T11:21:39.736Z") },
  {  "restaurant_id" : "5e79995fee344ac7b3cde788", "agency" : "uvw" , "price" : NumberDecimal("10000000"),  "date" : ISODate("2014-04-04T21:23:13.331Z") },
  {  "restaurant_id" : "5e79995fee344ac7b3cde790", "agency" : "abc" , "price" : NumberDecimal("700000.5"),  "date" : ISODate("2015-06-04T05:08:13Z") },
  {  "restaurant_id" : "5e79995fee344ac7b3cde78a", "agency" : "xyz" , "price" : NumberDecimal("700000.5"),  "date" : ISODate("2015-09-10T08:43:00Z") },
  {  "restaurant_id" : "5e79995fee344ac7b3cde781", "agency" : "abc" , "price" : NumberDecimal("1000000") , "date" : ISODate("2016-02-06T20:20:13Z") },
])


// Vous pouvez vérifier que le schema fonctionne bien en essayant d'ajouter :
db.sales.insertMany([
    {  "restaurant_id" : "5e79995feee344ac7b3cde77d", "agency" : "abc" , "price" : "je ne suis pas un nombre",  "date" : ISODate("2014-03-01T08:00:00Z") }
]) 
 
// Mongo vérifie bien que le prix soit de de type **number**. Il nous refuse cette ligne.
// Voici comment on peut faire une requête SQL qui compterait le nombre d'items dans la collection ci-dessus :

// En SQL : SELECT COUNT(*) FROM sales;

// En MongoDB
db.sales.aggregate( [
  {
    $group: {
       _id: null,
       count: { $sum: 1 }
    }
  }
] )
// Résultat: { "_id" : null, "count" : 8 }


// ## 01 Exercice calculer la somme par agence collection sales

// - 1. A partir des données ci-dessus calculer le total des prix des restaurants par agence.
db.sales.aggregate([
  {$group: {
    _id : "$agency",
    totalPrice: {$sum: "$price"}
  }}
])

// - 2. Quelles sont les totaux dans ce regroupement qui sont supérieurs ou égaux à 950000 ?
// Remarques : vous pouvez également appliquer une condition de recherche par regroupement (HAVING) 
// en utilisant l'opérateur suivant après l'opérateur de regroupement. 
// Dans l'absolu vous pouvez donc enchaînner plusieurs opérateur match/group/match/group ...

db.sales.aggregate([
  {$group: {
    _id : "$agency",
    totalPrice: {$sum: "$price"}
  }},
  {$match: {
    totalPrice: {$gte : 950000}
  }}
])


// ## 02 Exercice collections Restaurants

// - 1. On aimerait maintenant avoir tous les noms et id des restaurants par type de cuisine et quartier. 
// Limitez l'affichage à deux résultats.
db.restaurants.aggregate([
  {$group : {
    _id: {
      "cuisine" : "$cuisine",
      "borough" : "$borough",
    },
    names: { $push: { name: "$name", restaurant_id: "$restaurant_id" } }
  }},
  {$limit: 2}
])
// KQ : ko cần lọc  => nhóm lại theo cuisine và borough
// [{...}, {
//   _id: { cuisine: 'Afghan', borough: 'Manhattan' },
//   names: [
//     { name: 'Afghan Kebab House', restaurant_id: '40552806' },
//     { name: 'Khyber Pass', restaurant_id: '40589545' },
//     { name: 'Afghan Kebab House #1', restaurant_id: '40616799' },
//     { name: 'Ariana Kebab House', restaurant_id: '40868400' }
//   ]
// }, {...}]



// - 2. Affichez maintenant tous les noms de restaurant Italiens par quartier.
db.restaurants.aggregate([
  { $match: { cuisine: "Italian" } },
  {
      $group: {
          _id: {
              "borough": "$borough"
          },
          names: { $push: "$name" }
      }
  }
]).pretty()

// KQ : lọc chỉ lấy các cuisine Italian => nhóm lại theo borough
// [{...}, {
//   _id: { borough: 'Queens' },
//   names: [
//     'Parkside Restaurant',
//     'Don Peppe',
//     'Cara Mia',
//     "..."
//   ]
// }, {...}]



// - 3. Affichez pour chaque restaurant, la moyenne de ses scores. 
// Et ordonnez vos résultats par ordre de moyenne décroissante.
// Vous pouvez également le faire par type de restaurant et par quartier.

// Indications : vous utiliserez l'opérateur suivant pour désimbriquer les éléments 
// de la liste grades afin de pouvoir faire la moyenne sur le champ score, 
// mettez cet opérateur avant les autres : unwind/match/group/ ...
//  { $unwind : "$grades" } ,


//C1: làm vs project
db.restaurants.aggregate([
  {$project: {
    _id: 0,
    name: 1,
    moyenne: { $avg: '$grades.score' },
  }},
  {$sort: {"moyenne" : -1}}
])

// KQ: mỗi cửa hàng chỉ ra đc trung bình grades.score vì grades là 1 mảng có nhiều phần tử con, mỗi ptu con có 1 score
// [
//   { name: 'Juice It Health Bar', moyenne: 75 },
//   { name: 'Golden Dragon Cuisine', moyenne: 73 },
//   { name: 'Palombo Pastry Shop', moyenne: 69 },
//   ...
// ]


//OU 
//C2: làm vs groupes
//unwind: khi bạn nhóm theo 1 tiêu chí và avg theo 1 tiêu chí khác
db.restaurants.aggregate([
  { $unwind: "$grades" },
  { $group: { _id: "$name", avg_by_restaurant: { $avg: "$grades.score" } } },
  { $sort: { avg_by_restaurant: -1 } }
]).pretty()

//KQ: chia grades ra 1 bảng riêng => groupe lại theo name
// [
//   { _id: 'Juice It Health Bar', avg_by_restaurant: 75 },
//   { _id: 'Golden Dragon Cuisine', avg_by_restaurant: 73 },
//   { _id: 'Palombo Pastry Shop', avg_by_restaurant: 69 },
//   ...
// ]


//KQ: nếu ko có { $unwind: "$grades" } => avg_by_restaurant : null
// [
//   { _id: 'Juice It Health Bar', avg_by_restaurant: null },
//   { _id: 'Golden Dragon Cuisine', avg_by_restaurant: null },
//   { _id: 'Palombo Pastry Shop', avg_by_restaurant: null },
//   ...
// ]

// - 4. Moyenne des scores par quartier et type de restaurant
db.restaurants.aggregate([
  { $unwind: "$grades" },
  {$group: {
    _id: {
        "borough": "$borough",
        "cuisine": "$cuisine"
    },
    avg: { $avg: "$grades.score" }
  }},
  {$sort: {avg: -1}}
])
//KQ: group theo borough và cuisine, avg : moyen của grades.score
// [
//   { _id: { borough: 'Brooklyn', cuisine: 'Filipino' }, avg: 23.2 },
//   { _id: { borough: 'Brooklyn', cuisine: 'Hotdogs/Pretzels' }, avg: 21.5 },
//   { _id: { borough: 'Missing', cuisine: 'Jewish/Kosher' }, avg: 21 },
//   { _id: { borough: 'Bronx', cuisine: 'Pakistani' }, avg: 20.5 },
//   ...]

// Lý do vì sao dùng unwind + groupe thay vì project : khi điều kiện regrouper 2 trở lên 
// Trong TH này là : borough và cuisine
db.restaurants.aggregate([
  {$project: {
    _id: 0,
    borough: 1,
    cuisine: 1,
    avg: { $avg: "$grades.score" }
  }},
  {$sort: {avg: -1}}
])

// KQ:
// [{
//     borough: 'Brooklyn',
//     cuisine: 'Juice, Smoothies, Fruit Salads',
//     avg: 75
//   },
//   {
//     borough: 'Bronx',
//     cuisine: 'Chinese',
//     avg: 73
//   },...]

// - 5. Faites une requête qui récupère les 5 premiers restaurants Italiens les mieux notés 
// et placez cette recherche dans une collection nommée `top5`.
// Remarques : vous pouvez utiliser l'opérateur suivant pour enregistrer une nouvelle collection à partir d'une recherche donnée :
// { $out : "top5" }
db.restaurants.aggregate([
  { $match: {cuisine: "Italian" }},
  { $project: {
      _id: 0,
      cuisine: "$cuisine",
      name: "$name",
      average: { $avg: "$grades.score" },
      grades: 1,
  }},
  { $sort: { "average": -1 } },
  { $limit: 5 },
  { $out: "top5" },
]);
// KQ:
// [{
//     _id: ObjectId("644bc70160de83a8e083cfee"),
//     grades: [
//       {
//         date: ISODate("2014-09-18T00:00:00.000Z"),
//         grade: 'C',
//         score: 37
//       }
//     ],
//     cuisine: 'Italian',
//     name: 'Paprika',
//     average: 37
//   },...]



// - 6 Récupérez le nombre de restaurants par quartier ainsi que leur type de cuisine 
// qui contiennent AU MOINS un score supérieur ou égal à 30. 
// Ordonnez le résultat par ordre décroissant de nombre de restaurant.

db.restaurants.aggregate([
    // les restaurants qui ont un score au moins supérieur à 30 identique à un WHERE en MySQL
    { $match: { "grades.score": { $gte: 30 } } },
    {
        $group: {
            _id: "$borough",// agrégation des données par quartier => crée des sous-ensemble
            totalRestaurant: { $sum: 1 }, // fonction agrégation sur les sous-ensembles
            cuisines: { $addToSet: "$cuisine" } // ajouter dans un tableau de manière unique chaque type de restaurants
            // cuisines : { $push : "$cuisne" } // on aurait dans ce cas eu des doublons de type 
        }
    },
    {
        $sort: {
            totalRestaurant: -1
        }
    }
])

//OU

db.restaurants.aggregate([
    { $match: {"grades.score":{$gte: 30}}},
    { $group: {_id: {"cuisine": "$cuisine","borough": "$borough"},somme: { $sum: 1}}},
    { $sort: {somme:-1}}
])
//KQ:
// [
//   { _id: { cuisine: 'American', borough: 'Manhattan' }, somme: 262 },
//   { _id: { cuisine: 'Chinese', borough: 'Manhattan' }, somme: 96 },
//   { _id: { cuisine: 'American', borough: 'Brooklyn' }, somme: 84 },
//   { _id: { cuisine: 'American', borough: 'Queens' }, somme: 77 },
//   { _id: { cuisine: 'Chinese', borough: 'Queens' }, somme: 74 },
//   { _id: { cuisine: 'Chinese', borough: 'Brooklyn' }, somme: 73 },...]


// - 7 Cherchez les meilleurs restaurants en proposant une requête de votre choix, 
// faites le par quartier. Puis donnez la moyenne des scores de ces restaurants.
db.restaurants.aggregate([
  { $unwind: "$grades" },
  { $match: { "grades.score": { $exists: true }, "grades.score": { $not: { $lt: 30 } } } },
  {
      $group: {
          _id: {
              "borough": "$borough"
          },
          names: {
              $push: {
                  name: "$name",
                  avg: {
                      $avg: "$grades.score"
                  },
              }
          },
      },
  },
  { $project: { _id: 1, names: 1 } },
  { $sort: { "grades.score": - 1 } }
]).pretty()

//KQ:
// [
//   ...
//   { name: 'Dugout Pub', avg: 36 },
//   { name: 'New York Style Eats', avg: 33 },
//   { name: 'Rest-Au-Rant', avg: 37 },
//   { name: "Mcdonald'S", avg: 42 },
//   { name: 'Metro Diner', avg: 46 },
//   { name: 'Metro Diner', avg: 32 },  
//   ...
// ]


db.restaurants.aggregate([
  { $unwind: "$grades" },
  { $match: { "grades.score": { $exists: true }, "grades.score": { $not: { $lt: 30 } } } },
  { $group: {
          _id: {"borough": "$borough"},
          names: {
              $push: {
                  name: "$name",
                  avg: {$avg: "$grades.score"},
              }
          },
  }},
  { $unwind: "$names" }, // add this stage to flatten the "names" array
  { $sort: { "names.avg": -1 } }, // sort by the "avg" field in the "names" array
  {
      $group: {
          _id: "$_id",
          names: {$push: "$names"}
      }
  },
  { $project: { _id: 1, names: 1 } },
]).pretty()