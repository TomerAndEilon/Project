var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json"
var allCourses = [];
$(document).ready(function () {
    getAllCoursesName();
    isLogin();
    logout();
    updateDataToProfile();

});

function getAllCoursesName() {
    let requestURL = url_json_course;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json'; // now we're getting a string!
    request.send();

    request.onload = function () {
        const arrText = request.response;
        createArray(arrText);
    };
    function createArray(arr) {
        for (i in arr) {
            let obj = arr[i]
            for (let j = 0; j < obj.length; j++) {
                allCourses.push(obj[j]);
            }
        }
    }

}




/***************************FireBase Function********************************** */
function isLogin() {
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
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            user_uid_main = user.uid
            getDoneCourses();

            $("#logout-btn").css("display", "block");
            $("#login-btn").css("display", "none");

        } else {
            $("#hello-user").css("display", "none");
            $("#logout-btn").css("display", "none");
            $("#login-btn").css("display", "block");
        }
    });
}

function logout() {
    $("#logout-btn").on("click", function () {
        var user = firebase.auth().currentUser;
        firebase.auth().signOut().then(function () {
            console.log("logout successful")
        }).catch(function (error) {
            console.log("logout error " + error);
        });
    });
}

function updateDataToProfile() {
    setTimeout(function () {
        var user = firebase.auth().currentUser;
        if (user.displayName == null) {
            user.updateProfile({
                displayName: localStorage.getItem("fullname")
            }).then(function () {
                console.log("work update user name");
            }).catch(function (error) {
                // An error happened.
                console.log("error update user name");
            });
        }
    }, 1000);
}


function moveToFlow(id) {
    localStorage.setItem("answerCourseId", id);
    localStorage.setItem("answerCourseName", getCourseName(id));
    window.location.href = "ratingFlow.html";
}

function getDoneCourses() {
    let userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
        params_data = snapshot.val();
        writeDoneCourseToHtml(params_data);
    });
}

function writeDoneCourseToHtml(params_data) {
    let listCourse = "";
    let doneCourses = params_data["list_done_coures"];
    for (let i = 0; i < doneCourses.length; i++) {
        if (!isRated(doneCourses[i]))
            listCourse += "<li><a class=checkBox href=# onclick='javascript:moveToFlow(id);' id=" + doneCourses[i] + ">" + getCourseName(doneCourses[i]) + "</a></li>";

    }
    document.getElementById("course-list").innerHTML = listCourse;
    removeLoader();
}
function isRated(id) {
    let ratedCourses = params_data["rating"];
    for (const key in ratedCourses) {
        if (arraysEqual(key, id))
            return true;
    }
    return false;
}
function removeLoader() {
    document.getElementById("loader").style.display = "none";
}

function getCourseName(id) {
    for (let i = 0; i < this.allCourses.length; i++) {
        if (arraysEqual(id, this.allCourses[i].id)) {
            return this.allCourses[i].name;
        }

    }
}

function arraysEqual(id1, id2) {
    let a = String(id1).trim();
    let b = String(id2).trim();
    if (a === b) return true;
    if (a == null || b == null) return false;
    // if (a.length != b.length) return false;
    let len = a.length < b.length ? a.length : b.length;
    for (var i = 0; i < len; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}


