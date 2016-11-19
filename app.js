$(document).ready(function() {
  
    function getRandomPicNum() {
      min = 0;
      max = 6;
      return (Math.floor(Math.random() * (max - min + 1)) + min) % 6;
    }
    
    function addDomElement(i, item) {
      
    }

    $.get("https://api.myjson.com/bins/3nh96", function(data) {
      
      $.each(data.items, function(i, item) {
        
          // append text-box div
          $("<div>").addClass("text-box box"+i).appendTo("#col"+ i % 3);
          
          if (item.service_name === 'Manual') {
            // ribbon should display AFF
            $("<div>").attr("id", "ribbon").append(
              $("<div>").text(
                "AFF"
              )  
            ).appendTo("#col"+ i % 3 + " .box"+i);
            
            $("<img>").attr("src", "assets/images/photo" + getRandomPicNum() + ".jpg" ).addClass("img-responsive center-block").appendTo("#col"+ i % 3 + " .box"+i);
            
            $("<p>").text(item.item_data.text).appendTo("#col"+ i % 3 + " .box"+i);
            $("<a>").text(item.item_data.link_text).attr({"href":item.item_data.link, "target": "new"}).appendTo("#col"+ i % 3 + " .box"+i);
          }
          else if (item.service_name === 'Twitter') {
            // ribbon should display twitter icon
            $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
              $("<div>").append(
                $("<a>").addClass("fa fa-twitter fa-2x").attr("aria-hidden", "true")
              )  
            ).appendTo("#col"+ i % 3 + " .box"+i);
          }
          else if (item.service_name === 'Instagram') {
            // ribbon should display instagram icon
            $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
              $("<div>").append(
                $("<a>").addClass("fa fa-instagram fa-2x").attr("aria-hidden", "true")
              )  
            ).appendTo("#col"+ i % 3 + " .box"+i);
          }
        
          if (i === 7) {
             return false;
          }
       });
    });

});