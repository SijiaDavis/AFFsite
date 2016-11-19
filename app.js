$(document).ready(function() {

    var cnt = 0;
    var NUM_POST_TO_DISPLAY = 3;
    var POST_TO_SHOW = NUM_POST_TO_DISPLAY / 3;

    getData(loadMore, cnt);

    function loadMore() {
        [0, 1, 2].forEach(function(i) {
            $("#col" + i + " .text-box.hidden").slice(0, POST_TO_SHOW).removeClass("hidden").addClass("displaying");
        });
    }

    $(".load-more-btn").on("click", function() {
        if ($(".text-box.hidden").length < NUM_POST_TO_DISPLAY) {
            cnt++;
            getData(loadMore, cnt);
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

// helper func for generate a random integer between 0 and 6
function getRandomPicNum() {
    min = 0;
    max = 6;
    return (Math.floor(Math.random() * (max - min + 1)) + min) % 6;
}

// helper func for parsing @, #, and hyper links for type = inst or type = tweet
function parseContents(str, type) {
    // turn http or https into actual links (check both links that end with or without dot)
    str = str.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})+\.|(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/ig, "<a href='$1' target='new'>$1</a>");

    if (type === 'inst') {
        // turn # into instagram tag links
        str = str.replace(/(^|\s)(#([a-z\d-]+))/ig, "$1<a href='https:\/\/www.instagram.com\/explore\/tags\/$3\/'  target='new' class='hash-tag'>$2</a>");

        // turn @ into instagram profile links
        str = str.replace(/(^|\s)(@([a-z\d-]+))/ig, "$1<a href='https:\/\/www.instagram.com\/$3\/'  target='new' class='hash-tag'>$2</a>");
    } else if (type === 'tweet') {
        // turn # into twitter tag links
        str = str.replace(/(^|\s)(#([a-z\d-]+))/ig, "$1<a href='https:\/\/twitter.com\/hashtag\/$3\/'  target='new' class='hash-tag'>$2</a>");

        // turn @ into twitter profile links
        str = str.replace(/(^|\s)(@([a-z\d-]+))/ig, "$1<a href='https:\/\/twitter.com\/$3\/'  target='new' class='hash-tag'>$2</a>");
    }

    return str;
}

function getData(cb, cnt) {

    $.get("https://api.myjson.com/bins/3nh96", function(data) {

        $.each(data.items, function(i, item) {

            // append text-box div
            $("<div>").addClass("text-box hidden box" + item.item_id + cnt + " " + item.service_name).appendTo("#col" + i % 3);

            if (item.service_name === 'Manual') {
                // ribbon should display AFF
                $("<div>").attr("id", "ribbon").append(
                    $("<div>").text(
                        "AFF"
                    )
                ).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                $("<img>").attr("src", "assets/images/photo" + getRandomPicNum() + ".jpg").addClass("img-responsive center-block").appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

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

                console.log(tweetStr);
                $("<h3>").text(item.item_data.user.username).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
                $("<h4>").html(tweetStr).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

            } else if (item.service_name === 'Instagram') {
                // ribbon should display instagram icon
                $("<div>").attr("id", "ribbon").addClass("ribbon-black").append(
                    $("<div>").append(
                        $("<a>").addClass("fa fa-instagram fa-2x").attr("aria-hidden", "true")
                    )
                ).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                $("<img>").attr("src", "assets/images/photo" + getRandomPicNum() + ".jpg").addClass("img-responsive center-block").appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);

                var captionStr = parseContents(item.item_data.caption, 'inst');

                $("<h5>").text(item.item_data.user.username).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
                $("<p>").html(captionStr).appendTo("#col" + i % 3 + " .box" + item.item_id + cnt);
            }
        });

        cb();

    });

}