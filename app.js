$( document ).ready(function() {
  
    function getRandomPicNum() {
      min = 0;
      max = 6;
      return ( Math.floor( Math.random() * (max - min + 1) ) + min ) % 6;
    }

  $.get( "https://api.myjson.com/bins/3nh96", function( data ) {
    $.each( data.items, function( i, item ) {
       if ( item.service_name === 'Manual' || item.service_name === 'Instagram' ) {
         $( "<img>" ).attr( "src", "assets/images/photo" + getRandomPicNum() + ".jpg" ).addClass("img-responsive center-block").appendTo( "#col"+ i % 3 );
       }
       else {
         
         
       }
       if ( i === 7 ) {
         return false;
       }
     });
  });

});