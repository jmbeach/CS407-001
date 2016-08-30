function onYouTubeIframeAPIReady() {
  $.AudioNavigator.player = new YT.Player('player', {
    height: '80',
    width: '340',
		playerVars: {
			start:0
		},
    videoId: $.AudioNavigator.videoId,
    events: {
      'onReady': $.AudioNavigator.onPlayerReady,
      'onStateChange': $.AudioNavigator.onPlayerStateChange
    }
  });
}

function AudioNavigator(opts) {
  var self = this;
  self.videoId = opts.videoId;
  self.player = null;
  $.AudioNavigator = this;
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  self.onPlayerReady = function(event) {
		event.target.playVideo();
		setTimeout(function() {
			event.target.seekTo(0);
		},1000);
  }

  var done = false;

  self.onPlayerStateChange = function(event) {};

  function stopVideo() {
    self.player.stopVideo();
  }

  function AudioTag(tag) {
    var self = this;
    self.element = tag;
    self.tag = tag.html().trim();
    self.toSeconds = function() {
      var justNumbers = self.tag.substring(self.tag.indexOf("Audio") + 5);
      var toReturn = 0;
      var timeParts = justNumbers.split(":");
      toReturn += parseInt(timeParts[0]) * 3600;
      toReturn += parseInt(timeParts[1]) * 60;
      toReturn += parseInt(timeParts[2]);
      return toReturn;
    }
  }

  var audioTags;
  self.currentTag = 0;
  var findAudioTag = function() {
		var nextTag = self.tags[self.currentTag+1];
		var previousTag = self.tags[self.currentTag-1];
    if (nextTag && self.player.getCurrentTime() > self.tags[self.currentTag + 1].toSeconds()) {
      self.currentTag++;
			nextTag = self.tags[self.currentTag+1];
      // look ahead
      if (nextTag && self.currentTag < self.tags.length &&
        self.player.getCurrentTime() > self.tags[self.currentTag + 1].toSeconds()) {
        findAudioTag();
      }
    } else if (previousTag && self.currentTag > 0 &&
      self.player.getCurrentTime() < previousTag.toSeconds()) {
      self.currentTag--;
			previousTag = self.tags[self.currentTag-1];
      if (self.currentTag > 0 &&
        self.player.getCurrentTime() < self.tags[self.currentTag - 1].toSeconds()) {
        findAudioTag();
      }
    }
  }
  $(function() {
		var filter = function(i,p) {
			if ($(p).children().length > 0) {
				return false;
			}
      return $(p).html().indexOf("Audio") > -1;
		}
    audioTags = $("p, span, li").filter(filter);
    self.tags = [];
    for (var i = 0; i < audioTags.length; i++) {
      var tag = audioTags[i];
      self.tags.push(new AudioTag($(tag)));
    }
    setInterval(function() {
			var previousAudioTag = self.currentTag;
			findAudioTag(false);
      if (previousAudioTag != self.currentTag) {
        $("html, body").animate({
          scrollTop: self.tags[self.currentTag].element.offset().top - 100
        }, 500);
        self.tags[self.currentTag].element.effect("highlight", {
          color: "#669966"
        }, 3000);
      }
    }, 500);
  });
	$.AudioNavigator = this;
}
