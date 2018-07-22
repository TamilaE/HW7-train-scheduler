// variables
var tName = "";
var tDestination = "";
var tTime = "";
var tFrequency = "";
var nextArrival = "";
var minAway = "";
var trainName = $("#name");
var trainDestination = $("#destination");
// using .mask
var trainTime = $("#time").mask("00:00:00");
var trainFrequency = $("#frequency").mask("00");

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyA5xdvgsYmHg_wuh7ZjyCpy8BURNr2OZxo",
    authDomain: "train-schedual-tami.firebaseapp.com",
    databaseURL: "https://train-schedual-tami.firebaseio.com",
    projectId: "train-schedual-tami",
    storageBucket: "train-schedual-tami.appspot.com",
    messagingSenderId: "583515134636"
  };
  firebase.initializeApp(config);
// every infos in database will be under the variable called database
var database = firebase.database();

database.ref().on("child_added", function(snapshot) {
    // variables for storing data from firebase
    var difference = 0;
    var reminder = 0;
    var minTillArrival = "";
    var nextTrain = "";
    var freq = snapshot.val().frequency;

    // calculating time difference between now and when the first train comes.
    difference = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // calculating time reminder
    reminder = difference % freq;

    // calculating min till arrive
    minTillArrival = freq - reminder;

    // calculating the time that next train will come
    nextTrain = moment().add(minTillArrival, "m").format("hh:mm A");

    // adding data to our table
    $("table-data").append(
    "<tr><td>" + snapshot.val().name + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" +
    "<td>" + freq + "</td>" +
    "<td>" + minTillArrival + "</td>" +
    "<td>" + nextTrain + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

    $("#table-data").on("click", "tr span", function() {
    console.log(this);
    var trainRef = database.ref();
    console.log(trainRef);
    });
});
// submit button functionality 
var storeInputs = function(event) {
    event.preventDefault();

tName = trainName.val().trim();
tDestination = trainDestination.val().trim();
tTime = moment(trainTime.val().trim(), "HH:mm").subtract(1,"years").format("X");
tFrequency = trainFrequency.val().trim();

database.ref().push({
    name: tName,
    destination: tDestination,
    time: tTime,
    frequency: tFrequency,
    nextArrival: nextArrival,
    minutesAway: minAway,
    date_added: firebase.database.ServerValue.TIMESTAMP
});

// alert
alert("Train added! YAY!");

// reset the form
trainName.val("");
trainDestination.val("");
trainTime.val("");
trainFrequency.val("");
};

// call function submit
$("#btn-add").on("click", function(event) {
    if(trainName.val().length === 0 || trainDestination.val().length === 0 || trainTime.val().length === 0 || trainFrequency === 0) {
        alert("please fill all the blank spaces in the form! Thanks");
    }
    else{
        storeInputs(event);
    }
});
$("form").on("keypress", function(event) {
    if (event.which === 13) {
        if (trainName.val().length === 0 || trainDestination.val().length === 0 || trainTime.val().length === 0 || trainFrequency === 0) {
            alert("please fill all the blank spaces in the form! Thanks");
        } else {
            storeInputs(event);
        }
    }
});
