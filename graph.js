class Vertex {
    constructor(details,category) {
        this.details = details;
        this.name = details.name;
        this.id = details.id;
        this.value = details.value
        this.condition = details.condition;
        this.AdjInList = [];
        this.AdjOutList = [];
        this.category = category;
    }
    addToAdjOutList(v) {
        this.AdjOutList.push(v);
    }
    addToAdjInList(v) {
        this.AdjInList.push(v);
    }
    getAdjOutList() {
        return this.AdjOutList;
    }
    getAdjInList() {
        return this.AdjInList;
    }
    deleteInCond(v) {
        for (var i = 0; i < this.AdjInList.length; i++) {
            if (v.getId() == this.AdjInList[i].getId()) {
                this.AdjInList.splice(i, 1);
                return;
            }
        }
    }
    getName() {
        return this.name;
    }
    getCond() {
        return this.condition;
    }
    getId() {
        return this.id;
    }
    getValue() {
        return this.value;
    }
}

/********************************************************************************************************** */
class Graph {

    constructor() {
        this.VertexList = [];
    }
    addVertex(v) {
        this.VertexList.push(v);
    }
    addEdge(from, to) {
        var vartexFrom = this.getFromVertexList(from.getId());
        var vartexTo = this.getFromVertexList(to.getId());

        vartexFrom.addToAdjOutList(vartexTo);
        vartexTo.addToAdjInList(vartexFrom);
    }

    connectBetweenCourses() {
        for (var i = 0; i < this.VertexList.length; i++) {
            if (this.VertexList[i].getCond() != "") {
                for (var j = 0; j < this.VertexList.length; j++) {
                    if (this.VertexList[j].getId() == this.VertexList[i].getCond()) {
                        g.addEdge(this.VertexList[j], this.VertexList[i]);
                    }

                }
            }
        }
    }
    connectBetweenCourseslist() {
        for (var i = 0; i < this.VertexList.length; i++) {
            if ((Array.isArray(this.VertexList[i].getCond()) && this.VertexList[i].getCond().length)) {
                for (const [key, condobj] of Object.entries(this.VertexList[i].getCond())) {

                    for (var j = 0; j < this.VertexList.length; j++) {
                        if (this.VertexList[j].getId() == condobj) {
                            this.addEdge(this.VertexList[j], this.VertexList[i]);
                        }

                    }
                }

            }
        }
    }
    find(id) {
        for (const [key, vertex] of Object.entries(this.VertexList)) {
            if (vertex.getId() == id) {
                return vertex;
            }
        }
        return "not found " + id
    }
    find_by_name(name) {
        for (const [key, vertex] of Object.entries(this.VertexList)) {
            if (vertex.getName() == name) {
                return vertex;
            }
        }
        return "not found " + name
    }
    printGraph() {
        for (var i = 0; i < this.VertexList.length; i++) {
            var out = this.VertexList[i].getAdjOutList();
            var conc = "";
            for (var j = 0; j < out.length; j++)
                conc += out[j].getName() + " ";

            console.log("course:" + this.VertexList[i].getName() + " -> " + "in:" + conc);
        }
    }

    printRelevantCourses() {
        console.log('relvant courses')
        for (var i = 0; i < this.VertexList.length; i++) {
            var inCond = this.VertexList[i].getAdjInList();
            if (inCond.length == 0)
                console.log(this.VertexList[i].name + "  ");
        }
    }
    getRelevantCourses() {
      
        var list_ver = new Array()
        
        for (var i = 0; i < this.VertexList.length; i++) {
            var inCond = this.VertexList[i].getAdjInList();
            if (inCond.length == 0){
                list_ver.push(this.VertexList[i]);
            }
        }
        list_ver.sort(function(a, b){
            if(a.category < b.category) return -1;
            if(a.category > b.category) return 1;
            return 0;
        })
        return list_ver
    }

    getFromVertexList(id) {
        for (var i = 0; i < this.VertexList.length; i++) {
            if (this.VertexList[i].getId() == id)
                return this.VertexList[i];
        }
    }
    deleteNode(nodeId) {
        for (var i = 0; i < this.VertexList.length; i++) {
            if (this.VertexList[i].getId() == nodeId) {
                var out = this.VertexList[i].getAdjOutList();
                for (var j = 0; j < out.length; j++) {
                    var vertex = this.getFromVertexList(out[j].getId());
                    vertex.deleteInCond(this.VertexList[i]);
                }
                this.VertexList.splice(i, 1);
                return;
            }
        }
    }

    // bfs(v) 
    // dfs(v) 
}

// var g = new Graph();
// //http://myjson.com/ you can change it with this web
// requestURL = "https://tomerandeilon.github.io/Project/datajson.json"
// let request = new XMLHttpRequest();
// request.open('GET', requestURL);
// request.responseType = 'text'; // now we're getting a string!
// request.send();

// request.onload = function () {
//     const arrText = request.response; // get the string from the response
//     const arr = JSON.parse(arrText); // convert it to an object
//     console.log(arr);
//     runG(arr);
// };

// var arr = [{
//     "id": 1,
//     "name": "פייתון",
//     "condition": [],
// },
// {
//     "id": 2,
//     "name": "לינארית",
//     "condition": [],
// },
// {
//     "id": 3,
//     "name": "ספרתיות",
//     "condition": [],
// },
// {
//     "id": 4,
//     "name": "דיסקרטית",
//     "condition": [],
// },
// {
//     "id": 5,
//     "name": "מודרנית",
//     "condition": ["3"],
// },
// {
//     "id": 6,
//     "name": "c++",
//     "condition": [],
// }];
// var vertices = JSON.stringify(arr);
// console.log(arr);
// runG(arr)
// function runG(arr) {
//     for (i in arr) {
//         g.addVertex(new Vertex(arr[i]));
//     }

//     const event = new Date();

//     console.log(event.toString());

//     g.connectBetweenCourseslist();
//     g.printGraph();
//     // g.printRelevantCourses();
//     // console.log("now we finish with python and discrtit");
//     // g.deleteNode(1);
//     // g.deleteNode(4);
//     // g.printRelevantCourses();
//     console.log(g.VertexList);
//     console.log(g.find("1"));
//     console.log(g.find("5"));
//     console.log("=====");

//     g.printRelevantCourses();
//     console.log("=====");
//     g.deleteNode(3);
//     console.log(g.find("1"));

//     console.log("=====");

//     g.printRelevantCourses();
//     console.log("=====");
// }
