// Initialize Firebase
// Initialize Firebase

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyD-puNAcX1gmoj_S_lSAYWmJCzZiDr7uBI",
    authDomain: "train-schedualer-updated1.firebaseapp.com",
    databaseURL: "https://train-schedualer-updated1.firebaseio.com",
    projectId: "train-schedualer-updated1",
    storageBucket: "",
    messagingSenderId: "55133869552"
  };
  firebase.initializeApp(config);

var database = firebase.database();
    
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;
var trainIDs = [];

// current time
var datetime = null,
date = null;

var update = function() {
    date = moment(new Date())
    datetime.html(date.format("dddd, MMMM Do YYYY, h:mm:ss a"));
};

$(document).ready(function() {
    datetime = $("#current-status");
    update();
    setInterval(update, 1000);
});

// when button clicked ...
$("#add-train").on("click", function() {
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#train-time").val().trim();
    frequency = $("#frequency").val().trim();
    
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log("FIRST TIME CONVERTED:", firstTimeConverted);

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("TIME DIFFERENCE:", diffTime);

    var tRemainder = diffTime % frequency;
    console.log("tReainder", tRemainder);

    var minutesAway = frequency - tRemainder;
    console.log( "Minutes AWAY:", minutesAway);

    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("ARIVAL TIME:", moment(nextTrain).format("hh:mm"));

	var nextArrival = moment(nextTrain).format("hh:mm a");
	var nextArrivalUpdate = function() {
        date = moment(new Date())
        datetime.html(date.format('hh:mm a'));
    }

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        minutesAway: minutesAway,
        nextArrival: nextArrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Submitted!");

    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");
	
	return false;           
});
// pinaple
database.ref().orderByChild("dateAdded").limitToLast(25).on("child_added", function(snapshot) {
  
    console.log("Train name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First train: " + snapshot.val().firstTrainTime);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next train: " + snapshot.val().nextArrival);
    console.log("Minutes away: " + snapshot.val().minutesAway);
    console.log("=====================================");

    $("#new-train").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" + 
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
    "</td></tr>");
    
    index++;
}, 
    
function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
    
//Gets the train IDs in an Array
database.ref().once('value', function(dataSnapshot) { 
    var trainIndex = 0;
    dataSnapshot.forEach(
        function(childSnapshot) {
            trainIDs[trainIndex++] = childSnapshot.key();
        }
    );
});
    
// console.log(trainIDs);
    
