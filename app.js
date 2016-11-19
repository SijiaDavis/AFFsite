$(document).ready(function() {

    // image carousel
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
        [0, 1, 2].forEach(function(i) {
            $("#col" + i + " .text-box.hidden").slice(0, NUM_OF_POST_TO_SHOW).removeClass("hidden").addClass("displaying");
        });
    }

    $(".load-more-btn").on("click", function() {
        if ($(".text-box.hidden").length < NUM_OF_POST_TO_DISPLAY) {
            cnt++;
            getData(loadMore, cnt, NUM_OF_IMAGES);
        } else {
            loadMore();
        }

    });

    $(".nav-pills .btn").on("click", function() {
        $(this).toggleClass("active");
        var type = $(this).text();
        $(".text-box.displaying." + type).toggleClass("hidden");
    });


});

// helper func for generating a random integer between 0 and number of images
function getRandomPicNum(imgCnt) {
    min = 0;
    max = imgCnt;
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

// helper func for parsing @, #, and hyper links for type = inst or type = tweet
function parseContents(str, type) {

    // turn http or https linkes into actual links (check both links that end with or without dot)  
    str = str.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})+\.|(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/ig, "<a href='$1$2' target='new'>$1$2</a>");

    if (type === 'inst') {

        // turn #hashtag into instagram tag links
        str = str.replace(/(^|\s)(#([a-z\d-]+))/ig, "$1<a href='https:\/\/www.instagram.com\/explore\/tags\/$3\/'  target='new' class='hash-tag'>$2</a>");

        // turn @someone into instagram profile links
        str = str.replace(/(^|\s)(@([a-z\d-]+))/ig, "$1<a href='https:\/\/www.instagram.com\/$3\/'  target='new' class='hash-tag'>$2</a>");

    } else if (type === 'tweet') {

        // turn #hashtag into twitter tag links
        str = str.replace(/(^|\s)(#([a-z\d-]+))/ig, "$1<a href='https:\/\/twitter.com\/hashtag\/$3\/'  target='new' class='hash-tag'>$2</a>");

        // turn @someone into twitter profile links
        str = str.replace(/(^|\s)(@([a-z\d-]+))/ig, "$1<a href='https:\/\/twitter.com\/$3\/'  target='new' class='hash-tag'>$2</a>");

    }

    return str;
}

function getData(cb, cnt, imgCnt) {

    $.get("https://api.myjson.com/bins/3nh96", function(data) {

        // sort data based on published date: newest -> oldest
        data.items = data.items.sort(function(a, b) {
            return (a.item_published < b.item_published) ? 1 : ((b.item_published < a.item_published) ? -1 : 0);
        });

        $.each(data.items, function(i, item) {

            // locale date
            var today = new Date();

            // post published date
            var publishedDate = new Date(item.item_published);

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

            // append text-box div
            $("<div>").addClass("text-box hidden box" + item.item_id + cnt + " " + item.service_name).appendTo("#col" + i % 3);

            if (item.service_name === 'Manual') {
                // ribbon should display AFF
                $("<div>").attr("id", "ribbon").append(
                    $("<div>").text(
                        "AFF"
                    )
                ).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                $("<img>").attr("src", "assets/images/photo" + getRandomPicNum(imgCnt) + ".jpg").addClass("img-responsive center-block").appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                $("<p>").text(item.item_data.text).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
                $("<a>").text(item.item_data.link_text).attr({
                    "href": item.item_data.link,
                    "target": "new"
                }).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

            } else if (item.service_name === 'Twitter') {
                $(".box" + item.item_id + cnt).addClass("box-twitter");

                // ribbon should display twitter icon
                $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
                    $("<div>").append(
                        $("<a>").addClass("fa fa-twitter fa-2x").attr("aria-hidden", "true")
                    )
                ).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                var tweetStr = parseContents(item.item_data.tweet, 'tweet');

                $("<h3>").text(item.item_data.user.username).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
                $("<h4>").html(tweetStr).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

            } else if (item.service_name === 'Instagram') {
                // ribbon should display instagram icon
                $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
                    $("<div>").append(
                        $("<a>").addClass("fa fa-instagram fa-2x").attr("aria-hidden", "true")
                    )
                ).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                $("<img>").attr("src", "assets/images/photo" + getRandomPicNum(imgCnt) + ".jpg").addClass("img-responsive center-block").appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                var captionStr = parseContents(item.item_data.caption, 'inst');

                $("<h5>").text(item.item_data.user.username).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
                $("<p>").html(captionStr).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
            }

            $("<p>").addClass("time-stamp").html(relativeTimeStampStr).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
        });

        cb();

    });

}