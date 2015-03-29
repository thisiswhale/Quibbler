$(document).ready(function() {
    // Socket.IO stuff
    var socket = io();

    $(".main-chat-form").submit(function () {
        socket.emit('new message', $(".message-prompt").val());
        $(".message-prompt").val('');

        return false;
    });

    socket.on('new message', function (msgObj) {
        var randomId = Math.floor(Math.random() * 10000);
        var messageHtml = "<span class='message' id='" + randomId + "'>" + msgObj.msg + "</span>";
        
        $(".visualizer").append(messageHtml);
        
        $(".message#" + randomId).css('top', msgObj.cssTop.toString() + "%");
        $(".message#" + randomId).css('left', msgObj.cssLeft.toString() + "%");
        $(".message#" + randomId).css('font-size', msgObj.cssFontSize.toString() + "rem");
        $(".message#" + randomId).css('color', msgObj.cssColor);
        
        $(".message#" + randomId).addClass('animated bounceIn');
        $(".message#" + randomId).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('animated bounceIn').delay(3000).fadeOut(7000, function () {
                $(this).remove();
            });
        });

        console.log("Message sent: " + msgObj.msg);
    });

    socket.on('user count', function (count) {
        $(".user-count").text(count);
    });

    socket.on('new topic', function (topic) {
        if (topic.url)
            $("span.chat-topic").html("<em><span class='chat-topic'><a href='" + topic.url + "'>" + topic.title + "</a></span></em>");
        else
            $("span.chat-topic").html("<em><span class='chat-topic'>" + topic.title + "</span></em>");
    });

    // Design stuff
    var formActive = ($(window).width() < 568) ? true : false;
    console.log(formActive)

    $(".send-btn").click(function (e) {
        if (!formActive) {
            e.preventDefault();
            
            $(".main-chat-form").animate({"left": "0"}, 'slow');
            $(".message-prompt").focus();

            if ($(window).width() < 860 && $(window).width() > 568) {
                $(".about-container").fadeOut('slow');
            }

            formActive = true;
        }

        else {
            if ($(".message-prompt").val().length == 0 || $(".message-prompt").val().length > 50) {
                e.preventDefault();
            }
        }
    });

    $(document).click(function (e) {
        if ($(window).width() > 568) {
            if (formActive) {
                if (!$(e.target).closest('.main-chat-form').length) {
                    $(".message-prompt").blur();
                    $(".main-chat-form").animate({"left": "-60vw"}, 'slow');
                    $(".about-container").fadeIn('slow');
                    
                    formActive = false;
                }
            }
        }
    });

    $(".deactivate-overlay").click(function () {
        $(".intro-overlay").addClass("animated slideOutUp")
        $(".intro-active").removeClass("intro-active");
    });
});
