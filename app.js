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
          $("<div>").addClass("text-box hidden box" + item.item_id + " " + item.service_name).appendTo("#col"+ i % 3);
          
          if (item.service_name === 'Manual') {
            // ribbon should display AFF
            $("<div>").attr("id", "ribbon").append(
              $("<div>").text(
                "AFF"
              )  
            ).appendTo("#col"+ i % 3 + " .box" + item.item_id);
            
            $("<img>").attr("src", "assets/images/photo" + getRandomPicNum() + ".jpg").addClass("img-responsive center-block").appendTo("#col"+ i % 3 + " .box" + item.item_id);
            
            $("<p>").text(item.item_data.text).appendTo("#col"+ i % 3 + " .box" + item.item_id);
            $("<a>").text(item.item_data.link_text).attr({"href":item.item_data.link, "target": "new"}).appendTo("#col"+ i % 3 + " .box" + item.item_id);
          }
          else if (item.service_name === 'Twitter') {
            $(".box" + item.item_id).addClass("box-twitter");
            
            // ribbon should display twitter icon
            $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
              $("<div>").append(
                $("<a>").addClass("fa fa-twitter fa-2x").attr("aria-hidden", "true")
              )  
            ).appendTo("#col"+ i % 3 + " .box" + item.item_id);
            
            $("<h3>").text(item.item_data.user.username).appendTo("#col"+ i % 3 + " .box" + item.item_id);
            $("<h4>").text(item.item_data.tweet).appendTo("#col"+ i % 3 + " .box" + item.item_id);
            
          }
          else if (item.service_name === 'Instagram') {
            // ribbon should display instagram icon
            $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
              $("<div>").append(
                $("<a>").addClass("fa fa-instagram fa-2x").attr("aria-hidden", "true")
              )  
            ).appendTo("#col"+ i % 3 + " .box" + item.item_id);
            
            $("<img>").attr("src", "assets/images/photo" + getRandomPicNum() + ".jpg" ).addClass("img-responsive center-block").appendTo("#col"+ i % 3 + " .box" + item.item_id);
            
            $("<h5>").text(item.item_data.user.username).appendTo("#col"+ i % 3 + " .box" + item.item_id);
            $("<p>").text(item.item_data.caption).appendTo("#col"+ i % 3 + " .box" + item.item_id);
          }
       });
    
       function loadMore(){
        if ($(".text-box.hidden").length < 9) {
           console.log("running out");
           
        }
        $("#col0 .text-box.hidden").slice(0,3).removeClass("hidden").addClass("displaying");
        $("#col1 .text-box.hidden").slice(0,3).removeClass("hidden").addClass("displaying");
        $("#col2 .text-box.hidden").slice(0,3).removeClass("hidden").addClass("displaying");
       }
       
       loadMore();
       $(".load-more-btn").on("click",loadMore);
    
    });
    
    $(".nav-pills .btn").on("click", function(){
      $(this).toggleClass("active");
      var type = $(this).text();
      $(".text-box.displaying."+ type).toggleClass("hidden");
    });


});