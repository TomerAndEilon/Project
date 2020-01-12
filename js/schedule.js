

console.log("what hepand")
$(document).ready(function () {
    console.log("start");
    is_login();
    logout();
    update_data_to_profile();
    make_html_builds()
    make_graph();




    console.log("end!");
});
function make_html_builds(){
    function make_html_in_remove_couses(arr) {
        string_option = ""
        $("#choose-course").empty();
        for (let index = 0; index < arr.length; index++) {
            console.log('<option data-id='+arr[index].id+'>'+arr[index].name+'</option>');
            $("#choose-course").append(
                '<option data-id='+arr[index].id+'>'+arr[index].name+'</option>'
            );
            string_option +='<option data-id='+arr[index].id+'>'+arr[index].name+'</option>';
        }
        $("#choose-course").html(string_option).selectpicker('refresh');
    }
    var url_json_course ="https://tomerandeilon.github.io/Project/courses.json";

    requestURL = url_json_course;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'text'; // now we're getting a string!
    request.send();

    request.onload = function () {
        const arrText = request.response; // get the string from the response
        const arr = JSON.parse(arrText); // convert it to an object
        console.log(arr);
        make_html_in_remove_couses(arr)
    };
    
       

}
function make_graph() {
    function remove_node_with_list(graph){
        let list_to_remove = $('#choose-course option:selected').selectpicker('val');
        for (let i = 0; i < list_to_remove.length; i++) {
            for (let j = 0; j < graph.VertexList.length; j++) {
                if($(list_to_remove[i]).data('id')==graph.VertexList[j].getId()){
                    graph.deleteNode(graph.VertexList[j].getId());
                }
                                
            }
        }
    }
    function filter_all(list_vertex){
        list_vertex = filter_by_number_of_course(list_vertex);
        return list_vertex;
    }
    function filter_by_number_of_course(list_vertex) {

        function get_list_with_unquie_numer(size) {
            let list_number = [];
            let not_to_save_flag = true
            while (list_number.length < size) {
                not_to_save_flag = true
                number = Math.floor(Math.random()*list_vertex.length);
                for (let j = 0; j < list_number.length; j++) {
                    if (list_number[j]==number) {
                        list_number.splice(j, 1);
                        not_to_save_flag = false
                    }
                    
                }
                if(not_to_save_flag)
                list_number.push(number);
                
            }
            return list_number
        }
        function slice_by_list_index(list_vertex,number_list) {
           
            var list_to_return = [];
            for (let index = 0; index < number_list.length; index++) {
                list_to_return.push(list_vertex[number_list[index]]);
            }
            return list_to_return
        }
        let list_number_unqie
        if($('#choose-course-number').selectpicker('val') < list_vertex.length)
        {
             list_number_unqie = get_list_with_unquie_numer($('#choose-course-number').selectpicker('val'));
        }
        else{
             list_number_unqie = get_list_with_unquie_numer(list_vertex.length);
        }
        
        return slice_by_list_index(list_vertex,list_number_unqie)
        
    }
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
                '<td>'+list_vertex[index].getValue()+'</td>'+  
            ' </tr>'
            ); 
        }
        $("#table-row").css("display", "block");
        
    }
    // function build_Graph() {
    //     var g = new Graph();
    //     requestURL = "https://tomerandeilon.github.io/Project/datajsonvalue.json"
    //     var request = new XMLHttpRequest();
    //     request.open('GET', requestURL);
    //     request.responseType = 'text'; // now we're getting a string!
    //     request.send();
    // }
    var url_json_course ="https://tomerandeilon.github.io/Project/courses.json"


    $("#choose-for-me-btn").on("click", function () {
        console.log("in תציעל לי");
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
            let mikbaz =[];
            mikbaz.push('software');
            mikbaz.push('Signal Processing');
            for(i in arr){
                let obj = arr[i]
                for (let j = 0; j < obj.length; j++) {
                    if(mikbaz.includes(i))
                     g.addVertex(new Vertex(obj[j],2));
                     else if(i == 'General courses')
                     g.addVertex(new Vertex(obj[j],1));
                     else
                     g.addVertex(new Vertex(obj[j],3));
                }
            }
            const event = new Date();
            g.connectBetweenCourseslist();
            remove_node_with_list(g);
            // g.printGraph();
            var list_vertex = g.getRelevantCourses();
            //list_vertex =  filter_all(list_vertex);
            add_to_html_file_data_coures(list_vertex);
            
            
        }


    });

    $("#show-me-more").on("click", function () {
        var g = new Graph();
        requestURL = url_json_course;
        var request = new XMLHttpRequest();
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
            remove_node_with_list(g);
            // g.printGraph();
            var list_vertex = g.getRelevantCourses();
            list_vertex =  filter_all(list_vertex);
            add_to_html_file_data_coures(list_vertex);
            
            
        }


    });

    $("#show-me-all").on("click", function () {
       var g = new Graph();
        requestURL = url_json_course;
        var request = new XMLHttpRequest();
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
            remove_node_with_list(g);
            console.log("-=-=-=-=");
            
            // g.printGraph();
            
            var list_vertex = g.getRelevantCourses();
            add_to_html_file_data_coures(list_vertex);
            
            
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




