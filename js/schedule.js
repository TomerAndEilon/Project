var url_json_course ="https://tomerandeilon.github.io/Project/tomerJson.json"
var currentCourses;
var user_uid_main;
$(document).ready(function () {
    isLogin();
    logout();
    updateDataToProfile();
    // buildGraph();
});

function buildGraph() {
        var g = new Graph();
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
            function build_graph_and_delete(params,arr) {
                console.log(arr);
                for(i in arr){
                    let obj = arr[i]
                    for (let j = 0; j < obj.length; j++) {
                        if(params["list_pro_coures"] && params["list_pro_coures"].includes(i)){
                            g.addVertex(new Vertex(obj[j],2));
                            console.log(i)
                        } 
                         else if(i == 'General courses')
                         g.addVertex(new Vertex(obj[j],1));
                         else
                         g.addVertex(new Vertex(obj[j],3));
                    }
                }
                const event = new Date();
                if(params["list_done_coures"]){
                    for (let i = 0; i < params["list_done_coures"].length; i++) {
                        var number = params["list_done_coures"][i];
                        const numberPattern =/\d+/g;
                        console.log(numberPattern);
                        console.log(number);
                        
                        var valid = String(number).match( numberPattern )
                        console.log(valid)
                        g.deleteNode(valid)
                        
                    }
                }
               
                g.connectBetweenCourses();
                currentCourses = g.getRelevantCourses();
             
            }
                let userId = firebase.auth().currentUser.uid;
                firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                let params_data =  snapshot.val();
                build_graph_and_delete(params_data,arr);
            });
            
        }
   
   
    

}
function addTheRelavantCourseToHtmlPage(list_vertex,filterNumber) {
    if(!list_vertex) return;
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
    let lengthDispaly = filterNumber > list_vertex.length?list_vertex.length:filterNumber;
    for (let index = 0; index < lengthDispaly; index++) {
        
        $("#in-data-table").append(
            '<tr>'+
            '<th scope="row">'+list_vertex[index].getId()+'</th>' +
            '<td>'+list_vertex[index].getName()+'</td>'+
            '<td>'+list_vertex[index].getValue()+'</td>'+  
        ' </tr>'
        ); 
    }
    $("#table-row").css("display", "block");
    
}
$("#choose-for-me-btn").on("click", function () {
    let e = document.getElementById("numberOfCourses");
    let strUser = e.options[e.selectedIndex].value;
    addTheRelavantCourseToHtmlPage(currentCourses,strUser);
});

$("#show-me-all").on("click", function () {
    addTheRelavantCourseToHtmlPage(currentCourses,currentCourses.length);
});


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




