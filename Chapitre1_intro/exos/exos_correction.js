/**
 * Exo 1: 01. Combien y a t il de restaurants qui font de la cuisine italienne et 
 * qui ont eu au moins une fois un score de 10 ?
 * Affichez également le nom, les scores et les coordonnées GPS de ces restaurants. 
 * Ordonnez les résultats par ordre décroissant sur les noms des restaurants.*
 */
db.restaurants.find({ cuisine: "Italian", "grades.score": 10 }).count();
db.restaurants.find({
    "cuisine": "Italian", "grades": {
        $elemMatch: {
            "score":
                { $eq: 10 }
        }
    }
}, { "name": 1, "grades.score": 1, "address.coord": 1, "_id": 0 }).count()
db.restaurants.count({ cuisine: "Italian", "grades.score": 10 })
// db.restaurants.find(
//   { cuisine: "Italian", "grades.score": 10 },
//   { "grades.score": 1, "address.coord": 1, name: 1, _id: 0 }
// ).sort({ name: 1 })

/**
 * 02 03. Quels sont les restaurants qui ont eu un grade A et un score supérieur ou égal à 20 ? 
 * Affichez uniquement les noms et ordonnez les par ordre décroissant. Affichez le nombre de résultat.
 * Remarque pour la dernière partie de la question utilisez la méthode count :
 * db.collection.findOne(query, restriction).count();
 */
// Phai dung elemMatch vi neu khong ket hop ca 2 dk cua grades 
// elemMatch = AND / con ko grades.score OR grades.grade

db.restaurants.find( 
  {"grades": { $elemMatch: { grade: "A", score: { $gte: 20 } } } },
  {_id: 0, name: 1, "grades.score": 1, "grades.grade": 1}, 
  ).sort({ name: -1 });

  // KQ = 6312
  db.restaurants.count({
      "grades.grade": "A", 
      "grades.score" : { "$gte" : 20 }
    })


  //KQ = 5
  db.restaurants.count({"grades": { $elemMatch: { grade: "A", score: { $gte: 20 } } } })

/**
 * 04. A l'aide de la méthode distinct trouvez tous les quartiers distincts de NY.
 * db.restaurants.distinct("borough");
 */

db.restaurants.distinct("borough");

/**
 * 05. Trouvez tous les types de restaurants dans le quartiers du Bronx. 
 * Vous pouvez là encore utiliser distinct et un deuxième paramètre pour préciser sur quel ensemble vous voulez appliquer cette close :
 * db.restaurants.distinct("field", { key: "value" });
 */

db.restaurants.distinct("cuisine", {borough : "Bronx"});

/**
 * 06 Trouvez tous les restaurants dans le quartier du Bronx qui ont eu 4 grades.
 * 1. Affichez la liste des restaurants dont le nom commence et se termine par une voyelle.
 * 2. Affichez la liste des restaurants dont le nom commence et se termine par une même lettre.
 * Remarque vous pouvez soit programmer cet affichage, 
 * soit directement utiliser une regex. Dans ce cas lisez les indications suivantes :
 */

db.restaurants.find( {borough : "Bronx", grades: {"$size" : 4}}, {borough: 1, grades: 1}).count()
// giong nhau KQ 545
db.restaurants.find( {$and : [{borough : "Bronx"}, {$where: "this.grades.length == 4"}]}, {grades: 1});


db.restaurants.find({ borough: "Bronx", $where: "this.grades.length == 4" })

db.restaurants.find({
    $and: [
        { "grades": { "$size": 4 } },
        { "borough": "Bronx" }
    ]
})

db.restaurants
    .find(
        { borough: "Bronx", "grades": { $size: 4 } },
        { _id: 0, name: 1, "address.coord": 1 }
    )
    .pretty();

/**
 * 07. Sélectionnez les restaurants dont le grade est A ou B dans le Bronx.
 */


db.restaurants.find({
  borough: "Bronx",
  "grades.grade": { $in: ["A", "B"] },
})

db.restaurants
  .find({
      $and: [{ borough: "Bronx" }, { "grades.grade": { $in: ["A", "B"] } }],
  })

db.restaurants
  .find({
      $and: [
          { borough: "Bronx" },
          { $or: [{ "grades.grade": "A" }, { "grades.grade": "B" }] },
      ],
  })

db.restaurants
  .find({
      borough: "Bronx",
      $or: [{ "grades.grade": "A" }, { "grades.grade": "B" }]
  })


  /**
   * 08. Même question mais, on aimerait récupérer les restaurants qui ont eu 
   * à la dernière inspection (elle apparaît théoriquement en premier dans la liste des grades) un A ou B.
   * Vous pouvez utilisez la notion d'indice sur la clé grade :
   */
   
  db.restaurants
      .find(
          {
              $or: [{ "grades.0.grade": "A" }, { "grades.0.grade": "B" }],
              borough: "Bronx",
          },
          { _id: 0, name: 1, grades: 1 }
      );
  
  db.restaurants
      .find(
          {
              $and: [
                  {
                      $or: [{ "grades.0.grade": "A" }, { "grades.0.grade": "B" }],
                  },
                  {
                      borough: "Bronx",
                  },
              ],
          },
          { _id: 0, name: 1, grades: 1 }
      )
      .pretty();

/**
 * 09. Sélectionnez maintenant tous les restaurants qui ont le mot "Coffee" ou "coffee" dans la propriété name du document. 
 * Puis, même question mais uniquement dans le quartier du Bronx.
 * Comptez également leurs nombres total et calculez la différences avec Coffee et coffee. Utilisez une Regex :
 * /[aA]lan/
 */

db.restaurants.find({ name: /[cC]offee/ });
db.restaurants.find({ name:  {$regex : /coffee/i }});
db.restaurants.find( {$and : [{borough : "Bronx"}, { name: /[cC]offee/ }]});


/**
 * 11. Trouvez tous les restaurants qui ont dans leur nom le mot clé coffee, 
 * qui sont dans le bronx ou dans Brooklyn, qui ont eu exactement 4 appréciations (grades).
 */
db.restaurants.find( {$and : [{borough : "Bronx"}, { name: /[cC]offee/ }, ]});

db.restaurants.find({
      $and: [
        {
          $or: [{ borough: "Bronx" }, { borough: "Brooklyn" }],
        },
        {
          name: /coffee/i,
        },
        { grades: { $size: 4 } },
      ],
    },
    { _id: 0, name: 1, grades: 1 }
  ).pretty();


/**
 * 12. Reprenez la question 11 et affichez tous les noms de ces restaurants en majuscule 
 * avec leur dernière date et permière date d'évaluation.
 */
db.restaurants
    .find({
      $and: [
        {
          $or: [{ borough: "Bronx" }, { borough: "Brooklyn" }],
        },
        {
          name: /coffee/i,
        },
        { grades: { $size: 4 } },
      ],
    },
      { _id: 0, name: 1, grades: 1, borough: 1 })
    .forEach((doc)=>{
      print(doc.name.toUpperCase());
      print(`First date : ${doc.grades[3].date.toLocaleDateString()}`);
      print(`First date : ${doc.grades[0].date.toLocaleDateString()}`);
      print(`Borough : ${doc.borough}`)
    })

    // Phai ghi tren 1 dong cau lenh moi chay dc 
    db.restaurants.find({$and: [{$or: [{ borough: "Bronx" }, { borough: "Brooklyn" }]}, {name: /coffee/i},{ grades: { $size: 4 }},
      ]},{ _id: 0, name: 1, grades: 1, borough: 1 }).forEach((doc)=>{print(doc.name.toUpperCase()); print(`First date : ${doc.grades[3].date.toLocaleDateString()}`); print(`First date : ${doc.grades[0].date.toLocaleDateString()}`); print(`Borough : ${doc.borough}`)
    })
// KQ giong : db.restaurants.find({}).forEach(printjson)


/**
 * Compter les nombre de restau dans le Brooklyn
 */
// Méthode 1 (avec .forEach)
let count = 0;
db.restaurants.find({ borough: 'Brooklyn' }).forEach(() => {
    count++;
});
console.log('Nb. de restaurants dans Brooklyn:', count);

// Méthode 2 (avec le curseur)

let count2 = 0;
const cur = db.restaurants.find({ borough: 'Brooklyn' });
while (cur.hasNext()) {
    count2++;
    cur.next();
}
console.log('Nb. de restaurants dans Brooklyn:', count);