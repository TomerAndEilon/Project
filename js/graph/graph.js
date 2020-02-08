class Vertex {
    constructor(details, category) {
        if (details) {
            this.details = details;
            this.name = details.name;
            let prevId = details.id
            var numberPattern = /\d+/g;
            let validId = prevId.match(numberPattern)
            this.id = validId;
            console.log(this.id)
            this.value = details.value
            this.condition = details.condition;
            this.visitedCounter = 0;
            this.visited = false;
            this.done = false;

        }
        this.AdjInList = [];
        this.AdjOutList = [];
        if (category)
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
    getCatcgory() {
        return this.category;
    }
    setCatcgory(category) {
        this.category = category;
    }
    getVisited() {
        return this.visited;
    }
    setVisited() {
        this.visited = true;
    }
    entry() {
        this.visitedCounter = this.visitedCounter + 1;
    }
    getDone() {
        return this.done;
    }
    setDone(flag) {
        this.done = flag;
    }
}

/********************************************************************************************************** */
class Graph {

    constructor() {
        this.VertexList = [];
        this.allCoursesNames = [];
        this.start = new Vertex();
    }
    addVertex(v) {
        let oldVertex = this.find(v.getId());
        if (oldVertex == null) {
            this.VertexList.push(v);
            this.allCoursesNames.push(v.getName());
        }
        else {
            this.pickOne(v, oldVertex);
        }
    }
    addEdge(from, to) {
        var vartexFrom = this.getFromVertexList(from.getId());
        var vartexTo = this.getFromVertexList(to.getId());
        vartexFrom.addToAdjOutList(vartexTo);
        vartexTo.addToAdjInList(vartexFrom);
    }
    addEdgeBfs(from, to) {
        from.addToAdjOutList(to);
        to.addToAdjInList(from);
    }
    pickOne(newVertex, oldVertex) {
        if (newVertex.getCatcgory() < oldVertex.getCatcgory()) {
            oldVertex.setCatcgory(newVertex.getCatcgory());
        }
    }
 
    connectBetweenCoursesBfs() {
        for (var i = 0; i < this.VertexList.length; i++) {
            if (this.VertexList[i].getCond() != "") {
                for (var j = 0; j < this.VertexList.length; j++) {
                    let conditions = this.VertexList[i].getCond();
                    let id = this.VertexList[j].getId();
                    for (let k = 0; k < conditions.length; k++) {
                        if (this.arraysEqual(this.VertexList[j].getId(),conditions[k])) {
                            this.addEdgeBfs(this.VertexList[j], this.VertexList[i]);
                        }
                    }


                }
            }
            else {
                this.addEdgeBfs(this.start, this.VertexList[i]);

            }
        }
    }
  
    find(id) {
        for (const [key, vertex] of Object.entries(this.VertexList)) {
            if (this.arraysEqual(vertex.getId(), id)) {
                return vertex;
            }
        }
        return null;
    }
    find_by_name(name) {
        for (const [key, vertex] of Object.entries(this.VertexList)) {
            if (this.arraysEqual(vertex.getName(), name)) {
                return vertex;
            }
        }
        return "not found " + name
    }
    
    getRelevantCoursesBfs() {

        var list_ver = new Array()

        for (let j = 0; j < this.VertexList.length; j++) {
            if(this.VertexList[j].visitedCounter == this.VertexList[j].getAdjInList().length && this.VertexList[j].getDone() == false){
                list_ver.push(this.VertexList[j]);
            }
        }
        list_ver.sort(function (a, b) {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            return 0;
        })
        return list_ver
    }

    getFromVertexList(id) {
        for (var i = 0; i < this.VertexList.length; i++) {
            if (this.arraysEqual(this.VertexList[i].getId(), id))
                return this.VertexList[i];
        }
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        a = a.toString();
        b = b.toString();
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    deleteNodeBfs(nodeId) {
        for (var i = 0; i < this.VertexList.length; i++) {
            if (this.arraysEqual(this.VertexList[i].getId(), nodeId) == true) {
                this.VertexList[i].setDone(true);
            }
        }
    }

    getAllVertexList() {
        return this.VertexList;
    }

    bfs() {
        // Create an object for queue 
        var q = new Queue();
        // add the starting node to the queue 
        q.enqueue(this.start);

        // loop until queue is element 
        while (!q.isEmpty()) {
            // get the element from the queue 
            var getQueueElement = q.dequeue();

            // passing the current vertex to callback funtion 
            // getQueueElement.visited();
            // get the adjacent list for current vertex 
            var get_List = getQueueElement.getAdjOutList();

            // loop through the list and add the element to the 
            // queue if it is not processed yet 
            for (var i in get_List) {
                var neigh = get_List[i];
                neigh.entry();
                if(neigh.getVisited() == false)
                if (neigh.getDone() == true) {
                    neigh.setVisited(true);
                    q.enqueue(neigh);
                }
            }
        }
    }

    // bfs(v) 
    // dfs(v) 
}

class Queue {
    // Array is used to implement a Queue 
    constructor() {
        this.items = [];
    }

    // Functions to be implemented 
    enqueue(element) {
        // adding element to the queue 
        this.items.push(element);
    }     // dequeue() 
    dequeue() {
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0;
    }     // printQueue() 
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
