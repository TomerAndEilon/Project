
var year;
var extend;
$(document).ready(function() {
    console.log( "ready!" );
    //check if loging?
    is_login();
    // add lisaner to the logout button
    logout();
    //add user name to the top
   
    
});

function update_user_name_and_email_to_info(){
    setTimeout(function(){
    var user = firebase.auth().currentUser;
        $("#profile-user-name").html("שם: "+ user.displayName);
        $("#profile-user-email").html("מייל: "+ user.email);
        $("#year").html("שנה בתואר: "+ convertYearNumberToHebrow(year));
        $("#extend").html("מקבץ: "+ convertProCoursesToHebrow(extend));
    
    },1000);
    
}

function convertYearNumberToHebrow(year){
    let yearInHebrow = "";
    switch (year) {
        case "1":
            yearInHebrow = "ראשונה";
            break;
        case "2":
            yearInHebrow = "שנייה";
            break;
        case "3":
            yearInHebrow = "שלישית";
            break;
        case "4":
            yearInHebrow = "רביעית";
            break;
        case "5":
            yearInHebrow = "חמישית";
            break;
        case "6":
            yearInHebrow = "שישית";
            break;
        case "7":
            yearInHebrow = "שביעית";
            break;
    
        default:
            break;
    }
    return yearInHebrow;
}

function convertProCoursesToHebrow(proList){
    let courseInHebrow = "";
    for (let i = 0; proList && i < proList.length; i++) {
        switch (proList[i]) {
            case "software":
                courseInHebrow +="פיתוח תוכנה "
                break;
            case "Internet technology":
                courseInHebrow +="אינטרנט "
                break;
            case "Signal Processing":
                courseInHebrow +="עיבוד אותות "
                break;
            case "Real-time systems and networks":
                courseInHebrow +="רשתות "
                break;
            case "Computational Learning and Artificial Intelligence":
                courseInHebrow +="בינה מלאכותית "
                break;
            
            default:
                break;
        }
        
    }
    return courseInHebrow == ""?"*לא נבחר מקבץ*":courseInHebrow;
}
function update_checked_courses(){
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
        let params_data = snapshot.val();
        let firstSemster = params_data.list_select_course !=null ? params_data.list_select_course.first: "";
        let secondSemster = params_data.list_select_course !=null ? params_data.list_select_coursese.second: "";
        year = checkIfEmpty(params_data.year);
        extend = checkIfEmpty(params_data.list_pro_coures);
        console.log(year);
        update_user_name_and_email_to_info();
        setTimeout(() => {
            updateTree(firstSemster,secondSemster);
        }, 1000);
    });
    
}

function checkIfEmpty(obj){
    if(obj == null)
        obj = "";
    return obj;
}

function updateTree(firstSemster,secondSemster){
    var toggler = document.getElementsByClassName("caret");
    var i;
    let firstSemsterElemnet = document.getElementById("semeter0");
    let secondSemsterElemnet = document.getElementById("semeter1");
    for (let j = 0; firstSemster && j < firstSemster.length; j++) {
        firstSemsterElemnet.innerHTML += '<li>' + firstSemster[j] + '</li>';
    }
    for (let k = 0; secondSemster && k < secondSemster.length; k++) {
        secondSemsterElemnet.innerHTML += '<li>' + secondSemster[k] + '</li>';
    }
    
    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }       
}




function logout(){
    $("#logout-btn").on("click", function () {
        var user = firebase.auth().currentUser;
        firebase.auth().signOut().then(function () {
          console.log("logout successful")
        }).catch(function (error) {
          console.log("logout error " + error);
        });
      });
}

function is_login() {
    function add_user_name_on_nav(user){
        if (user.displayName != null){
            $("#hello-user").text("שלום "+ user.displayName);
            $("#hello-user").css("display","block");
        }
    }
    var firebaseConfig = {
        apiKey: "AIzaSyC5TD5bZiZz40XmGIFdjM5nIwga_QBTlBM",
        authDomain: "projectet-8baf2.firebaseapp.com",
        databaseURL: "https://projectet-8baf2.firebaseio.com",
        projectId: "projectet-8baf2",
        storageBucket: "projectet-8baf2.appspot.com",
        messagingSenderId: "614014308460",
        appId: "1:614014308460:web:5650642485d3e60f3dc849",
        measurementId: "G-EF5TVMPS6S"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    if (!firebase.apps.length) {
        firebase.initializeApp({});
    }

    var userNow2

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userNow2 = user
            update_checked_courses();
            console.log(user);
            add_user_name_on_nav(user);
            $("#logout-btn").css("display", "block");
            $("#login-btn").css("display", "none");
            
        } else {
            $("#hello-user").css("display","none");
            $("#logout-btn").css("display", "none");
            $("#login-btn").css("display", "block");
            console.log("not loging");
        }
    });
}
