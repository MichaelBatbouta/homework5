/*
resources used:
used for drag and drop options: https://jqueryui.com/droppable/#visual-feedback
multple dragg https://stackoverflow.com/questions/50604904/drag-image-on-multiple-droppable-div-with-same-class
snap to: https://stackoverflow.com/questions/11388679/how-do-i-force-jquery-to-center-an-element-when-it-is-dragged-to-and-snapped-to
https://stackoverflow.com/questions/26746823/jquery-ui-drag-and-drop-snap-to-center
reverting - https://jqueryui.com/draggable/#revert
reverting - https://stackoverflow.com/questions/5735270/revert-a-jquery-draggable-object-back-to-its-original-container-on-out-event-of
*/
$( function() {
  //variables to be used
  var tilePool = [];

  $( document ).ready(function() {
    loadTiles();
  });

  $.get("https://michaelbatbouta.github.io/homework5/js/pieces.json")
  .done(function(response) {
    tileJSON = response.pieces;
    startgame();
  });

    function startgame(){
      fillTilePool();

    }

       //initialize the pool of tile with all duplicates included
    function fillTilePool(){
      for(i = 0; i < 27; i++){
        var currentTile = tileJSON[i];
        for(k = 0; k < currentTile.amount; k++){
          tilePool.push(currentTile);
        }
      }
      var rTile = document.getElementById("remaining_tile");
      rTile.append(tilePool.length)
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
    $( '<img  class="tile dragg ui-widget-content" src="graphics_data/Scrabble_Tiles/Scrabble_Tile_A.jpg" width="60" height="65"/>').appendTo( myTableDiv );
    $( '<img  class="tile dragg ui-widget-content" src="graphics_data/Scrabble_Tiles/Scrabble_Tile_A.jpg" width="60" height="65"/>').appendTo( myTableDiv );
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



$( ".droppable" ).droppable({
  activeClass: "active",
  hoverClass:  "hover",
  drop: function(event, ui) {
    //ui.draggable.draggable("disable");
    var $this = $(this);
    ui.draggable.position({
      my: "center",
      at: "center",
      of: $this,
      using: function(pos) {
        $(this).animate(pos, 200, "linear");
      }     
  }
  )}
});

//$("#btnReset").click(function() {
 // $("#draggable img").draggable('option','revert', reverToRack);
//});
//$(".ui-widget-content").data("left", $(".ui-widget-content").position().left).data("top", $(".ui-widget-content").position().top);


  } );







