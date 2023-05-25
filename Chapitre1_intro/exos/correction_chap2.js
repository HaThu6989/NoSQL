//  Liste d'Exercices
/**
 * 01. Combien y a t il de restaurants qui font de la cuisine italienne 
 * et qui ont eu un score de 10 au moins ?
 * 
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

/*
* Affichez également le nom, les scores et les coordonnées GPS de ces restaurants. 
* Ordonnez les résultats par ordre croissant sur les noms des restaurants.
*/
db.restaurants.find(
    { cuisine: "Italian", "grades.score": 10 },
    { "grades.score": 1, "address.coord": 1, name: 1, _id: 0 }
).sort({ name: 1 })


/* 02-03
Quels sont les restaurants qui ont eu un grade A et un score supérieur ou égal à 20 ? 
 Affichez uniquement les noms et ordonnez les par ordre décroissant.
 Affichez le nombre de résultat.
*/

//find ne renvoie que 20 documents
db.restaurants.find(
    { "grades.grade": "A", "grades.score": { $gte: 20 } },
    { _id: 0, "grades.grade": 1, "grades.score": 1, }
).sort({ name: - 1 })

db.restaurants.find(
    { "grades": { $elemMatch: { "grade": "A", "score": { $gte: 20 } } } },
    { _id: 0, "grades.grade": 1, "grades.score": 1, }
).sort({ name: - 1 })

//count
db.restaurants.count(
    { "grades": { $elemMatch: { "grade": "A", "score": { $gte: 20 } } } })


//  04. A l'aide de la méthode distinct trouvez tous les quartiers distincts de NY.
db.restaurants.distinct("borough");

// 05 Trouvez tous les types de restaurants dans le quartiers du Bronx.
//Vous pouvez là encore utiliser distinct et un deuxième paramètre pour préciser
//sur quel ensemble vous voulez appliquer cette close.

db.restaurants.distinct("cuisine", { borough: "Bronx" });

//  06 Trouvez tous les restaurants dans le quartier du Bronx qui ont eu 4 grades.


// $size calculer la taille de votre tableau
db.restaurants.find({ borough: "Bronx", $where: "this.grades.length == 4" })

db.restaurants.find({
    $and: [
        { "grades": { "$size": 4 } },
        { "borough": "Bronx" }
    ]
})

db.restaurants.find(
        { borough: "Bronx", "grades": { $size: 4 } },
        { _id: 0, name: 1, "address.coord": 1 }
    ).pretty();

// 07. Sélectionnez les restaurants dont le grade est A ou B dans le Bronx.
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

// 08. Même question mais, on aimerait récupérer les restaurants qui ont eu 
// à la dernière inspection (elle apparaît théoriquement en premier dans la liste
// des grades) un A ou B.
// Vous pouvez utilisez la notion d'indice sur la clé grade :

db.restaurants.find(
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

// 09. Sélectionnez maintenant tous les restaurants qui ont le mot "Coffee"
// ou "coffee" dans la propriété name du document.
// Puis, même question mais uniquement dans le quartier du Bronx.
db.restaurants.find({ name: /coffee/ }, { _id: 0, name: 1 })
db.restaurants.find({ name: /Coffee/ }, { _id: 0, name: 1 })

db.restaurants.find({ name: /[Cc]offee/ }, { _id: 0, name: 1 })
db.restaurant.find({ name: { $regex: /coffee/i } })

// 10. Trouvez tous les restaurants avec les mots Coffee ou Restaurant 
//et qui ne contiennent pas le mot Starbucks. Puis, 
//même question mais uniquement dans le quartier du Bronx.

// voir l'exemple suivant dans la documentation avec qty https://docs.mongodb.com/manual/reference/operator/query/and/
db.restaurant.find({
    $and: [
        {
            $or: [
                { name: /coffee/i },
                { name: /restaurant/i }
            ]
        },
        {
            name: {
                $not: /starbucks/i
            }
        }
    ]
})

// (P1) AND (P2 )
// (SP1 OU SP2) AND P2
db.restaurants.find(
    {
        $and: [
            { name: { $in: [/Coffee/, /Restaurant/] } },
            { name: { $nin: [/Starbucks/] } },
        ],
    },
    { _id: 0, name: 1 }
)


// 11. Trouvez tous les restaurants qui ont dans leur nom le mot clé coffee,
// qui sont dans le bronx ou dans Brooklyn, 
//qui ont eu exactement 4 appréciations (grades).

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

// 12. Reprenez la question 11 et affichez tous les noms de ces restaurants 
//en majuscule avec leur dernière date et permière date d'évaluation.
db.restaurants.find({}).forEach((doc) => { print(doc.name) })

db.restaurants.find({
        $and: [
            { $or: [{ borough: "Bronx" }, { borough: "Brooklyn" }] },
            { name: /coffee/i }, { grades: { $size: 4 } }
        ]
    }
        , { _id: 0, name: 1, grades: 1, borough:1}).forEach((doc) => { 
        print(doc.name.toUpperCase())
        print(`First date : ${doc.grades[3].date.toLocaleDateString()}`)
        print(`Last date : ${doc.grades[0].date.toLocaleDateString()}`)
        print(`Borough ${doc.borough}`);
    })

/***
 * compter le nombre de resto dans le Brooklyn
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