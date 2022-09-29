//////////////////////////////////////////////

let patientName = document.querySelector(".patient-name");
let patientEmail = document.querySelector(".patient-email");
let patientContact = document.querySelector(".patient-number");
let patientDoctorName = document.querySelector(".patient-doctor");
let patientCheckup = document.querySelector(".patient-checkup");
let patientTime = document.querySelector(".patient-time");
let Booking_id = document.querySelector(".booking_id");

let noAppointment = document.querySelector(".no-appointments");

/////////////////
let allcookies = document.cookie;
if (allcookies) {
  let cookiearray = allcookies.split(";");
  if (cookiearray.length == 1 && cookiearray[0].includes("access_token")) {
    getCurrentUser();
  }
}
///////////////////////////////////////////////
//SHOW AND HIDE PROFILE DETAIL (NAVBAR)

let profile = document.querySelector(".profile-logo");
let showProfile = document.querySelector(".show-profile");
profile.addEventListener("mouseover", showProfileDetails);
profile.addEventListener("click", showProfileDetails);
function showProfileDetails(e) {
  e.stopPropagation();
  setCurrentUserDetails();
  showProfile.classList.toggle("visible");
  profile.classList.toggle("profile-logo-shadow");
}
document.body.addEventListener("click", () => {
  showProfile.classList.remove("visible");
  profile.classList.remove("profile-logo-shadow");
});

////////////////////////////////////////////

function getCurrentUser() {
  let cookie = document.cookie;
  let accessToken = cookie.split("=")[1];

  let url = `http://localhost:8080/Doctor-Appointment/appointment/user`;

  fetch(url, {
    headers: {
      Authorization: accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status == "success" && data.code == 200) {
        let userdata = data.userdata;
        var now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);
        document.cookie = `user_name=${
          userdata.name
        };expires=${now.toUTCString()};`;
        document.cookie = `user_email=${
          userdata.email
        };expires=${now.toUTCString()};`;
        document.cookie = `user_id=${
          userdata.id
        };expires=${now.toUTCString()};`;
      }
    });
}



///////////////////////////////////////////////////
// GET COOKIES (ACCESS TOKEN,CURRENT USER DETAILS...)

function getCookies() {
  if (document.cookie) {
    var allcookies = document.cookie;
    cookiearray = allcookies.split(";");
    let obj = {};
    for (var i = 0; i < cookiearray.length; i++) {
      key = cookiearray[i].split("=")[0].trim();
      value = cookiearray[i].split("=")[1];
      obj[key] = value;
    }
    return obj;
  } else {
    window.location.href = `http://localhost:8080/Doctor-Appointment/index.html`;
  }
}

//////////////////////////////////////////////////
// SET CURRENT USER DETAILS IN PROFILE  (NAV BAR)

function setCurrentUserDetails() {
  let userdata = getCookies();

  let username = userdata.user_name;
  let userProfileEmail = userdata.user_email;
  let userProfileName = username.replace(
    username[0],
    username[0].toUpperCase()
  );

  document.querySelector(".profile-name").innerHTML = userProfileName;
  document.querySelector(".profile-email").innerHTML = userProfileEmail;
}

/////////////////////////////////////////////////////
//   SET DEFAULT USER DETAILS IN APPOINMENT FORM (NAME,EMAIL,...);

function setUserDetailsAppointmentForm() {
  let userdata = getCookies();
  let userFirstName = document.getElementById("userfirstname");
  let userLastName = document.getElementById("userlastname");
  let useremail = document.getElementById("useremail");
  let userid = document.getElementById("user_id");

  if (userdata) {
    if (userdata.user_name.includes(" ")) {
      let [first, last] = userdata.username.split(" ");

      userFirstName.value = first;
      userLastName.value = last;
    } else {
      userFirstName.value = userdata.user_name;
    }

    useremail.value = userdata.user_email;
    userid.value = userdata.user_id;
  }
}

//////////////////////////////////////////////
// SHOW APPOINMENT FORM

function showAppoinmentForm() {
  document.querySelector(".form-section").style.display = "block";
  setUserDetailsAppointmentForm();
}

//////////////////////////////////////////////
// CLOSE THE APPOINMENT FORM AND CLEAR VALUES

function formClose() {
  document.querySelector(".form-section").style.display = "none";
  resetFormValues();
}

//////////////////////////////////////////////////
// RESET THE FORM VALUES

function resetFormValues() {
  let appoinmentFormData = document.getElementById("appointment-form");
  for (let val of appoinmentFormData) {
    if (val.type == "radio" || val.type == "checkbox") {
      val.checked = false;
    } else if (val.type == "select-one") {
      val.selectedIndex = -1;
    } else {
      val.value = "";
    }
  }
}

// //////////////////////////////////////////////////////////////////////////////////

// // SUBMIT APPOINTMENT FORM

let appointmentForm = document.getElementById("appointment-form");
appointmentForm.addEventListener("submit", addNewAppointmentForm);

function addNewAppointmentForm(event) {
  event.preventDefault();
  let data = getCookies();
  let accessToken = data.access_token;
  let formData = new FormData(appointmentForm);
  let dataObj = {};
  for (const [key, value] of formData) {
    dataObj[key] = value;
  }

  let url = "http://localhost:8080/Doctor-Appointment/appointment/add";

  fetch(url, {
    method: "POST",
    body: JSON.stringify(dataObj),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "success" && data.code == 200) {
        alert(data.message);
        window.location.href =
          "http://localhost:8080/Doctor-Appointment/Appointment.html";
      } else if (data.error == "invalid Token") {
        unauthorizedUser();
      }
    });
  // // successPopup.classList.toggle("hidden");
}

/////////////////////////////////////////////////////////

///////////////////////////////////////////////////

// ITS APOINTMENT PAGE ?  FETCH CALL TO DATABASE WITH ACCESS TOKEN

// ACCESS TOKEN ? GET APPOINTMENT DATA AND SET THE CARD DETAILS...

let appoinmentPage = "/Doctor-Appointment/Appointment.html";
if (window.location.pathname == appoinmentPage) {
  getAppointmentData();
}

function getAppointmentData(arg) {
  let cardContainer = document.querySelector(".card-container");
  let cardDetails = "";
  let url;
  let data = getCookies();
  let accessToken = data.access_token;

  if (arg) {
    url = `http://localhost:8080/Doctor-Appointment/appointment/list?sort=${arg}`;
  } else {
    url = `http://localhost:8080/Doctor-Appointment/appointment/list?`;
  }
  fetch(url, {
    headers: {
      Authorization: accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error == "invalid Token") {
        unauthorizedUser();
      } else if (data.status == "success" && data.code == 200) {
        data.data.forEach((val, i) => {
          let appoinmentTime = val.appointment_time.split("T");
          let userDetails = JSON.stringify(val);
          cardDetails += ` <div class="card-box">
              <ul  onclick='showMorePatientDetails(${userDetails})' class="card-list">
                <li> <img src="images/stethoscope-org.png" alt=""><span class="card-dr-name">${
                  val.doctor_name
                }</span></li>
                <li ><img src="images/treatment.png" alt=""><span class="card-checkup">${
                  val.checkup
                }</span></li>
                <li><img src="images/clock.png" alt=""><span class="card-date">${
                  appoinmentTime[0]
                }</span>
                 <span class="card-time">${appoinmentTimeFunc(
                   appoinmentTime[1]
                 )}</span></li>
                <li class="card-details"><span class="dot"></span>
                  <span class='card-status ${val.appointment_status}' > ${
            val.appointment_status
          }</span></li>
               </ul>
              <span onclick="cancelAppointment(${
                val.appointment_status == "Booked" ? val.Booking_id : ""
              })" class="card-cancel-icon"><span class="card-cancel-close">&#10006;</span></div>
            </span>`;
        });
        cardContainer.innerHTML = cardDetails;
      }
    });
}

////////////////////////////////////////////////////////////

function filterAppointment(filter) {
  let sortList = document.querySelectorAll(".sort");
  let cardContainer = document.querySelector(".card-container");
  let div = cardContainer.getElementsByTagName("div");
  noAppointment.style.display = "";

  for (let i = 0; i < sortList.length; i++) {
    sortList[i].classList.remove("sort-list-active");
  }

  if (filter == "all") {
    sortList[0].classList.add("sort-list-active");
    for (let i = 0; i < div.length; i++) {
      div[i].style.display = "";
    }
  } else if (filter == "Canceled" || filter == "Booked") {
    sortList[filter == "Booked" ? 1 : 2].classList.add("sort-list-active");
    let nodata = true;
    for (let i = 0; i < div.length; i++) {
      div[i].style.display = "none";
      let ul = div[i].getElementsByTagName("ul");
      for (let j = 0; j < ul.length; j++) {
        li = ul[j].getElementsByTagName("li");

        if (li) {
          if (li[3].innerText.includes(filter)) {
            //count++;
            nodata = false;
            div[i].style.display = "";
            break;
          }
        }
      }
    }
    if (nodata) {
      noAppointment.style.display = "block";
      noAppointment.innerHTML = `<h1>No ${filter} Appointments...</h1>`;
    }
  }
}

////////////////////////////////////////

// CANCEL THE APPOINMENT FORM

function cancelAppointment(i) {
  if (i && confirm("Do you want cancel your Appointment")) {
    let data = getCookies();
    let accessToken = data.access_token;
    let url = `http://localhost:8080/Doctor-Appointment/appointment/cancel`;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        booking_id: i,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "success" && data.code == 200) {
          alert(data.message);
          window.location.href =
            "http://localhost:8080/Doctor-Appointment/Appointment.html";
        } else if (data.error == "invalid Token") {
          unauthorizedUser();
        }
      });
  }
}
///////////////////////////////////////

//TO SHOW AND CLOSE - MORE (FULL)  DETAILS OF PATIENT(BOOKED) APPOINMENT FORM

let patientDetailSection = document.querySelector(".patient-detail-section");

function showMorePatientDetails(patientData) {
  patientDetailSection.classList.add("visible");

  patientName.value = patientData.name;
  patientEmail.value = patientData.email;
  patientContact.value = patientData.contact;
  patientDoctorName.value = patientData.doctor_name;
  patientCheckup.value = patientData.checkup;
  patientTime.value = patientData.appointment_time;
  Booking_id.value = patientData.Booking_id;
}

if (patientDetailSection) {
  let patientDetailClose = document.querySelector(".patient-detail-close");
  patientDetailClose.addEventListener("click", closeMorePatientDetails);
}

function closeMorePatientDetails() {
  patientDetailSection.classList.remove("visible");
  updateBtn.classList.remove("show");
  editFormRemove();
}
// //////////////////////////////////////////////////////////////////////////////////

// //

var editAppointmentForm = document.getElementById("edit-appointmentForm");
if (editAppointmentForm) {
  editAppointmentForm.addEventListener("submit", updateAppointmentForm);
}

function updateAppointmentForm(event) {
  event.preventDefault();
  closeMorePatientDetails();
  let data = getCookies();
  let accessToken = data.access_token;

  let url = "http://localhost:8080/Doctor-Appointment/appointment/update";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      name: patientName.value,
      email: patientEmail.value,
      contact: patientContact.value,
      doctorName: patientDoctorName.value,
      checkup: patientCheckup.value,
      appointmentTime: patientTime.value,
      booking_id: Booking_id.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "success" && data.code == 200) {
        alert(data.message);
        window.location.href =
          "http://localhost:8080/Doctor-Appointment/Appointment.html";
      } else if (data.error == "invalid Token") {
        unauthorizedUser();
      }
    });
  // successPopup.classList.toggle("hidden");
}

/////////////////////////////////////////////////////////

function editFormRemove() {
  let editAppointmentForm = document.getElementById("edit-appointmentForm");
  for (let val of editAppointmentForm) {
    if (val.id) {
      document.getElementById(`${val.id}`).setAttribute("readonly", "true");
      document.getElementById(`${val.id}`).style.border =
        "1px solid transparent";
      document.getElementById(`${val.id}`).addEventListener("focus", () => {
        document.getElementById(`${val.id}`).style.border = "none";
      });
    }
  }
}

/////////////////////////////////////////////////////////////
// EDIT APPOINTMENT FORM
let editAptFormBtn = document.querySelector(".edit-icon");
let updateBtn = document.querySelector(".btn-section");
if (editAptFormBtn) {
  editAptFormBtn.addEventListener("click", editAppointmentFormFunc);
}

function editAppointmentFormFunc() {
  updateBtn.classList.toggle("show");
  let editAppointmentForm = document.getElementById("edit-appointmentForm");
  for (let val of editAppointmentForm) {
    if (val.id) {
      document.getElementById(`${val.id}`).removeAttribute("readonly");
      document.getElementById(`${val.id}`).style.border = "1px solid #e5e5e5";
      document.getElementById(`${val.id}`).addEventListener("focus", () => {
        document.getElementById(`${val.id}`).style.borderColor = "#0066ff";
      });
    }
  }
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
////////////////////////////////////////////////////////////
// SORT
function doaptSort() {
  let data = getCookies();
  let accessToken = data.access_token;

  let url = `http://localhost:8080/Doctor-Appointment/appointment/sort`;

  fetch(url, {
    headers: {
      Authorization: accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      debugger;
      if (data.status == "success" && data.code == 200) {
        console.log("Success");
        location.href =
          "http://localhost:8080/Doctor-Appointment/Appointment.html";
      }
      console.log(data);
    });
}

var accendingOrder = true;
function doSort() {
  let sortIcon = document.querySelector(".sort-icon");
  let sort;
  if (accendingOrder) {
    sort = "ASC";
    sortIcon.src = "images/icons8-sort-24.png";
  } else {
    sort = "DESC";
    sortIcon.src = "images/icons8-descending-24.png";
  }
  getAppointmentData(sort);
  accendingOrder = !accendingOrder;
}
/////////////////////////////////////////////
// LOGOUT => DELETE ALL COOKIES AND ACCESS TOKEN IN TABLE (DATABASE)

function doLogout() {
  let data = getCookies();
  let accessToken = data.access_token;

  let url = `http://localhost:8080/Doctor-Appointment/appointment/logout`;

  fetch(url, {
    headers: {
      Authorization: accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "success" && data.code == 200) {
        deleteAllCookies();
        location.href = "http://localhost:8080/Doctor-Appointment/index.html";
      }
    });
}
///////////////////////////////////////////////
// DELETE ALL COOKIES

function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    key = cookies[i].split("=")[0];
    document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

//////////////////////////////////////////////
// UNAUTHORIZED USER (INVALID TOKEN);

function unauthorizedUser() {
  alert("Unauthorized User,Invalid Token ");
  doLogout();
}
///////////////////////////////////////////
/////////////////////////////////////////////
//////////////////////////////////////////////



// SUCCESS POPUP
let successPopup = document.querySelector(".success-popup");
let cancelPopup = document.querySelector(".cancel-popup");
function successPopupShow() {
  successPopup.classList.toggle("hidden");
}
function successPopupHide() {
  successPopup.classList.add("hidden");
}
function cancelPopupShow(i) {
  if (i) {
    alert("cancel popup");
    cancelPopup.classList.toggle("hidden");

    document.querySelector(".btn-delete").addEventListener("click", () => {});
  }
}

function cancelPopupHide() {
  cancelPopup.classList.add("hidden");
}

/*function getAppointmentData() {
  let data = getCookies();
  let accessToken = data.access_token;

  let cardContainer = document.querySelector(".card-container");
  let url = `http://localhost:8080/Doctor-Appointment/appointment/list`;
  let cardDetails = "";
  fetch(url, {
    headers: {
      Authorization: accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error == "invalid Token") {
        unauthorizedUser();
      } else if (data.status == "success" && data.code == 200) {
        data.data.forEach((val, i) => {
          let appoinmentTime = val.appointment_time.split("T");
          let userDetails = JSON.stringify(val);
          cardDetails += ` <div class="card-box">
              <ul  onclick='showMorePatientDetails(${userDetails})' class="card-list">
                <li> <img src="images/stethoscope-org.png" alt=""><span class="card-dr-name">${
                  val.doctor_name
                }</span></li>
                <li ><img src="images/treatment.png" alt=""><span class="card-checkup">${
                  val.checkup
                }</span></li>
                <li><img src="images/clock.png" alt=""><span class="card-date">${
                  appoinmentTime[0]
                }</span>
                 <span class="card-time">${appoinmentTimeFunc(
                   appoinmentTime[1]
                 )}</span></li>
                <li class="card-details"><span class="dot"></span>
                  <span class='card-status ${val.appointment_status}' > ${
            val.appointment_status
          }</span></li>
               </ul>
              <span onclick="cancelAppointment(${
                val.Booking_id
              })" class="card-cancel-icon"><span class="card-cancel-close">&#10006;</span></div>
            </span>`;
        });
        cardContainer.innerHTML = cardDetails;
      }
    });
}
*/
