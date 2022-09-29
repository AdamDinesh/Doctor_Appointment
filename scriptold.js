///////////////////////////////////////////////
//SHOW AND HIDE PROFILE DETAIL (NAVBAR)

let profile = document.querySelector(".profile-logo");
let showProfile = document.querySelector(".show-profile");
profile.addEventListener("mouseover", showProfileDetails);
profile.addEventListener("click", showProfileDetails);
function showProfileDetails(e) {
  e.stopPropagation();
  showProfile.classList.toggle("visible");
  profile.classList.toggle("profile-logo-shadow");
}
document.body.addEventListener("click", () => {
  showProfile.classList.remove("visible");
  profile.classList.remove("profile-logo-shadow");
});

//////////////////////////////////////////////

// SET CURRENT USER NAME AND EMAIL IN PROFILE

function getUserLoginId() {
  let currentUserData = JSON.parse(
    localStorage.getItem("currentUserLoginData")
  );
  let userProfileEmail = currentUserData.useremail;
  if (userProfileEmail) {
    let userProfileName = userProfileEmail.slice(
      0,
      userProfileEmail.indexOf("@")
    );
    let capitiliseName = userProfileName.replace(
      userProfileName[0],
      userProfileName[0].toUpperCase()
    );

    document.querySelector(".profile-name").innerHTML = capitiliseName;
    document.querySelector(".profile-email").innerHTML = userProfileEmail;
  }
}
getUserLoginId();

//////////////////////////////////////

// GET USERSIGNUP DATA  AND  SHOW THE DEFAULT VALUES IN APPOINMENT FORM (NAME,EMAIL,NUMBER);

var patientId;
function getUserSignUpData() {
  let loginUserData = JSON.parse(localStorage.getItem("currentUserLoginData"));
  let userSignupData = [loginUserData];
  let userFirstName = document.getElementById("userfirstname");
  let userLastName = document.getElementById("userlastname");
  let useremail = document.getElementById("useremail");
  let usernumber = document.getElementById("usernumber");

  if (userSignupData) {
    userSignupData.forEach((data) => {
      if (data.username.includes(" ")) {
        let [first, last] = data.username.split(" ");

        userFirstName.value = first;
        userLastName.value = last;
      } else {
        userFirstName.value = data.username;
      }

      useremail.value = data.useremail;
      usernumber.value = data.usernumber;
      patientId = data.userid;
    });
  }
}
getUserSignUpData();

////////////////////////////////////////////
//////////////////////////////////////////////

// SHOW APPOINMENT FORM

function showAppoinmentForm() {
  document.querySelector(".form-section").style.display = "block";
}

////////////////////////////////////////////////
//////////////////////////////////////////////

// SUBMIT APPOINMENT FORM

let appoinmentDataArr = [];
let bookingId = 1;
function getBookingId() {
  if (localStorage.getItem("patientData") != null) {
    bookingId = JSON.parse(localStorage.getItem("patientData"));
    return (bookingId = bookingId.length);
  }
}

function submitAppoinmentForm(event) {
  bookingId = String(bookingId).padStart(5, "0");
  let appoinmentFormData = document.getElementById("appoinment-form");
  let gender = document.appoinmentform.gender.value;
  let username = document.appoinmentform.userfirstname.value;
  let formValue = new FormData(appoinmentFormData);
  let patientdataObj = {
    patientId: patientId,
    bookingId: getBookingId(),
    BookingTime: new Date().toISOString(),
    status: "Booked",
  };

  for (const [key, value] of formValue) {
    patientdataObj[key] = value;
  }
  patientdataObj["gender"] = gender;

  console.log(patientdataObj);

  appoinmentDataArr.push(patientdataObj);

  localStorage.setItem("patientData", JSON.stringify(appoinmentDataArr));

  resetFormValues();
  formClose();
  getPatientData();

  // window.location.href = "AppoinmentPage.html";
  // window.location.replace("AppoinmentPage.html");
  // console.log(window.location.pathname);
  if (window.location.pathname != "/AppoinmentPage.html") {
    window.location.href = "/AppoinmentPage.html";
  }
}

getPatientData();

////////////////////////////////////////////
//////////////////////////////////////////////

var patientData;
function getPatientData(filterData) {
  let cardContainer = document.querySelector(".card-container");
  if (filterData) {
    if (filterData.length === 0) {
      return (cardContainer.innerHTML = "No Cancelled Appoinments");
    }
    patientData = filterData;
  } else {
    patientData = JSON.parse(localStorage.getItem("patientData"));

    window.patientData = patientData;
  }

  if (patientData.length !== 0) {
    let cardDetails = "";

    patientData.forEach((val, i) => {
      // onclick='showMorePatientDetails(${i})'
      // console.log(val.appoinmentTime.split("T"));
      // let cartDetail = changeCardDetail();
      let appoinmentTime = val.appoinmentTime.split("T");
      cardDetails += ` <div class="card-box">
              <ul  onclick='showMorePatientDetails(${i})' class="card-list">
                <li> <img src="images/stethoscope-org.png" alt=""><span class="card-dr-name">${
                  val.doctorName || "Dr.Senthil Kumar"
                }</span></li>
                <li ><img src="images/treatment.png" alt=""><span class="card-checkup">${
                  val.checkup || "General Checkup"
                }</span></li>
                <li><img src="images/clock.png" alt=""><span class="card-date">${
                  appoinmentTime[0] || new Date().toLocaleDateString()
                }</span>
                 <span class="card-time">${appoinmentTimeFunc(
                   appoinmentTime[1]
                 )}</span>
                </li>
                <li class="card-details ${
                  val.status
                }"><span class="dot"></span><span class='card-status ${
        val.status
      }' id='card-status-${i}'> ${val.status}</span></li>
              </ul>
              <div onclick="doCancel(${i})" class="card-cancel-icon"><svg viewBox="0 0 20 20" data-v-6a943414="" width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="card-close-icon"><path d="M6.414 5A1 1 0 1 0 5 6.414L10.586 12 5 17.586A1 1 0 1 0 6.414 19L12 13.414 17.586 19A1 1 0 1 0 19 17.586L13.414 12 19 6.414A1 1 0 1 0 17.586 5L12 10.586 6.414 5Z"></path></svg></div>
            </div>`;
    });
    if (cardContainer) {
      cardContainer.innerHTML = cardDetails;
    }
  }
}

//////////////////////////////////////////////

// CLOSE THE APPOINMENT FORM AND CLEAR VALUES

function formClose() {
  document.querySelector(".form-section").style.display = "none";
  resetFormValues();
}

// RESET THE FORM VALUES

function resetFormValues() {
  let appoinmentFormData = document.getElementById("appoinment-form");
  for (let val of appoinmentFormData) {
    if (val.type == "radio" || val.type == "checkbox") {
      val.checked = false;
    } else if (val.type == "select-one") {
      val.selectedIndex = -1;
    } else {
      val.value = "";
    }
  }
  getUserSignUpData();
}

///////////////////////////////////////////////
// SET APPOINMENT FORM DATE,TIME MIN(Tomorrow Date)

function minAppoinmentDateTime() {
  let appoinmentDate = document.getElementById("apmnttime");
  let currentDate_Time = new Date().toISOString().split("T");
  let currentDate = new Date().getDate();

  appoinmentDate.min = `${currentDate_Time[0].slice(0, -2)}${currentDate_Time[0]
    .slice(-2)
    .replace(currentDate, currentDate + 1)} ${currentDate_Time[1].slice(0, 5)}`;
}
minAppoinmentDateTime();

////////////////////////////////////////
//// APPOINMENT TIME 24hs format (15:10) to 12hrs (3:10 pm)

function appoinmentTimeFunc(time = "10:30") {
  let [hour, mint] = time.split(":");
  hour = hour > 12 ? `${hour - 12}:${mint} P.M` : `${hour}:${mint} A.M`;
  return hour;
}

//////////////////////////////////////////

// CHANGE CARD DETAILS
/*
function changeCardDetail() {
  let num = Math.trunc(Math.random() * 4) + 1;
  if (num == 1) return "Cancelled";
  else if (num == 2) return "Booked";
  else if (num == 3) return "Approved";
  else if (num == 4) return "Completed";
}
*/

// getPatientData();
/*
function getLocalStorage(removeCardItem) {
  // alert(removeCardItem)
  if (removeCardItem) {
    let patientDataAppoinmentPage = JSON.parse(
      localStorage.getItem("patientData")
    );

    localStorage.setItem(
      "patientData",
      JSON.stringify(patientDataAppoinmentPage)
    );
    let newpatientDataAppoinmentPage = JSON.parse(
      localStorage.getItem("patientData")
    );

    return getPatientData(newpatientDataAppoinmentPage);
  } else {
    let patientDataAppoinmentPage = JSON.parse(
      localStorage.getItem("patientData")
    );
    return getPatientData(patientDataAppoinmentPage);
  }
}
getLocalStorage();
*/
// var setData = true;

////////////////////////////////////////

// CANCEL THE APPOINMENT FORM

function doCancel(i) {
  if (confirm("Do you want to Cancel your Appoinment.?")) {
    document.getElementById(`card-status-${i}`).innerHTML = "Cancelled";
    document.getElementById(`card-status-${i}`).style.color = "#f0483e";
    patientData[i].status = "Cancelled";
    localStorage.setItem("patientData", JSON.stringify(patientData));
  }
}

/////////////////////////////////////
////////////////////////////////////////

//TO SHOW AND CLOSE - MORE (FULL)  DETAILS OF PATIENT(BOOKED) APPOINMENT FORM

let patientDetailSection = document.querySelector(".patient-detail-section");

function showMorePatientDetails(i) {
  patientDetailSection.classList.add("visible");
  let patientName = document.querySelector(".patient-name");
  let patientEmail = document.querySelector(".patient-email");
  let patientContact = document.querySelector(".patient-number");
  let patientDoctorName = document.querySelector(".patient-doctor");
  let patientCheckup = document.querySelector(".patient-checkup");
  let patientTime = document.querySelector(".patient-time");

  patientName.innerHTML = patientData[i].userfirstname;
  patientEmail.innerHTML = patientData[i].useremail;
  patientContact.innerHTML = patientData[i].usernumber;
  patientDoctorName.innerHTML = patientData[i].doctorName;
  patientCheckup.innerHTML = patientData[i].checkup;
  patientTime.innerHTML = patientData[i].appoinmentTime;
}

if (patientDetailSection) {
  let patientDetailClose = document.querySelector(".patient-detail-close");
  patientDetailClose.addEventListener("click", () => {
    patientDetailSection.classList.remove("visible");
  });
}

/////////////////////////////////////////////
/////////////////////////////////////////////

// SORT THE VALUES (ALL,CANCELLED)

var accendingOrder = true;
function doSort(condition) {
  let sortList = document.querySelectorAll(".sort");

  if (condition == "all") {
    sortList[0].classList.add("sort-list-active");
    sortList[1].classList.remove("sort-list-active");

    // getLocalStorage();
    getPatientData();
  } else if (condition == "cancel") {
    sortList[0].classList.remove("sort-list-active");

    sortList[1].classList.add("sort-list-active");

    let cancelledAppoinments = patientData.filter((data, i) => {
      if (data.status == "Cancelled") {
        return data;
      }
    });

    getPatientData(cancelledAppoinments);
  } else if (condition == "sort") {
    let sortIcon = document.querySelector(".sort-icon");

    let appoinmentSort = patientData.sort((a, b) => {
      if (accendingOrder) {
        sortIcon.src = "images/icons8-sort-24.png";

        return (
          new Date(a.appoinmentTime).getTime() -
          new Date(b.appoinmentTime).getTime()
        );
      } else {
        sortIcon.src = "images/icons8-descending-24.png";

        return (
          new Date(b.appoinmentTime).getTime() -
          new Date(a.appoinmentTime).getTime()
        );
      }
    });

    getPatientData(appoinmentSort);
    accendingOrder = !accendingOrder;
  }
}
////////////////////////////////////
/////////////////////////////////////////////////

//reference
// let formData=new FormData(registerFormData);
// let dataObj={};
// for(let [key,value] of formData){
//   dataObj[key]=value;
// }

// let username=document.registerFrom.username.value;
// let useremail=document.registerFrom.useremail.value;
// let usernumber=(document.registerFrom.usernumber.value);
// let userpassword=document.registerFrom.userpassword.value;

// for(let val of registerFormData){
//   if(val.type=='checkbox'){
//     val.checked=false;
//   }
//   val.value='' }

// let getUsersData=JSON.parse( localStorage.getItem('userdata'));
// // console.log(JSON.parse(getUsersData));
// console.log(getUsersData['username']);

// console.log(data);
//  console.log(data);
// dataObj.usernamer!=''&&dataObj.useremailr!=''&&dataObj.usernumber!=''&&dataObj.userpassword!=''&& usersDataArr.push(dataObj);
