'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // we use to overwrite old html

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type} "> ${
      i + 1
    } ${type} </div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calcPrintBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${out}€`;
  // the bank decides to give interet < 1.
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((inter, i, arr) => {
      // console.log(arr);
      return inter >= 1;
    })
    .reduce((acc, inter) => acc + inter, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1.movements);

const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

creatUsernames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcPrintBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Event Handler
// the default behaviour of html forms is to reload the page,
// so we have to change that by calling a method call preventDefault().
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
  }

  // Clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  // update UI
  updateUI(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(reciverAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }

  // Clean UI
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }

  // Clean UI
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// Map method-->
// const eurToUsd = 1.1;
// Using Normal function
// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// Using Arrow function
// const movementsUsd = movements.map(mov => {
//   return mov * eurToUsd;
// });
// console.log(movements);
// console.log(movementsUsd);

// const movementsUsdfor = [];
// for (const mov of movements) movementsUsdfor.push(mov * eurToUsd);
// console.log(movementsUsdfor);
// Insted of writing code like this, methods helps us
// doing things more easy , this is more of functional programming.

// filter method -->
// it will filter the array :

// const deposits = movements.filter(function (mov) {
//   return mov > 0; // we have to return boolean value.
// });
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(withdrawals);

// reduce method -->

// accumulator is --> snowball
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i + 1}: ${acc} `);
//   return acc + cur;
// }, 0); // specifiing value of acc is 0.
// console.log(balance);

// let ac = 0;

// for (const mov of movements) {
//   ac = ac + mov;
// }
// console.log(ac);

// Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

//Challenge
// const testData = [5, 2, 4, 1, 15, 8, 3];

// const calcHumanAge = function (ages) {
//   const calcAge = ages.map(function (age) {
//     if (age <= 2) {
//       const humanAge = 2 * age;
//       return humanAge;
//     } else {
//       const humanAge = 16 + age * 4;
//       return humanAge;
//     }
//   });
//   return calcAge;
// };

// const data = calcHumanAge(testData);

// console.log(calcHumanAge(testData));

// const filterdAges = data.filter(age => age > 18);
// console.log(filterdAges);

// const avgAge = filterdAges.reduce((acc, age) => acc + age) / filterdAges.length;
// const avgAge = filterdAges.reduce(
//   (acc, age, i, arr) => acc + age / arr.length,
//   0
// );

// console.log(avgAge);

// Chaining the methods -->
// const eurToUsd = 1.1;

// PIPELINE
// const totalDepositUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// Here for any deguging we have to check the current array in the nxt method.

// console.log(totalDepositUSD);

/* IMPORTENT NOTE:
    We should not over use chaining, bcz it 
    will cause a huge performance issue
    if the array is big enough.
    Always try to optimize code using chaining.
    We should also not chain the methods which
    cause mutation, such as splice , reverse.

*/

// CHALLENGE -->
// const calAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calAverageHumanAge(testData));

// find method -->
// it need a boolean value.
// FIND vs FILTER ->
// filter returns a array, but find returns the first element which matchs the condition.
// const firstWithdrawl = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawl);

// const account = accounts.find(mov => mov.owner === 'Jessica Davis');
// console.log(account);

// for (const mov of accounts) {
//   if (mov.owner === 'Jessica Davis') console.log(mov);
// }

// findIndex method -->

// we can also replace includs() method using some method.
//some method -->
// const anyDeposits = movements.some(mov => 1500);
// console.log(anyDeposits);

// Every method -->
// console.log(movements.every(mov => mov > 0)); //false
// console.log(account4.movements.every(mov => mov > 0)); //true

// Separate callback -->
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// flat method -->
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// this method will remove the nasted arrays.
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// this method will not remove the nasted array
// deeper than one level.
// bcz here we have to define how much deep we
// want to remove.
// console.log(arrDeep.flat(2));

// flatMap method-->
// const overalBalance = accounts.flatMap(acc => acc.movements);
// console.log(overalBalance);
// it will just go 1 level deep and we can't change this.

// Genetating 100 random dice rolls-->
// const x = Array.from({ length: 100 }, (_, i) =>
//   Math.floor(Math.random() * 6 + 1)
// );
// console.log(x);
// console.log(x.filter(mov => mov > 5));
