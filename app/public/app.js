//----------------------------------------------------- Different Sections on Page -----------------------------------------------------//
let locationDiv = document.querySelector("#location");
let dailyViewDiv = document.querySelector("#dailyView");
let weeklyViewDiv = document.querySelector("#weeklyView");
let monthlyViewDiv = document.querySelector("#monthlyView");

//----------------------------------------------------- date -----------------------------------------------------//
let day = document.querySelector("#day");
let numericDate = document.querySelector("#numericDate");
let monthYear = document.querySelector("#monthYear");

// ----------- entire date ----------- //
const date = new Date();

setTimeout(() => {
  fetch("/testPost", {
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    body: { name: "Filza Ahmed", age: 29 },
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (res) {
      console.log(res);
    });
}, 2000);

// ----------- convert week number into actual weekday with Array----------- //
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ----------- convert month number into actual month with Array----------- //
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ----------- add into innerHTML ----------- //
day.innerHTML = weekday[date.getDay()];
numericDate.innerHTML = date.getDate();
monthYear.innerHTML = `${months[date.getMonth()]}, ${date.getFullYear()}`;

//----------------------------------------------------- NAV MENU SELECTION -----------------------------------------------------//
function home() {
  dailyViewDiv.style.display = "block";
  locationDiv.style.display = "none";
  weeklyViewDiv.style.display = "none";
  monthlyViewDiv.style.display = "none";
}

function weekly() {
  dailyViewDiv.style.display = "none";
  locationDiv.style.display = "none";
  weeklyViewDiv.style.display = "flex";
  monthlyViewDiv.style.display = "none";
}

function monthly() {
  dailyViewDiv.style.display = "none";
  locationDiv.style.display = "none";
  weeklyViewDiv.style.display = "none";
  monthlyViewDiv.style.display = "flex";
}

function locate() {
  dailyViewDiv.style.display = "none";
  locationDiv.style.display = "block";
  weeklyViewDiv.style.display = "none";
  monthlyViewDiv.style.display = "none";
}

//----------------------------------------------------- HOME PAGE-----------------------------------------------------//
let fajrTime = document.querySelector("#fajrTime");
let dhuhrTime = document.querySelector("#dhuhrTime");
let asrTime = document.querySelector("#asrTime");
let maghribTime = document.querySelector("#maghribTime");
let ishaTime = document.querySelector("#ishaTime");

//-------------------PRAYER LOGGING INTO OBJECTS -------------------//

//object that holds all input values
let prayerLog = {};
let allCheckboxes = document.querySelectorAll("input[type=checkbox]");
//setting the date for checkbox => day, date, month, year
let logTodaysDate =
  weekday[date.getDay()] +
  date.getDate() +
  months[date.getMonth()] +
  date.getFullYear();

let dailyPrayersCheck = [
  { fajr: false },
  { dhuhr: false },
  { asr: false },
  { maghrib: false },
  { isha: false },
];

allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      //variable for whiever prayer
      let prayerCheck = this.classList[1];
      dailyPrayersCheck.forEach((item) => {
        if (prayerCheck in item) {
          item[prayerCheck] = true;
        }
      });

      //third object? = prayer which has prayed/notPrayed
      // prayerCheck = { [prayerCheck]: "prayed" };
      // console.log(prayerCheck);

      //second object = date which has all the prayers

      //first objext = prayerlog which has date
      prayerLog = {};
      prayerLog.prayerLog = {
        [logTodaysDate]: dailyPrayersCheck,
      };
      console.log(prayerLog);
    } else {
      //variable for whiever prayer
      let prayerCheck = `${this.classList[1]} notPrayed`;
      console.log(`${logTodaysDate} ${prayerCheck}`);
    }
  });
});

// assign class to each checkbox with date and prayer

// create object = {"date": {fajr:prayed, dhuhr:missed, asr:prayed, maghrib:prayed}} grab todays date
// to push new date and time in => obj."date" = {prayer:missed, prayer:prayed}

// if current time is equal to or more than next prayer time - log date prayer as missed

//----------------------------------------------------- location -----------------------------------------------------//

let cityInput = document.querySelector("#city");
let cityValue;
const submit = document.querySelector("#submit");

//listen to cityValue input//
cityInput.addEventListener("input", function () {
  cityValue = this.value;
  localStorage.setItem("city", cityValue);
  submit.disabled = false;
  if (cityValue == "") {
    submit.disabled = true;
  }
});

//if location is pre-stored//
if (localStorage.getItem("city").length > 3) {
  runAPI(localStorage.city);
}

//when submit is clicked//
function submitLocation() {
  submit.addEventListener("click", function () {
    cityValue = cityInput.value;
    runAPI(cityValue);
    home();
  });
}

// fetch API and store values into prayer time slots
function runAPI(cityValue) {
  let cityToPass = cityValue.replace(" ", "-");

  let url = `https://api.pray.zone/v2/times/today.json?city=${cityToPass}`;

  fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log("error");
        throw new Error("Something went wrong");
      }
      r;
    })
    .then((data) => {
      let prayerTimes = data.results.datetime[0].times;

      Object.entries(prayerTimes).forEach((key, i) => {
        function timeFormat(time) {
          const firstTwoDigits = time.slice(0, 2);
          const lastTwoDigits = time.slice(3, 5);

          if (firstTwoDigits == 00) {
            const newDigits = 12;
            return `${newDigits}:${lastTwoDigits} AM`;
          } else if (firstTwoDigits == 12) {
            return `${firstTwoDigits}:${lastTwoDigits} PM`;
          } else if (firstTwoDigits <= 11) {
            return `${firstTwoDigits}:${lastTwoDigits} AM`;
          } else {
            const newDigits = firstTwoDigits - 12;
            return `${newDigits}:${lastTwoDigits} PM`;
          }
        }

        fajrTime.innerHTML = timeFormat(prayerTimes.Fajr);
        dhuhrTime.innerHTML = timeFormat(prayerTimes.Dhuhr);
        asrTime.innerHTML = timeFormat(prayerTimes.Asr);
        maghribTime.innerHTML = timeFormat(prayerTimes.Maghrib);
        ishaTime.innerHTML = timeFormat(prayerTimes.Isha);

        // highlight the time it is for prayer = grab first 2 digits of current time. check if inbetween fajr and dhuhr time, if yes, change color to red?

        // function changeToRed(){
        //   if (firstTwoDigits) {

        //   }x
        // }

        // //    color: #d35050;
        // firstTwoDigits;
      });
    });
}
