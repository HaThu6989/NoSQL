
function hi(a) {
  console.log(a);
}


function salut(a, cb) {
  cb(a)
}

salut('salut', hi)


/* //passage par valeur
let a=5;   // #efef6r4115 
let b=a;   // #efef6r4116  
b++
console.log(a);
console.log(b); 

//passage par reference
let c = { name: 'sofian' , friends:['marc','paul']}; // #efef6r4117
let d = {...c,friends:[...c.friends,'mike']};        // #efef6r4117
d.name = 'pierre'
console.log(c);
console.log(d);
 */

const tab = [1, 2, 3, 4]

/* 
const one = tab[0]
const two = tab[1]
const four = tab[3] 
*/

const [one, two, , four] = tab

console.log(one);
console.log(two);

console.log(four);

const name2 = 'marc'
const user = { name2, age: 9, taille: 180 }
const { taille, age } = user
console.log(age, taille);



//Foreach :
const users = [
  { id: 1, email: "micka@mail.com" },
  { id: 2, email: "momobg@mail.com" },
  { id: 3, email: "alibaba@mail.com" }
]

function forEach(array, callback) {
  for (const item of array) {
    callback(item)
  }
}

function showEmail(user) {
  console.log(user.email)
}

forEach(users, showEmail)


//Find :
function find(array, callback) {
  for (const item of array) {
    if (callback(item)) {
      return item
    }
  }

  return null
}

//Filter :
function filter(array, callback) {
  const filtered = []

  for (const item of array) {
    if (callback(item)) {
      filtered.push(item)
    }
  }

  return filtered
}


//js
const data = ["Saucisse", "Lapin", "Café"]
  .filter(x => x !== "Saucisse")
  .map(x => x.toUppercase())

//php
$data = array_map(
  fn($x) => strtoupper($x),
  array_filter(
    fn($x) => $x !== 'Saucisse',
    ['Saucisse', 'Lapin', 'Café']
  )
);


// Aggregate
db.inventory.aggregate([
  {$match : { type : "journal"}}, // restriction premier pipe
  // aggregate des données
  { $group : { 
      _id : null, // par rapport à quel champ vous regrupez si null tous les champs tout le document
      totalQty : { $sum : "$qty"} ,
      count : { $sum : 1}
  }},
])