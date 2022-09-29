/////////////////////////////////////////
/////////////////////////////////

let username = document.getElementById("username");
let useremail = document.getElementById("uemail");
let usernumber = document.getElementById("usernumber");
let userpassword = document.getElementById("userpwd");
let checkAgree = document.getElementById("agree");

let email = document.querySelector("#useremail");
let password = document.querySelector("#userpassword");
let checklogin = document.getElementById("chkbox");

// TOGGLE LOGIN PAGE AND SIGNUP (REGISTER) PAGE

let successPopup = document.querySelector(".success-popup");
let loginForm = document.querySelector(".login-form");
let registerForm = document.querySelector(".register-form");
let loginPageLink = document.querySelector("#login-page-link");
let registerpageLInk = document.querySelector("#register-page-link");

registerpageLInk.addEventListener("click", () => {
  loginForm.classList.toggle("hidden");
  registerForm.classList.toggle("hidden");
  clearInputValues();
});
loginPageLink.addEventListener("click", () => {
  loginForm.classList.toggle("hidden");
  registerForm.classList.toggle("hidden");
  clearInputValues();
});
let providerLogin = document.querySelector(".provider-login");
providerLogin.addEventListener("click", () => {
  // let email = document.querySelector("#useremail");
  email.value = "provider123@gmail.com";
});

function clearInputValues() {
  username.value =
    useremail.value =
    userpassword.value =
    usernumber.value =
    email.value =
    password.value =
      "";
  checkAgree.checked = checklogin.checked = false;
}
// //////////////////////////////////////////////////////////////////////////////////

// // SUBMIT REGISTER (SIGNUP) FORM

var form = document.getElementById("register-form-data");
form.addEventListener("submit", doSubmitRegisterFrom);

function doSubmitRegisterFrom(event) {
  event.preventDefault();

  let url = "http://localhost:8080/Doctor-Appointment/data/register";

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      name: username.value,
      email: useremail.value,
      contact: usernumber.value,
      password: userpassword.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "success" && data.code == 200) {
        successPopup.classList.toggle("hidden");
      } else if (data.error) {
        showErrorPopup();
      }
    });
  // successPopup.classList.toggle("hidden");
}
//  else{}

////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// SUBMIT TO CHECK EMAIL & PASSWORD, IS VALID USER ? GENERATE & INSERT ACCESS TOKEN IN (DATABASE)

// SUCCESS TO GET RESPONSE USERDATA AND ACCESS TOKEN => SET COOKIES (COOKIES VALID IN 30 MINS)

// AFTER NAVIGATE TO WELCOME PAGE

let loginFormData = document.getElementById("login-form-data");
loginFormData.addEventListener("submit", doUserLogin);

function doUserLogin(event) {
  event.preventDefault();

  let url = `http://localhost:8080/Doctor-Appointment/data/login`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status == "success" && data.code == 200) {
        var now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);
        document.cookie = `access_token=${
          data.access_token
        };expires=${now.toUTCString()};`;

        // document.cookie = `user_name=${
        //   userdata.name
        // };expires=${now.toUTCString()};`;
        // document.cookie = `user_email=${
        //   userdata.email
        // };expires=${now.toUTCString()};`;
        // document.cookie = `user_id=${
        //   userdata.id
        // };expires=${now.toUTCString()};`;
        // document.cookie = `access_token=${
        //   userdata.access_token
        // };expires=${now.toUTCString()};`;

        window.location.href =
          "http://localhost:8080/Doctor-Appointment/welcome.html";
      } else if (data.message == "Invalid User") {
        showErrorPopup("Invalid User");
      } else {
        showErrorPopup();
      }
    });
}

///////////////////////////////////////////////////////////////////////
// SHOW ERROR POPUP (INAVALID USER , INCORRECT USERNAME OR PASSWORD);

function showErrorPopup(invalidUser) {
  let errorMsg = document.querySelector(".error-msg-text");
  errorMsg.innerHTML = "Incorrect Email or Password , Try Again..";
  if (invalidUser) {
    errorMsg.innerHTML = "Invalid data , Please go to signup here..";
  }

  let errorMsgRegister = document.querySelector("#error-popup-register");
  let errorMsgLogin = document.querySelector("#error-popup-login");

  errorMsgRegister.classList.remove("hidden");
  errorMsgLogin.classList.remove("hidden");
  let errorMsgCloseBtn = document.querySelectorAll(".error-msg-close");
  for (let i = 0; i < errorMsgCloseBtn.length; i++) {
    errorMsgCloseBtn[i].addEventListener("click", () => {
      errorMsgRegister.classList.add("hidden");
      errorMsgLogin.classList.add("hidden");
    });
  }
}

////////////////////////////
// SHOW AND HIDE PASSWORD

function showPassword(id) {
  var pwdInput = document.getElementById(`${id}`);
  if (pwdInput.type === "password") {
    pwdInput.type = "text";
  } else {
    pwdInput.type = "password";
  }
}

// /// SUCCESFULLY SIGNUP(REGISTER) TO SHOW SUCCESS POPUP

let successBtnLink = document.querySelector(".success-btn");
let successPopupCloseBtn = document.querySelector(".success-popup-closebtn");
successBtnLink.addEventListener("click", () => {
  successPopup.classList.toggle("hidden");
});
successPopupCloseBtn.addEventListener("click", () => {
  successPopup.classList.add("hidden");
  window.location.href = "http://localhost:8080/Doctor-Appointment/index.html";
});
