

console.log("what hepand")
$(document).ready(function () {
    console.log("start");
    is_login();
    logout();
    update_data_to_profile();
    console.log("ready!");
    choose_course();
    choose_course_number();
    make_graph();




    console.log("end!");
});

function make_graph() {
    function add_to_html_file_data_coures(list_vertex) {
        $("#table-coures").empty();
        $("#table-coures").append(
            '<thead " class="thead-dark">'+
            '<tr>'+
            '<th scope="col">#</th>'+
            '<th scope="col">קורסים</th>'+
            '<th scope="col">נקודות זכות</th>'+
            '</tr>'+
            '</thead>'+
            '<tbody id="in-data-table"></tbody>');

        for (let index = 0; index < list_vertex.length; index++) {
            
            $("#in-data-table").append(
                '<tr>'+
                '<th scope="row">'+(index+1)+'</th>' +
                '<td>'+list_vertex[index].getName()+'</td>'+
                '<td>5</td>'+  
            ' </tr>'
            ); 
        }
        $("#table-row").css("display", "block");
        
    }
    $("#choose-for-me-btn").on("click", function () {
        var g = new Graph();
        requestURL = "https://tomerandeilon.github.io/Project/datajson.json"
        let request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'text'; // now we're getting a string!
        request.send();

        request.onload = function () {
            const arrText = request.response; // get the string from the response
            const arr = JSON.parse(arrText); // convert it to an object
            runG(arr);
        };

       
        function runG(arr) {
            for (i in arr) {
                g.addVertex(new Vertex(arr[i]));
            }
            const event = new Date();
            g.connectBetweenCourseslist();
            // g.printGraph();
            var list_vertex = g.getRelevantCourses()
            
            add_to_html_file_data_coures(list_vertex)
            
            
        }


    });
}

function if_have_user_name_show_me(user) {
    setTimeout(function () {
        if (user.displayName != null) {
            $("#hello-user").text("שלום " + user.displayName);
            $("#hello-user").css("display", "block");
        }
    }, 1000);

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
function update_data_to_profile() {
    setTimeout(function () {
        var user = firebase.auth().currentUser;
        console.log(user.displayName)
        console.log(localStorage.getItem("fullname"))
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
        if_have_user_name_show_me(user)
    }, 3000);
}
function is_login() {
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
            console.log(user);
            $("#logout-btn").css("display", "block");
            $("#login-btn").css("display", "none");

        } else {
            $("#hello-user").css("display", "none");
            $("#logout-btn").css("display", "none");
            $("#login-btn").css("display", "block");
            console.log("not loging");
        }
    });
}


function choose_course() {
    var mySelect = $('#choose-course');
    $('#choose-info').on('click', function () {
        localStorage.setItem("course_allready_done", mySelect.selectpicker('val'))
        console.log(mySelect.selectpicker('val'));
        mySelect.selectpicker('refresh');
    });
    //reset btn
    $("#choose-reset-btn").on('click', function () {
        console.log("in the reset btn")
        mySelect.selectpicker('deselectAll');
    })

}
function choose_course_number() {
    var mySelect = $('#choose-course-number');
    $('#choose-info-number').on('click', function () {
        localStorage.setItem("course_number", mySelect.selectpicker('val'))
        console.log(mySelect.selectpicker('val'));
        mySelect.selectpicker('refresh');
    });
    //reset btn
    $("#choose-number-reset-btn").on('click', function () {
        console.log("in the reset btn")
        mySelect.selectpicker('deselectAll');
    })

}