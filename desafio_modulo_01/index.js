const urlToFetch =
  'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';

let userList = [];
let filteredUserList = [];

let countMasculino = 0;
let countFeminino = 0;

let sumAges = 0;
let avarageAges = 0;

window.addEventListener('load', () => {
  loadUsers(urlToFetch);
});

async function loadUsers(urlToFetch) {
  let users = await fetch(urlToFetch);
  let usersJson = await users.json();

  //console.log('usersJson', usersJson);

  userList = usersJson.results.map((person) => {
    //console.log(person);
    const { name, picture, dob, gender } = person;
    return {
      name: name.first + ' ' + name.last,
      age: dob.age,
      gender,
      picture: picture.medium,
    };
  });

  console.log(userList);
  filteredUserList = userList;

  applyFilterAndCalculateCounts(filteredUserList);
}

function applyFilterAndCalculateCounts(filteredUserList) {
  resetCountsAndTotals();
  countMasculino = filteredUserList.filter((user) => user.gender === 'male')
    .length;
  console.log('countMasculino', countMasculino);

  countFeminino = filteredUserList.filter((user) => user.gender === 'female')
    .length;
  console.log('countFeminino', countFeminino);

  filteredUserList.forEach((user) => {
    console.log('user.age', user.age, 'sumAges', sumAges);
    sumAges += user.age;
  });

  avarageAges = sumAges / filteredUserList.length;
  console.log('avarageAges', avarageAges);
  console.log('sumAges', sumAges);
  console.log('total', filteredUserList.length);
}

function resetCountsAndTotals() {
  countMasculino = 0;
  countFeminino = 0;

  sumAges = 0;
  avarageAges = 0;
}

function search(charToFilter) {
  filteredUserList = userList.filter(
    (user) => user.name.toLowerCase().indexOf(charToFilter.toLowerCase()) > -1
  );
  applyFilterAndCalculateCounts(filteredUserList);
}
