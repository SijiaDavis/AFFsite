$(document).ready(function() {

    // load image carousel
    $('.bxslider').bxSlider({
        adaptiveHeight: true,
        slideWidth: "500px",
        auto: true
    });

    // cnt keeps track of how many api calls have been made
    var cnt = 0;

    // constants
    var NUM_OF_POST_TO_DISPLAY = 3;
    var NUM_OF_POST_TO_SHOW = NUM_OF_POST_TO_DISPLAY / 3;
    var NUM_OF_IMAGES = 14;

    // initial data loading
    getData(loadMore, cnt, NUM_OF_IMAGES);

    function loadMore() {
        // for each column, un-hide posts
        [0, 1, 2].forEach(function(i) {
            $("#col" + i + " .text-box.hidden").slice(0, NUM_OF_POST_TO_SHOW).removeClass("hidden").addClass("displaying");
        });
    }

    // trigger loadMore func when load more button is clicked
    $(".load-more-btn").on("click", function() {
        // oh no we are running out of posts
        if ($(".text-box.hidden").length < NUM_OF_POST_TO_DISPLAY) {
            cnt++;
            // make another api call to retrieve more data
            getData(loadMore, cnt, NUM_OF_IMAGES);
        } else {
            loadMore();
        }
    });

    // when filter button is clicked -> hide corresponding posts
    $(".nav-pills .btn").on("click", function() {
        // toggle style of filter button
        $(this).toggleClass("active");
        // get the type of posts to show/hide
        var type = $(this).text();
        $(".text-box.displaying." + type).toggleClass("hidden");
    });

}); // end of document ready

// helper func for generating a random integer between 0 and the total number of images
function getRandomPicNum(imgCnt) {
    min = 0;
    max = imgCnt;
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

// helper func for parsing @, #, and hyper links for inst and tweet
function parseContents(str, type) {

    // turn http or https linkes into actual links (check both links that end with or without dot)  
    str = str.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})+\.|(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/ig, "<a href='$1$2' target='new'>$1$2</a>");

    if (type === 'inst') {

        // #hashtag -> instagram tag link
        str = str.replace(/(^|\s)(#([a-z\d-]+))/ig, "$1<a href='https:\/\/www.instagram.com\/explore\/tags\/$3\/' target='new' class='hash-tag'>$2</a>");

        //  @someone -> instagram profile link
        str = str.replace(/(^|\s)(@([a-z\d-]+))/ig, "$1<a href='https:\/\/www.instagram.com\/$3\/' target='new' class='hash-tag'>$2</a>");

    } else if (type === 'tweet') {

        // #hashtag -> twitter tag link
        str = str.replace(/(^|\s)(#([a-z\d-]+))/ig, "$1<a href='https:\/\/twitter.com\/hashtag\/$3\/' target='new' class='hash-tag'>$2</a>");

        // @someone -> twitter profile link
        str = str.replace(/(^|\s)(@([a-z\d-]+))/ig, "$1<a href='https:\/\/twitter.com\/$3\/' target='new' class='hash-tag'>$2</a>");

    }

    return str;
} // end of parseContent func

// helper method for generating relative time stamp string
function generateRelativeTimeStamp(publishedDate) {

    // locale current date
    var today = new Date();

    // post published date
    var publishedDate = new Date(publishedDate);

    var diffInMo = today.getMonth() - publishedDate.getMonth() + (12 * (today.getFullYear() - publishedDate.getFullYear()));

    var relativeTimeStampStr = '<i class="em em-sparkles"></i> created ';

    if (diffInMo < 1) {
        var diffInDay = today.getDate() - publishedDate.getDate();

        // created today? 
        if (diffInDay < 1) {
            var diffInHour = today.getHours() - publishedDate.getHours();

            // created within an hr?
            if (diffInHour < 1) {
                var diffInMin = today.getMinutes() - publishedDate.getMinutes();

                //created just now?
                if (diffInMin < 1) {
                    relativeTimeStampStr += ('less than a minute ago');
                } // end if created just now
                else {
                    relativeTimeStampStr += (diffInMin + ' minutes ago');
                }

            } // end if created within an hr
            else {
                relativeTimeStampStr += (diffInHour + ' hours ago');
            }
        } // end if created today
        else {
            relativeTimeStampStr += (diffInDay + ' days ago');
        }

    } // end if created this month
    else if (diffInMo < 12) {
        // created within this year
        relativeTimeStampStr += (diffInMon + ' months ago');
    } else {
        // created more than a year ago
        relativeTimeStampStr += (Math.floor(diffInMo / 12) + ' years ago');
    }

    return relativeTimeStampStr;
}

// helper method for generating the main content of posts for each type
function generatePostContent(item, mainDiv, imgCnt) {

    if (item.service_name === 'Manual') {
        // ribbon should display AFF
        $("<div>").attr("id", "ribbon").append(
            $("<div>").text(
                "AFF"
            )
        ).appendTo(mainDiv);

        $("<img>").attr("src", "assets/images/photo" + getRandomPicNum(imgCnt) + ".jpg").addClass("img-responsive center-block").appendTo(mainDiv);

        $("<p>").text(item.item_data.text).appendTo(mainDiv);
        $("<a>").text(item.item_data.link_text).attr({
            "href": item.item_data.link,
            "target": "new"
        }).appendTo(mainDiv);

    } 
    else if (item.service_name === 'Twitter') {
        mainDiv.addClass("box-twitter");

        // ribbon should display twitter icon
        $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
            $("<div>").append(
                $("<a>").addClass("fa fa-twitter fa-2x").attr("aria-hidden", "true")
            )
        ).appendTo(mainDiv);

        var tweetStr = parseContents(item.item_data.tweet, 'tweet');

        $("<h3>").text(item.item_data.user.username).appendTo(mainDiv);
        $("<h4>").html(tweetStr).appendTo(mainDiv);

    } 
    else if (item.service_name === 'Instagram') {
        // ribbon should display instagram icon
        $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
            $("<div>").append(
                $("<a>").addClass("fa fa-instagram fa-2x").attr("aria-hidden", "true")
            )
        ).appendTo(mainDiv);

        $("<img>").attr("src", "assets/images/photo" + getRandomPicNum(imgCnt) + ".jpg").addClass("img-responsive center-block").appendTo(mainDiv);

        var captionStr = parseContents(item.item_data.caption, 'inst');

        $("<h5>").text(item.item_data.user.username).appendTo(mainDiv);
        $("<p>").html(captionStr).appendTo(mainDiv);
    }

    var relativeTimeStampStr = generateRelativeTimeStamp(item.item_published);

    $("<p>").addClass("time-stamp").html(relativeTimeStampStr).appendTo(mainDiv);

}

function getData(cb, cnt, imgCnt) {

    // json file hosted at https://api.myjson.com/bins/3nh96
    $.get("https://api.myjson.com/bins/3nh96", function(data) {

        // sort data based on published date in desc order
        data.items = data.items.sort(function(a, b) {
            return (a.item_published < b.item_published) ? 1 : ((b.item_published < a.item_published) ? -1 : 0);
        });

        // iterate through each post
        $.each(data.items, function(i, item) {

            // column the post belongs to :
            var col = "#col" + i % 3;
            // unique id of the post:
            var uniqId = item.item_id + cnt;
            // text box the post has:
            var textbox = " .box" + uniqId;

            // append text-box div
            $("<div>").addClass("text-box hidden box" + uniqId + " " + item.service_name).appendTo(col);

            var mainDiv = $(col + textbox);

            // generate the main content of the post
            generatePostContent(item, mainDiv, imgCnt);

        });

        // call loadMore
        cb();

    });
}