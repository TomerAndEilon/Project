var url_json_course = "https://tomerandeilon.github.io/Project/tomerJson.json"
var url_json_sort_by_semster = "https://tomerandeilon.github.io/Project/sort_by_semster.json"
var currentCourses;
var user_uid_main;
var params_data;
var graph;
var listDoneCorses;
var allCoursesJson;
var checkedCourse = [];
var checkedCourseNames = [];
var coursesBySemster;
$(document).ready(function () {
    isLogin();
    logout();
    updateDataToProfile();
    getSortedCoursesBySemster();

});

function buildGraph() {
    graph = new Graph();
    requestURL = url_json_course;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json'; // now we're getting a string!
    request.send();

    request.onload = function () {
        const arrText = request.response;
        runG(arrText);
    };


    function runG(arr) {
        function build_graph_and_delete(params, arr) {
            for (i in arr) {
                let obj = arr[i]
                for (let j = 0; j < obj.length; j++) {
                    if (params["list_pro_coures"] && params["list_pro_coures"].includes(i)) {
                        graph.addVertex(new Vertex(obj[j], 2));
                    }
                    else if (i == 'Required')
                        graph.addVertex(new Vertex(obj[j], 1));
                    else
                        graph.addVertex(new Vertex(obj[j], 3));
                }
            }
            listDoneCorses = params["list_done_coures"];
            graph.connectBetweenCoursesBfs();
            if (params["list_done_coures"]) {
                for (let i = 0; i < params["list_done_coures"].length; i++) {
                    var number = params["list_done_coures"][i];
                    const numberPattern = /\d+/g;
                    var valid = String(number).match(numberPattern)
                    graph.deleteNodeBfs(valid)
                }
            }
            graph.bfs();
            currentCourses = graph.getRelevantCoursesBfs();
            document.getElementById("loader").style.display = "none";

        }
        let userId = firebase.auth().currentUser.uid;
        firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            params_data = snapshot.val();
            allCoursesJson = arr;
            build_graph_and_delete(params_data, arr);
        });

    }
}
function add(course) {
    if (course.checked) {
        let allCourses = graph.getAllVertexList();
        this.checkedCourse.push(course.id);
    } else {
        for (let i = 0; i < this.checkedCourse.length; i++) {
            if (this.arraysEqual(course.id, this.checkedCourse[i])) {
                this.checkedCourse.splice(i, 1);
                break;
            }
        }
    }
}
function markTheSelcetCourse() {
    for (let i = 0; i < this.checkedCourse.length; i++) {
        let course = document.getElementById(this.checkedCourse[i]);
        if (course) {
            course.checked = true;
        }


    }
}
/***************************************print to html page function ******************************/
function addTheRelavantCourseToHtmlPage(list_vertex, filterNumber) {
    if (!list_vertex) return;
    $("#table-coures").empty();
    $("#table-coures").append(
        '<thead " class="thead-dark">' +
        '<tr>' +
        '<th scope="col"></th>' +
        '<th scope="col">מזהה קורס</th>' +
        '<th scope="col">קורסים</th>' +
        '<th scope="col">נקודות זכות</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody id="in-data-table"></tbody>');
    let lengthDispaly = filterNumber > list_vertex.length ? list_vertex.length : filterNumber;
    let duplicate = [];
    for (let index = 0; index < lengthDispaly; index++) {
        if (!contains(duplicate, list_vertex[index].getId())) {
            $("#in-data-table").append(
                '<tr>' +
                '<th><input ‫ class="checkthis" type="checkbox" id = ' + list_vertex[index].getId() + ' onchange=add(this) ></th>' +
                '<th scope="row">' + list_vertex[index].getId() + '</th>' +
                '<td>' + list_vertex[index].getName() + '</td>' +
                '<td>' + list_vertex[index].getValue() + '</td>' +
                ' </tr>'
            );

            duplicate.push(list_vertex[index].getId());
        }
    }
    this.markTheSelcetCourse();
    $("#table-row").css("display", "block");

}
function createTree() {
    var toggler = document.getElementsByClassName("caret");
    let allCourses = graph.getAllVertexList();
    let doneCourses = listDoneCorses;
    let duplicateMap = []
    let htmlVar =
        '<ul id="myUL">' +
        '<li><span class="caret">קורסים שנותרו</span>' +
        '<ul class="nested">' +
        '<li><span class="caret">חובה</span>' +
        '<ul class="nested">';
    for (let i = 0; i < allCourses.length; i++) {
        if (allCourses[i].getCatcgory() == 1) {
            if (doneCourses == null || !contains(doneCourses, allCourses[i].getId())) {
                htmlVar += '<li>' + allCourses[i].getName() + '</li>'
                duplicateMap.push(allCourses[i].getId());
            }
        }

    }
    htmlVar += '</ul>' + '</li>';

    htmlVar += '<li><span class="caret">מקבץ</span>' +
        '<ul class="nested">';
    let required = [];
    let nonRequired = [];
    if (params_data["list_pro_coures"] != null) {
        for (let i = 0; i < params_data["list_pro_coures"].length; i++) {//pass on requred
            let mikbaz = params_data["list_pro_coures"][i];
            let toHtml = '<li><span class="caret">' + mikbaz + '</span>' + '<ul class="nested">';
            let listOfCurrentMikbaz = allCoursesJson[mikbaz];
            let total = "";
            for (let i = 0; i < listOfCurrentMikbaz.length; i++) {
                let id = listOfCurrentMikbaz[i].id;
                if (doneCourses == null || !contains(doneCourses, id)) {
                    if (listOfCurrentMikbaz[i].required == "1") {
                        total += '<li>' + listOfCurrentMikbaz[i].name + '</li>';
                        duplicateMap.push(listOfCurrentMikbaz[i].id)
                    }
                }
            }
            toHtml += '<li><span class="caret">' + 'חובה' + '</span>' + '<ul class="nested">';
            toHtml += total;
            toHtml += '</ul>' + '</li>';
            required.push(toHtml);
        }
    }
    if (params_data["list_pro_coures"] != null) {
        for (let i = 0; i < params_data["list_pro_coures"].length; i++) {//pass on requred
            let mikbaz = params_data["list_pro_coures"][i];
            let toHtml = ""
            let listOfCurrentMikbaz = allCoursesJson[mikbaz];
            let total = "";
            for (let i = 0; i < listOfCurrentMikbaz.length; i++) {
                let id = listOfCurrentMikbaz[i].id;
                if (doneCourses == null || !contains(doneCourses, id)) {
                    if (listOfCurrentMikbaz[i].required == "0") {
                        total += '<li>' + listOfCurrentMikbaz[i].name + '</li>';
                        duplicateMap.push(listOfCurrentMikbaz[i].id)
                    }
                }
            }
            toHtml += '<li><span class="caret">' + 'בחירה' + '</span>' + '<ul class="nested">';
            toHtml += total;
            toHtml += '</ul>' + '</li>';
            toHtml += '</ul>' + '</li>';

            nonRequired.push(toHtml);
        }
    }

    for (let i = 0; i < required.length; i++) {
        htmlVar += required[i];
        htmlVar += nonRequired[i];
    }


    htmlVar += '</ul>' + '</li>';
    htmlVar += '<li><span class="caret">כללי</span>' +
        '<ul class="nested">';
    for (let i = 0; i < allCourses.length; i++) {
        if (allCourses[i].getCatcgory() == 3) {
            if (doneCourses == null || !contains(doneCourses, allCourses[i].getId())) {
                if (!contains(duplicateMap, allCourses[i].getId())) {
                    htmlVar += '<li>' + allCourses[i].getName() + '</li>'
                    duplicateMap.push(allCourses[i].getId());
                }
            }
        }

    }
    htmlVar += '</ul>' + '</li>';

    htmlVar += '</ul>' + '</li>' + '</ul>';

    document.getElementById("genralTree").innerHTML = htmlVar;
    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
}
$("#choose-for-me-btn").on("click", function () {
    let e = document.getElementById("numberOfCourses");
    let strUser = e.options[e.selectedIndex].value;
    let sortBySemster = deleteCourseThatNotRelaventToThisSemster(currentCourses);
    addTheRelavantCourseToHtmlPage(sortBySemster, strUser);
    createTree();
    document.getElementById("save-button").style.display = "block";

});

$("#show-me-all").on("click", function () {
    let sortBySemster = deleteCourseThatNotRelaventToThisSemster(currentCourses);
    addTheRelavantCourseToHtmlPage(sortBySemster, sortBySemster.length);
});
$("#upper-me").on("click", function () {
    let e = document.getElementById("numberOfCourses");
    let strUser = e.options[e.selectedIndex].value;
    let sortBySemster = deleteCourseThatNotRelaventToThisSemster(currentCourses);
    addTheRelavantCourseToHtmlPage(sortBySemster, strUser);
});
$("#save-button").on("click", function () {
    writeUserData();
});


function deleteCourseThatNotRelaventToThisSemster(listCourse) {
    let e = document.getElementById("semster");
    let otherSemster = e.options[e.selectedIndex].value == "א" ? "SpringSemster" : "WinterSemster";
    //check if some of the courses exist in the other semster
    let listOfCoursesInAntoherSemster = coursesBySemster[otherSemster];
    let sortedList = [];
    for (let i = 0; i < listCourse.length; i++) {//for all course check if exist in another semster
        let contains = false;
        for (let j = 0; j < listOfCoursesInAntoherSemster.length; j++) {
            let id1 = String(listCourse[i].id).trim();
            let id2 = String(listOfCoursesInAntoherSemster[j].id).trim();
            if (arraysEqual(id1, id2))
                contains = true;
        }
        if (!contains)
            sortedList.push(listCourse[i]);
    }
    return sortedList;
}
function getSortedCoursesBySemster() {
    requestURL = url_json_sort_by_semster;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json'; // now we're getting a string!
    request.send();

    request.onload = function () {
        coursesBySemster = request.response;

    };
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
            buildGraph();

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

/********************************equal function******************************************** */
function contains(a, obj) {
    var i = a.length;
    while (i--) {
        let id1 = String(a[i]).trim();
        let id2 = String(obj).trim();
        if (arraysEqual(id1, id2)) {
            return true;
        }
    }
    return false;
}
function containsCourse(a, obj) {
    var i = a.length;
    while (i--) {
        let id1 = String(a[i]).trim();
        console.log(Array.isArray(a[0]))
        let id2 = String(obj).trim();
        if (arraysEqual(id1, id2)) {
            return true;
        }
    }
    return false;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    // if (a.length != b.length) return false;
    let len = a.length < b.length ? a.length : b.length;
    for (var i = 0; i < len; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

/************************write select course to db ********************/
function writeUserData() {
    let userId = firebase.auth().currentUser.uid;
    let e = document.getElementById("semster");
    let semster = e.options[e.selectedIndex].value == "א" ? "first" : "second";
    this.checkedCourseNames = [];
    for (let i = 0; i < this.checkedCourse.length; i++) {
        this.checkedCourseNames.push(this.graph.find(this.checkedCourse[i]).getName());
    }
    firebase.database().ref('users/' + userId + '/list_select_course/' + semster).set(this.checkedCourseNames);
    alert("הנתונים נשמרו בהצלחה,ניתן לראות אותם בפרופיל האישי")


}

