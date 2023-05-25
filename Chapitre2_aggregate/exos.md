### 00 Mini exercice

Grâce à un pipeline d'aggregation, récupérez les document de la collection **restaurants** qui ont au moins un grade "A", de cuisine `American`, et générez également :
- un nouveau champs `fullAddress` qui sera la combinaison des champs `address.building`, `address.street` et `address.zipcode`
- un nouveau champs `fullname` qui sera la combinaison de `name` et de `borough` (la valeur de **$borough** devra être en MAJUSCULES)

Le résultat final devrait ressembler à ceci :

```js
{
    fullname: "Brunos On The Boulevard (QUEENS)",
    fullAddress: "8825 Astoria Boulevard, 11369",
    cuisine: "American",
    grades: [ … ] // avec au moins un type 'A'
}
// … etc
```

```js
db.restaurants.aggregate([

    { $match: {
        cuisine: 'American',
        'grades.grade': 'A'
    } },

    { $project: {
        _id: 0,
        cuisine: 1,
        grades: 1,
        fullAddress: { $concat: [
            '$address.building',
            ' ',
            '$address.street',
            ', ',
            '$address.zipcode',
        ] },
        fullname: {
            $concat: ['$name', ' (', { $toUpper: '$borough' }, ')']
        },
    } }

]);

// Resultat
[
 {...},
 {
    cuisine: 'American',
    grades: [
      {
        date: ISODate("2014-05-16T00:00:00.000Z"),
        grade: 'A',
        score: 9
      },
      {
        date: ISODate("2013-05-10T00:00:00.000Z"),
        grade: 'A',
        score: 10
      },
      {
        date: ISODate("2012-05-15T00:00:00.000Z"),
        grade: 'A',
        score: 9
      },
      {
        date: ISODate("2011-11-02T00:00:00.000Z"),
        grade: 'C',
        score: 32
      }
    ],
    fullAddress: '0 Guardia Airport Parking, 11371',
    fullname: 'Terminal Cafe/Yankee Clipper (QUEENS)'
  },
]
```