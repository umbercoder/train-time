  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBj9yndrCYS8DpJZE7QRWd8KJUXlGeqr9g",
    authDomain: "train-bd43e.firebaseapp.com",
    databaseURL: "https://train-bd43e.firebaseio.com",
    projectId: "train-bd43e",
    storageBucket: "",
    messagingSenderId: "708633485515"
  };
  firebase.initializeApp(config);







var database = firebase.database();
var name ='';
var destination = '';
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';
var keyHolder = '';
var getKey = '';


$(document).ready(function() {

    //anonymous sign on
    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });


     $("#add-train").on("click", function() {
     	// YOUR TASK!!!
     	// Code in the logic for storing and retrieving the most recent user.
     	// Dont forget to provide initial data to your Firebase database.
     	name = $('#name-input').val().trim();
     	destination = $('#destination-input').val().trim();
     	firstTrainTime = $('#first-train-time-input').val().trim();
     	frequency = $('#frequency-input').val().trim();
          firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
          currentTime = moment();
          diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          tRemainder = diffTime % frequency;
          minutesTillTrain = frequency - tRemainder;
          nextTrain = moment().add(minutesTillTrain, "minutes");
          nextTrainFormatted = moment(nextTrain).format("hh:mm");

     	// Code for the push
     	keyHolder = database.push({
     		name: name,
     		destination: destination,
     		firstTrainTime: firstTrainTime,  
     		frequency: frequency,
               nextTrainFormatted: nextTrainFormatted,
               minutesTillTrain: minutesTillTrain
     	});


        $('#name-input').val('');
     	$('#destination-input').val('');
     	$('#first-train-time-input').val('');
     	$('#frequency-input').val('');

     	return false;
     });
         
    database .on("child_added", function(childSnapshot) {
    
        

		$('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().name +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted +  
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain +  
               "</td>" +
               "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
          "</tr>");

}, function(errorObject){
	
});

$("body").on("click", ".remove-train", function(){
     $(this).closest ('tr').remove();
     getKey = $(this).parent().parent().attr('id');
     database.child(getKey).remove();
});

});