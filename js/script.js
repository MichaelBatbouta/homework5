/*
File: script.js
functions using jQuery to drive the game of scrabble via Drag N Drop
Michael Batbouta, UMass Lowell Computer Science, Michael_batbouta@student.uml.edu
Copyright (c) 2021 by Wenjin. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by Michael Batbouta on august 15, 2021 at 10:00pm
resources used:
used for drag and drop options: https://jqueryui.com/droppable/#visual-feedback
multple dragg https://stackoverflow.com/questions/50604904/drag-image-on-multiple-droppable-div-with-same-class
revert on button: https://stackoverflow.com/questions/10014196/jquery-draggable-revert-on-button-click
snap to: https://stackoverflow.com/questions/11388679/how-do-i-force-jquery-to-center-an-element-when-it-is-dragged-to-and-snapped-to
https://stackoverflow.com/questions/26746823/jquery-ui-drag-and-drop-snap-to-center
reverting - https://jqueryui.com/draggable/#revert
reverting - https://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of
score - https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
array managment - https://www.tutorialspoint.com/in-javascript-how-to-empty-an-array

*/
$( function() {
  //variables to be used
  var tilePool = [];
  var currentLengthRack = 0;
  var currentLengthBoard = 0;
  var rack = [];
  var board = [];
  var word = "";
  var score = 0;
  var tScore = 0;
  var tileCount = 0;
  var lowerLimit = 0;
  var upperLimit = 0;
  var isDoubled = 0;

  //get JSON and start the game
$.get("https://michaelbatbouta.github.io/homework5/js/pieces.json")
  .done(function(response) {
    tileJSON = response.pieces;
    startgame();
  });

  function startgame(){
    fillTilePool();
    loadTiles();
  }

  function fillTilePool(){
    for(i = 0; i < 27; i++){
      var currentTile = tileJSON[i];
      for(k = 0; k < currentTile.amount; k++){
        tilePool.push(currentTile);
      }
    }
  }

  function reverToRack(event, ui){
    $(this).data("ui-draggable").originalPosition = {
        top : 0,
        left : 0
    };
    return !event;
  }
    
  function loadTiles(){    
    var myTableDiv = document.getElementById("draggable");
     for(var x = currentLengthRack; x < 7; x++){
      var nextLetter = getRandomInt(tilePool.length);
      $( '<img id="tile'+tileCount+'" value="'+ tilePool[nextLetter].value+'" letter="'+tilePool[nextLetter].letter+'" class="tile draggable ui-widget-content" src="graphics_data/Scrabble_Tiles/Scrabble_Tile_'+tilePool[nextLetter].letter +'.jpg" width="60" height="65"/>').appendTo( myTableDiv );
      rack[currentLengthRack] = "tile"+ tileCount;
      currentLengthRack++;
      tilePool.splice(nextLetter, 1);
      tileCount++;
      $( "#draggable img" ).draggable({
        revert :  reverToRack,  
            snap: ".ui-droppable",
            refreshPositions: true,
            snapTolerance: "3",
            snapMode: "both",
            stack: ".ui-draggable",
            stop: function(){
                   $(this).draggable('option','revert', reverToRack);
                  }
        }).droppable({  //prevent user from placing letter tiles on top of eachother, learned about this from: https://stackoverflow.com/questions/6071409/draggable-revert-if-outside-this-div-and-inside-of-other-draggables-using-both
          greedy: true,
          tolerance: 'pointer',
          drop: function(event,ui){
                ui.draggable.animate(ui.draggable.data().origPosition= { top : 0, left : 0 },"slow"); //set the dragged tile to always revert
              }
            });
    } 
    $('#remaining_tile div').html(function(){
      return('<div>'+tilePool.length+ '</div>');
    });
  }


//droppable function
//used to limit to only dropping in the tile ahead and behind to make a word!
$( ".droppable" ).droppable({
  activeClass: "active",
  hoverClass:  "hover",
  drop: function(event, ui) {
    if(lowerLimit == 0 && upperLimit == 0){
      calcScore(ui.draggable.attr("value"), $(this).attr("id"));
      word = ui.draggable.attr("letter");
      $('#current_word div').html(function(){
        return('<div>'+word+ '</div>');
      });
      updateRack(ui.draggable.attr("ID"));
      upperLimit = String.fromCharCode($(this).attr("id").charCodeAt() + 1);
      lowerLimit = String.fromCharCode($(this).attr("id").charCodeAt() - 1);
      ui.draggable.draggable("disable", 1);
      var $this = $(this);
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear");
        }     
      })
    }else if(upperLimit == $(this).attr("id")){
      calcScore(ui.draggable.attr("value"), $(this).attr("id"));
      word = word + ui.draggable.attr("letter");
      $('#current_word div').html(function(){
        return('<div>'+word+ '</div>');
      });
      ui.draggable.draggable("disable", 1);
      updateRack(ui.draggable.attr("ID"));
      upperLimit = String.fromCharCode($(this).attr("id").charCodeAt() + 1);
      var $this = $(this);
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear");
        }     
      })
    }else if(lowerLimit == $(this).attr("id")){
      calcScore(ui.draggable.attr("value"), $(this).attr("id"));
      word =ui.draggable.attr("letter") + word;
      $('#current_word div').html(function(){
        return('<div>'+word+ '</div>');
      });
      ui.draggable.draggable("disable", 1);
      updateRack(ui.draggable.attr("ID"));
      lowerLimit = String.fromCharCode($(this).attr("id").charCodeAt() - 1);
      var $this = $(this);
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear");
        }     
      })
    }
    else{
      ui.draggable.animate(ui.draggable.data().origPosition= { top : 0, left : 0 },"slow");

    }

  }
});

function updateRack(rackID){
  currentLengthRack--;
  board[currentLengthBoard] = rackID;
  const index = rack.indexOf(rackID);
  rack.splice(index, 1);
  currentLengthBoard++;
}

function calcScore(value, boardval){
  if(boardval == 'G' || boardval == 'I'){
    score = score + Number.parseInt(value) * 2;  //double Letter
  }
  else if(boardval =='C' || boardval == 'M'){
    score = score * 2 + Number.parseInt(value) * 2; 
  }
  else{
    score = score + Number.parseInt(value);
  }
  $('#score div').html(function(){
    return('<div>'+score+ '</div>');
  });
}


//***********Button Section************

$("#btnReset").click(function() {
  
});

$("#btnSubmit").click(function() {
  var removeValuesBoard = 0;
  while(removeValuesBoard < currentLengthBoard){
    document.getElementById(board[removeValuesBoard]).remove();
    removeValuesBoard++;
  }
  board.splice(0, board.length);
  currentLengthBoard = 0;
  loadTiles();
  tScore = score + tScore;
  score = 0;
  $('#score div').html(function(){
    return('<div>'+score+ '</div>');
  });
  $('#Total_score div').html(function(){
    return('<div>'+tScore+ '</div>');
  });
  word = "";
  $('#current_word div').html(function(){
    return('<div>'+word+ '</div>');
  });
  upperLimit = 0;
  lowerLimit = 0;
});

//whipe out everything and start fresh
$("#btnSOver").click(function() {
  //document.getElementById("tile1").remove();
  var removeValuesRack = 0;
  var removeValuesBoard = 0;
  while(removeValuesRack < currentLengthRack){
    document.getElementById(rack[removeValuesRack]).remove();
    removeValuesRack++;
  }
  while(removeValuesBoard < currentLengthBoard){
    document.getElementById(board[removeValuesBoard]).remove();
    removeValuesBoard++;
  }
  word = "";
  score = 0;
  tScore = 0;
  upperLimit = 0;
  lowerLimit = 0;
  $('#current_word div').html(function(){
    return('<div>'+word+ '</div>');
  });
  $('#score div').html(function(){
    return('<div>'+score+ '</div>');
  });
  $('#Total_score div').html(function(){
    return('<div>'+tScore+ '</div>');
  });
  tilePool.splice(0, tilePool.length)
  currentLengthRack = 0;
  rack.splice(0, rack.length)
  board.splice(0, board.length)
  currentLengthBoard = 0;
  startgame();
 
});
// obtained from: https://stackoverflow.com/questions/10014196/jquery-draggable-revert-on-button-click
$("#btnReset").click(function() {
  score = 0;
  $('#score div').html(function(){
    return('<div>'+score+ '</div>');
  });
  $("#tile2, #tile4").animate({
      "left": $("#tile2").data("left"),
      "top": $("#tile2").data("top")
  });
});
$(".ui-widget-content").data("left", 0).data("top", 0);

});

//************** END OF JQUERY  **************************/

// obtained from: https://stackoverflow.com/questions/3387427/remove-element-by-id
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// grabbed a random function- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


