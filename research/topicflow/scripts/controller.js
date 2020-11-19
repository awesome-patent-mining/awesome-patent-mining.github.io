var tweets = new Object();
var topics = new Object();
var bins = new Array();
var similarityMap = new Object();
var svg_width;
var svg_height;

/**
 * Method to draw the topic flow visualization. 
 */
function drawViz() {
	var margin = {top: 10, right: 1, bottom: 0, left: 10},
    svg_width = 580 - margin.left - margin.right,
    svg_height = 780 - margin.top - margin.bottom;
	axis_height = 20;
	axis_title_height = 50;
	
	var formatNumber = d3.format(",.0f"),
	    format = function(d) { return formatNumber(d); },
	    color = d3.scale.category20();
	
	var svg = d3.select("#flow_viz").append("svg")
	    //.attr("width", svg_width + margin.left + margin.right)
	    .attr("height", svg_height + margin.top + margin.bottom)
		.attr("width","95%")
		.attr("viewBox","0 0 "+(svg_width+margin.left+margin.right)+" "+(svg_height))
		.attr("preserveAspectRatio","none")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var topicflow = d3.topicflow()
	    .nodeWidth(15)
	    .nodePadding(10)
	    .size([svg_width, svg_height-axis_height-axis_title_height]);
	
	var path = topicflow.link();
	
	topicflow
	      .nodes(similarityMap.nodes)
	      .links(similarityMap.links)
	      .layout(0);
	
	  var link = svg.append("g").selectAll(".link")
	      .data(similarityMap.links)
	      .enter().append("path")
	      .attr("class", function(d) {
			  return "link t" + d.source.name + " t" + d.target.name;
	      })
	      .attr("d", path)
	      .style("stroke-width", function(d) { return Math.max(0,d.dy); })
//	      .sort(function(a, b) { return b.dy - a.dy; })*/
	     .on("click", function(d,e) { 
			    // Draw bar chart 
			    tooltip.hide();
 			    $("#similarity_holder").fadeIn();
			    var w = 200;
				var h = $("#similarity_holder").height();
			    showTopicSimilarity_bar(d.source.name, d.target.name, w);
				positionTopicSimilarity(2*w,h);
	      })
		  .on("mouseover",function(l) {
			  tooltip.show(l.source.name + " --> " +l.target.name);	
		  })
		  .on("mousemove",function() {
			  var w = 200;
			  var h = $("#similarity_holder").height();
			  positionTopicSimilarity(2*w,h);
		  })
		  .on("mouseout",function() {
			  // Hide tooltip
			  tooltip.hide();
			  // Hide bar chart
			  $("#similarity_holder").stop().fadeOut();
			  });
		  
		
	  var node = svg.append("g").selectAll(".node")
	      .data(similarityMap.nodes)
	    .enter().append("g")
	    .attr("id", function(n) {return n.name;})
	    .attr("class", function(d) {
	    	var type = "";
				if (d.targetLinks.length == 0 && d.sourceLinks.length == 0) { // standalone topic
					type="standalone";}
				else if (d.targetLinks.length == 0 && d.sourceLinks.length > 0) { // emerging
					type="emerging";}
				else if (d.targetLinks.length > 0 && d.sourceLinks.length==0) { // convering
					type="ending";}
				else { type="continuing"; } // continuing
				return "node " + type;})
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    .on("click", function(n) { 
	    	showTopicData(n.name);
	    })
		.on("mouseover",function(n) {
			// Find the bin containing the topic 
		  	var id = n.name;
			var b = id.split("_")[0];
			var tmp = bins[b].getTopic(id);
			
			tooltip.show("Topic " + n.name + ":<br/>" + tmp.getHTMLSummary());
			})
		.on("mouseout",function() {tooltip.hide();});
		
	  node.append("rect")
	      .attr("height", function(d) { return d.dy; })
	      .attr("width", topicflow.nodeWidth())
		  .attr("class","node_rect");
		// CREATE X AXIS
	  	var end = bins[bins.length-1].start.split(/[/ :]/);
	  	var start = bins[0].start.split(/[/ :]/);
	  	var min = Date.UTC(start[2],start[0]-1,start[1], start[3], start[4]);
	  	var max = Date.UTC(end[2],end[0]-1,end[1], end[3], end[4]);
	  	var xScale = d3.time.scale.utc()
	  	                       .domain([min, max])
	  	                       .range([5, svg_width-5]);
	  	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	  	svg.append("g")
	  		.attr("class","axis")
	  	    .attr("transform", "translate(0," + (svg_height - margin.top + margin.bottom-axis_height-axis_title_height+10) + ")")
	  		.call(xAxis);
			
	  	
			// x-axis label
	  	var format = d3.time.format("%x");
	  	var startString = format(new Date(start[2], start[0]-1, start[1]));
	  	var endString = format(new Date(end[2], end[0]-1, end[1]));
	  	var out = "Date/Time (" + startString
	  	if (startString!=endString) {
	  		out += " to " + endString;
	  	}
	  	out += ")"
	  	
		svg.append("text")
			.text(out)
	  	    .attr("class", "x label")
	  	    .attr("text-anchor", "middle")
	  	    .attr("x", svg_width/2)
	  	    .attr("y", svg_height-axis_title_height+axis_height+2);
			// END CREATE X AXIS
		  
	  /*node.append("text")
	      .attr("x", -6)
	      .attr("y", function(d) { return d.dy / 2; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", "end")
	      .attr("transform", null)
	      .text(function(d) { return d.name; })
	    .filter(function(d) { return d.x < width / 2; })
	      .attr("x", 6 + topicflow.nodeWidth())
	      .attr("text-anchor", "start");*/
	  
	 /* function dragmove(d) {
		    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(svg_height - d.dy, d3.event.y))) + ")");
		    topicflow.relayout();
		    link.attr("d", path);
	  }*/
}

function positionTopicSimilarity(w,h) {
	var coords = d3.mouse(document.body);

	var padding = 5;
    var y = coords[1] + padding;
    var x = coords[0] + padding;
	
	var D = document;
	var docHeight =  Math.max(
	        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
	        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
	        Math.max(D.body.clientHeight, D.documentElement.clientHeight));
	var docWidth =  Math.max(
	        Math.max(D.body.scrollWidth, D.documentElement.scrollWidth),
	        Math.max(D.body.offsetWidth, D.documentElement.offsetWidth),
	        Math.max(D.body.clientWidth, D.documentElement.clientWidth));
			
	// adjust verticle positioning
	if (y+h+10 > docHeight)
		y = coords[1]-h-3*padding;
	// adjust horizontal positioning
	if (x+w+10 > docWidth)
			x = coords[0]-w-3*padding;
	$("#similarity_holder").css("top", y + 'px');
	$("#similarity_holder").css("left", x + 'px');
}

/* Formats timestamp for the x-axis given a range*/
function formatForAxis(start, end) {
	var months = ["Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	
  	end = end.split(/[/ :]/);
  	start = start.split(/[/ :]/);
	
	if (end[2] != start[2]) // Years are diff, print month + year
		return months[start[0]-1] + " " + start[2].substring(2) + " - " + months(end[0]-1) + " " + end[2].substring(2);
	else if (end[0] != start[0]) // Months are diff, print month + day
		return months[start[0]-1] + "/" + start[1] + " - " + months[end[0]-1] + "/" + end[1];
	else if (end[1] != start[1]) // Days are diff, print day 
		return start[1] + " - " + end[1];
	else 
		return start[3] + ":" + start[4] + " - " + end[3] + ":" + end[4];
}



/**
 * Method to read the JSON for the topic similarity data. 
 * @param sim_data
 */
function readSimilarityJSON(sim_data) {
	similarityMap = new TopicSimilarityMap();
	similarityMap.wrap(sim_data);
}

/**
 * Method to read the JSON for the bins.
 * @param bin_data
 */
function readBinJSON(bin_data) {
	$.each(bin_data, function(i, bin) {
		tmp = new Bin();
		var tmp_topics = tmp.wrap(bin);
		for (topic in tmp_topics) {
			topics[topic] = tmp_topics[topic];
		}
		bins.push(tmp);
	});
}

/**
 * Method to read the JSON for tweets.
 * @returns {Object}
 */
function readTweetJSON(tweet_data) {
	$.each(tweet_data, function(i, tweet) {
		tmp = new Tweet();
		tmp.wrap(tweet);
		tweets[tmp.id] = tmp;
	});
}

/**
 * Method to initially populate the topic list. 
 */
function populateTopics() {
	var showTimestamps = true;
	$("g").each(function(key, g) {
		if (g.style.display == "none") {
			showTimestamps = false;
		}
	});
	$("#topic_list").empty();
	var count = 0;
	$.each(bins, function(i, bin) {
		var tm = bin.tm;
		//divider
		var start = bin.start;
		var end = bin.end;
		if (showTimestamps) $("#topic_list").append("<li class=\"time\"><span class=\"left\">" + formatTime(start) + "</span><span class=\"right\">" + formatTime(end) + "</span></li>");
		
		$.each(tm.topics, function(j, topic) {
			if ($("g #"+j)[0].style.display != "none") {
				addTopic(topic);
				count = count + 1;
			}
		});
	});
	
	$("#topics_title").text("Topics (" + count + ")");
}

/** 
* Formats timestamp from year-month-day 24h:min:sec 
* to day, month day, year @ hour:minute merdian
**/
function formatTime(timestamp) {
	var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var dayNames = ["Sun", "Mon", "Tue","Wed","Thu","Fri","Sat" ];
	var ts = new Date(timestamp);
	var hour = ts.getHours();
	var mer = "AM";
	if (hour == 0) {
		hour = 12;
	}
	else if (hour > 12) {
		hour = hour - 12;
		mer = "PM";
	}
	var minute = String(ts.getMinutes());
	if (minute.length < 2) {
		minute = "0" + minute;
	}
	var ts = new Date(timestamp);
	return (ts.getMonth()+1) + "/" + ts.getDate() + "/" + ts.getFullYear()
		+ " at " + hour + ":" + minute + mer;
}

/**
 * Method to initially populate the tweet list. 
 */
function populateTweets(start) {
	// Number of tweets to load at a time
	var num = 500;
	
	var totalTweets = Object.keys(tweets).length;
	
	// Decide end
	var end = start + num;
	if (end > totalTweets+1) end = totalTweets + 1; // plus 1 becuase of 1-based indexing
	
	// Populate the tweets in increments
	var tweetsToAdd = ""
	
	for (var i = start; i < end; i++) {
		tweetsToAdd += addTweet(tweets[i]);
	}
	
	// Show the tweet count in the tweet list
	$("#tweet_list_panel > #tweet_list_title").text("Tweets (" + totalTweets + ")");
	$("#tweet_list").append(tweetsToAdd);
	
	// Display show more button if applicable
	if (end < totalTweets+1) {
		var button = $("<center><button id='display_more'>Load More Tweets</button></center>");
		button.click(function() {
			$(this).remove();
			populateTweets(end);
		});
		$("#tweet_list").append(button);
	}
}

/**
 * Method to add a topic to the topic list. 
 * @param topic  The topic object to add to the list
 */
function addTopic(topic) {
	var t = "<li class='topic_card' id='" + topic.id + "'><span>Topic " + topic.id + "</span><span class='topic_summary'>" + topic.getHTMLSummary() + "</span></li>";
	
	$("#topic_list").append(t);
}

/**
 * Method to add a tweet to the tweet list
 * @param tweet The tweet object to add to the list
 */
function addTweet(tweet) {
	// Shorten the text field
	var text = tweet.text.substring(0, 80);
	if (tweet.text.length > 80) text += "...";
	
	return "<div class='tweet_card' id='" + tweet.id + "'><span class=\"tweet_author\">" + tweet.author + "</span><span class='tweet_date time'>" + formatTime(tweet.date) + "</span><span class='clear'></span><span class='tweet_text'>" + text + "</span></div>";
	
	//$("#tweet_list").append(t);
}

function unhighlightAllTopics() {
	$(".topic_card.selected").each(function() {
		$(this).removeClass("selected");
	});
	
	unhighlightViz();
}

function unhighlightViz() {
	// unhighlight all nodes
	$(".vselected").each(function(key, node) {
		node.removeClass("vselected");
	});
	$(".nhighlighted").each(function(key, node) {
		node.removeClass("nhighlighted");
	});
	
	
	// unhighlight all edges
	$(".link.highlighted").each(function(key, edge) {
		edge.removeClass("highlighted");
	});
	
	// ungrey everything
	$(".greyed").each(function(key, edge) {
		edge.removeClass("greyed");
	});

}

function highlightTopic(id) {
	unhighlightAllTopics();
	
	// if card is not in topic list, reset topic list and undo search
	if ($("#" + id + ".topic_card").length <= 0) {
		populateTopics();
		$(".search_clear").click();
	}
	$("#" + id + ".topic_card").addClass("selected");
	
	// Scroll to the selected topic in the list
	var offset = $("#topic_list").scrollTop() + ($("#" + id + ".topic_card").offset().top-$("#topic_list").offset().top);
	$('html, #topic_list').animate({
	    scrollTop:offset
	}, 50);
	
	
	// Highlight in visualization
	highlightViz(id);
}

function highlightViz(id) {
	// Highlight node
	$("g #" + id + "> rect").each(function(key, node) {
		node.addClass("vselected");
	});
	
	
	// highlight subgraph
	highlightLeftSubgraph(id);
	highlightRightSubgraph(id);
	$("g.node > rect:not(.nhighlighted)").each(function(key, node) {
		if (!node.hasClass("vselected"))
			node.addClass("greyed");
	});
	$("path:not(.highlighted)").each(function(key, edge) {
		edge.addClass("greyed");
	});
}

function highlightLeftSubgraph(id) {
	$(".t"+id).each(function(key, edge) {
		var leftNodeID = edge.getClass(1).replace("t","");
		if (leftNodeID != id) {
			if (edge.style.display != "none") {
				edge.addClass("highlighted");
				var node = $("g #" + leftNodeID + "> rect")[0];
				if (!node.hasClass("nhighlighted")) {
					node.addClass("nhighlighted");
					highlightLeftSubgraph(leftNodeID);
				}
			}
		}
	});
}

function highlightRightSubgraph(id) {
	$(".t"+id).each(function(key, edge) {
		var rightNodeID = edge.getClass(2).replace("t","");
		if (rightNodeID != id) {
			if (edge.style.display != "none") {
				edge.addClass("highlighted");
				var	node = $("g #" + rightNodeID + "> rect")[0];
				if (!node.hasClass("nhighlighted")) {
					node.addClass("nhighlighted");
					highlightRightSubgraph(rightNodeID)
				}
			}
		}
	});
}

/**
 * Method to show the topic data when a user selects a specific topic. 
 * @param id The id of the specified topic
 */
function showTopicData(id) {
	// if topic is already selected, then do deselect.
	var selected = $("rect.vselected").parent();
	if (selected.length > 0) {
		if (selected[0].__data__.name == id) {
			$("#view_all").click();
			return;
		}
	}
	// Clear tweet data
	clearTweetData();
		
	// Find the bin containing the topic 
	var b = id.split("_")[0];
	var tmp = bins[b].getTopic(id);
	
	// Show the top tweets for the topic
	showTweetsForTopic(tmp);
	
	// Show the word distribution for the topic
	showWordsForTopic(tmp);
	
	
	// Highlight selected topic & its paths in and out
	highlightTopic(id);
}

/**
 * Method to clear topic data for any selected topic.  
 * For optimization, first checks that there is a selected topic. 
 */
function clearTopicData() {
	
	// Check that there is a selected topic
	if ($(".selected").length>0) {
		return;
	}
	
	// Clear the word distribution
	$("#topic_cloud").remove()
	
	// Unselect any selected topics
	unhighlightAllTopics();
	
	// Show all tweets
	$("#topic_list_panel > .panel_name > #view_all").hide();
	$("#tweet_list").empty();
	
	populateTweets(1);
}

/**
 * Method to show the tweet data when a user selects a specific tweet.
 * @param id  The id of the specified tweet
 */
function showTweetData(id) {
	// if tweet is already selected, deselect it
	if ($(".tweet_card.selected#"+id).length > 0) {
		clearTweetData();
		return;
	}
	
	// deselect any other tweets
	clearTweetData();
	
	// highlight selected tweet
	$(".tweet_card.selected").each(function() {
		$(this).removeClass("selected");
	});
	$("#" + id + ".tweet_card").addClass("selected");
	
	// Show Selected Tweet information
	showFullTweet(id);
	showTopicsForTweet(id);
}

function clearTweetData() {
	// end if no tweet is selected
	if ($(".tweet_card.selected").length == 0) return;
	
	// reset the tweet
	var id = $(".tweet_card.selected").attr("id");
	var tweet = tweets[id];
	
	$(".tweet_card.selected").replaceWith(addTweet(tweet));
}

/**
 * Method to show the tweets for the selected topic. 
 * 
 * Empties the tweet list and shows only those tweets related to the selected topic.
 * The displayed tweets are ordered by P(tweet|topic) where P(tweet|topic) ~ P(topic|tweet)
 * @param topic  The topic object
 */
function showTweetsForTopic(topic) {
	var tweetsToShow = topic.top_docs;
	
	// order the tweets by P(tweet|topic)
	var sortable = [];
	for (var tweet in topic.top_docs) {
		sortable.push([tweet, topic.top_docs[tweet]]);
	}
	sortable.sort(function(a,b){return b[1]-a[1]});
	
	// Show the tweets
	 $("#tweet_list").empty();
	 var tweetsToAdd = ""
	 var count = 0;
	 for (var pair in sortable) {
		 count = count+1;
		 tweetsToAdd += addTweet(tweets[sortable[pair][0]]);
	 }
	 
	 $("#tweet_list_panel > #tweet_list_title").text("Tweets: Topic " + topic.id + " (" + count + ")");
	 $("#tweet_list").append(tweetsToAdd)
	 $("#topic_list_panel > .panel_name > #view_all").show();
}

/**
 * Method to show the topics for the selected tweet. 
 * 
 * Empties the topic list and shows only those topics related to the selected tweet. 
 * The displayed topics are ordered by P(topic|tweet)
 * @param id Tweet ID
 */
function showTopicsForTweet(id) {
	var tmp_topics;
	// Find the bin containing the tweet and get the topics
	// TODO: smarter way to determine bin or topics for the tweet
	for (var i=0; i<bins.length; i++) {
		var bin = bins[i];
		if (bin.hasTweet(id)) {
			tmp_topics = bin.getTopicsForTweet(id);
			break;
		}
	}
	
	// order the topics by P(Topic|Tweet)
	var data = new Array();
	for (var t in tmp_topics) {
		data.push({text:t, value:tmp_topics[t]});
	}
	data.sort(function(a, b) { return b.value - a.value; });
	
	var w = 250,
		h = 20,
		padding = 5;
	
		$(".tweet_card.selected").append("<div class='sub_panel_name'>Topics</div>");
	var chart = d3.select(".tweet_card.selected").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", (h+padding) * data.length);

		// word labels
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return d.text; })
		  .attr("y", function(d, i) { return i*(h+padding)+15; })
		  .attr("text-anchor","end");
		  
	var texts = chart.selectAll("text")[0];
	var word_axis = 0;
	chart.selectAll("text")[0].forEach(function(text) {
		if (word_axis < text.getBBox().width) {
			word_axis = text.getBBox().width;
		}
	});
	
	chart.selectAll("text")
		.attr("x",word_axis);
	
	
	// bar charts
	var maxVal = data.reduce(function(a, b) {
				return Math.max(a, b.value);
			}, 0);
	var chartScale = d3.scale.linear().domain([0, maxVal]).range([0, w-word_axis-padding])
	chart.selectAll("rect")
		  .data(data)
		  .enter().append("rect")
		  .attr("x", word_axis+padding)
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("width",function(d) {return chartScale(d.value);})
		  .attr("height",h)
		  .attr("fill","orange")
		  .on("mouseover", function(n) {
				// Find the bin containing the topic 
			  	var id = n.text;
				var b = id.split("_")[0];
				var tmp = bins[b].getTopic(id);
				
				tooltip.show(tmp.getHTMLSummary());
		  })
		  .on("mouseout", function(n) {
			  	tooltip.hide();
		  });
		  
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return String(d.value);})
		  .attr("x", function(d) { chartScale(d.value); })
		  .attr("y", function(d,i) {return i*(h+padding)+15;})
		  .attr("text-anchor", "end");
}

/**
 * Method to display the word distribution for the selected topic.
 * 
 * Displays a word cloud representing the distribution of P(word|topic)
 * @param topic  The topic object for which to show the word cloud
 */
function showWordsForTopic(topic) {
	$("#topic_cloud").remove();
	$("li.topic_card#" + topic.id).append("<div id=\"topic_cloud\"></div>")
	
	var data = new Array();
	$.each(topic.getTopWords(), function(word, prob) {
		data.push({text:word, value:prob});
	});
	
	data.sort(function(a, b) { return b.value - a.value; });
	var w = 250,
		h = 20,
		padding = 5;
	
	var chart = d3.select("#topic_cloud").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", (h+padding) * data.length);

    // word labels
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return d.text; })
		  .attr("y", function(d, i) { return i*(h+padding)+15; })
		  .attr("text-anchor","end");
		  
	var texts = chart.selectAll("text")[0];
	var word_axis = 0;
	chart.selectAll("text")[0].forEach(function(text) {
		if (word_axis < text.getBBox().width) {
			word_axis = text.getBBox().width;
		}
	});
	
	chart.selectAll("text")
		.attr("x",word_axis);
	
	
	// bar charts
	var maxVal = data.reduce(function(a, b) {
				return Math.max(a, b.value);
			}, 0);
	var chartScale = d3.scale.linear().domain([0, maxVal]).range([0, w-word_axis-padding])
	chart.selectAll("rect")
		  .data(data)
		  .enter().append("rect")
		  .attr("x", word_axis+padding)
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("width",function(d) {return chartScale(d.value);})
		  .attr("height",h)
		  .attr("fill","orange");
		  
	chart.selectAll("text")
		  .data(data)
		  .enter().append("text")
		  .text(function(d) { return String(d.value);})
		  .attr("x", function(d) { chartScale(d.value); })
		  .attr("y", function(d,i) {return i*(h+padding)+15;})
		  .attr("text-anchor", "end");
}

/**
 * Method to display the full tweet in the tweet panel
 * @param id the id of the tweet to display
 */
function showFullTweet(id) {
	$(".tweet_card.selected#" + id).empty(); 
	var tweet = tweets[id];
	
	var t = $("<span class='tweet_author'><a target='_blank' href='https://twitter.com/" + tweet.author + "'>" + tweet.author + "</a></span><span class='tweet_date time'>" + formatTime(tweet.date) + "</span><span class='clear'></span><div class='tweet_text'>" + tweet.text + "</div>");
	
	$(".tweet_card.selected#"+id).append(t);
}

function showTopicSimilarity_bar(t1, t2, width) {
	// get t1 words
	var b1 = t1.split("_")[0];
	var bin1 = bins[b1];
	var t1_words = bin1.getTopic(t1).getTopWords();
	
	// get t2 words
	var b2 = t2.split("_")[0];
	var bin2 = bins[b2];
	var t2_words = bin2.getTopic(t2).getTopWords();
	
	var t1_data = new Array();
	var t2_data = new Array();
	
	var negated_prob = 0;
	for (w1 in t1_words) {
		if (w1 in t2_words) {
			negated_prob = -t1_words[w1];
			t1_data.push({text:w1, value:negated_prob, color:2});
			t2_data.push({text:w1, value:t2_words[w1], color:2});
		} else {
			negated_prob = -t1_words[w1];
			t1_data.push({text:w1, value:negated_prob, color:0});
		}
	}
	
	for (w2 in t2_words) {
		if (w2 in t1_words) {
			// do nothing
		} else {
		
			t2_data.push({text:w2, value:t2_words[w2], color:1});
		}
	}
	
	t1_data.sort(function(a, b) { return a.value - b.value; });
	t2_data.sort(function(a, b) { return b.value - a.value; });
	var w = width,
		h = 20,
		padding = 5;
		
	var height = (h+padding) * (Math.max(t1_data.length, t2_data.length));
	// Visualize the topic similarity
	$("#t1").empty();
	$("#t2").empty();
	
	var t1_chart = d3.select("#t1").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", height);
	

	    
	var t2_chart = d3.select("#t2").append("svg")
	    .attr("class", "chart")
	    .attr("width", w)
	    .attr("height", height);
	
	//var t1x0 = Math.max(-d3.min(t1_data), d3.max(t2_data));
	var t1x0 = t1_data[0].value;
	var t2x0 = t2_data[0].value;

	var t1x = d3.scale.linear()
	    .domain([t1x0, 0])
	    .range([0, w])
	    .nice();
	
	var t2x = d3.scale.linear()
			    .domain([0,t2x0])
			    .range([0, w])
			    .nice();
	
	
	// bar charts
	var colors = ["white", "white", "#AE209D"];

	t1_chart.selectAll("rect")
		  .data(t1_data)
		  .enter().append("rect")
		  .attr("x", function(d) { return t1x(Math.min(0, d.value)); })
          .attr("width", function(d) { return Math.abs(t1x(d.value) - t1x(0)); })
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("height",h)
		  .attr("fill",function(d) {
			  return colors[d.color];
		  });
		
	t2_chart.selectAll("rect")
		  .data(t2_data)
		  .enter().append("rect")
		 		  .attr("x", function(d) { return t2x(Math.min(0, d.value)); })
          .attr("width", function(d) { return Math.abs(t2x(d.value) - t2x(0)); })
		  .attr("y", function(d, i) {return i*(h+padding);})
		  .attr("height",h)
		  .attr("fill",function(d) {
			  return colors[d.color];
		  });
	
    // word labels
	t1_chart.selectAll("text")
		  .data(t1_data)
		  .enter().append("text")
		  .text(function(d) { return d.text; })
		  .attr("y", function(d, i) { return i*(h+padding)+15; })
		  .attr("text-anchor","end")
		  .attr("fill", "black");
	
	t2_chart.selectAll("text")
	  .data(t2_data)
	  .enter().append("text")
	  .text(function(d) { return d.text; })
	  .attr("y", function(d, i) { return i*(h+padding)+15; })
	  .attr("text-anchor","start")
	  .attr("fill", "black");
		  
	
	t1_chart.selectAll("text")
		.attr("x",w-5);
	
	
	t2_chart.selectAll("text")
		.attr("x",5);
	
	
	$("#t1_title").text("Topic " + t1);
	$("#t2_title").text("Topic " + t2);
}

/**
 * Method to display the topic similarity information in the topic similarity tooltip
 * @param t1  topic 1
 * @param t2  topic 2
 */
function showTopicSimilarity(t1, t2, expand) {
	var out = t1 + ' --> ' + t2;
	if (expand) {
		// get t1 words
		var b1 = t1.split("_")[0];
		var bin1 = bins[b1];
		var t1_words = bin1.getTopic(t1).getTopWords();
		
		// get t2 words
		var b2 = t2.split("_")[0];
		var bin2 = bins[b2];
		var t2_words = bin2.getTopic(t2).getTopWords();
		
		var same_words = "";
		var old_words = "";
		var new_words = "";
		for (w1 in t1_words) {
			if (w1 in t2_words) {
				same_words = same_words + "<br />" + w1;
			} else {
				old_words = old_words + "<br />" + w1;
			}
		}
		
		for (w2 in t2_words) {
			if (w2 in t1_words) {
				// do nothing
			} else {
				new_words = new_words + "<br />" + w2;
			}
		}
		old_words = old_words.substring(6);
		new_words = new_words.substring(6);
		same_words = same_words.substring(6);	
		out += "<br /><div class='old words'>" + old_words + "</div>";
		out += "<div class='same words'>" + same_words + "</div>";
		out += "<div class='new words'>" + new_words + "</div>";
	}
	return out;
}


/**
 * Method to clear the interface
 */
function clear() {
	similarityMap = new Object();
	bins = new Array();
	tweets = new Object();
	
	$("#tweet_list").empty();
	$("#topic_list").empty();

	$("#flow_viz").empty();
	
	// Clear searchbox
	$("input#topic_searchbox").val("")
	
	// Hide topic subpanel in tweet box/topic boxes
	clearTweetData();
	clearTopicData();
	
}

/**
 * Methodt to populate the visualization with the selected dataset.
 * @param selected_data  the selected data set
 */
function populateVisualization(selected_data) {		
	// Show the loading image
	$("#loader").show();

	// Clear the interface
	clear();
	
	var idToName = {"HCI" : "HCI", "ModernFamily" : "Weibo-H7N9", "catfood": "Catfood" , 
					"drugs" : "Drugs", "earthquake" : "Earthquake", "umd" : "UMD", "debate":"Twitter-H7N9", "chi":"CHI Conference", 
					"sandy" : "Sandy and NJ"}
		
	// Populate the interface with the selected data set
	if (selected_data==="HCI") {
		populate_tweets_HCI();
		populate_bins_HCI();
		populate_similarity_HCI();
	}
	if (selected_data==="ModernFamily") {
		populate_tweets_ModernFamily();
		populate_bins_ModernFamily();
		populate_similarity_ModernFamily();
	}
	if (selected_data==="catfood") {
		populate_tweets_Catfood();
		populate_bins_Catfood();
		populate_similarity_Catfood();
	}
	if (selected_data==="drugs") {
		populate_tweets_Drugs();
		populate_bins_Drugs();
		populate_similarity_Drugs();
	}
	if (selected_data==="earthquake") {
		populate_tweets_Earthquake();
		populate_bins_Earthquake();
		populate_similarity_Earthquake();
	}
	if (selected_data==="umd") {
		populate_tweets_HashtagUMD();
		populate_bins_HashtagUMD();
		populate_similarity_HashtagUMD();
	}
	if (selected_data==="debate") {
		populate_tweets_Debate();
		populate_bins_Debate();
		populate_similarity_Debate();
	}
	if (selected_data==="chi") {
		populate_tweets_CHI();
		populate_bins_CHI();
		populate_similarity_CHI();
	}
	if (selected_data==="sandy") {
		populate_tweets_Sandy();
		populate_bins_Sandy();
		populate_similarity_Sandy();
	}
		

	// Populate the visualization
	drawViz();
		
	// Populate the topic list - need to figure out how to handle topics at different bin slices
	populateTopics();
	
	// Populate the tweet list
	populateTweets(1);
		
	// Change labels for title
	$('#dataset_name').text(' | ' + idToName[selected_data]);
	
	// Hide the loading image
	$("#loader").hide();
	
  // Filters pane
  $(function() {
	  // node size sliders
	  var vals = jQuery.unique(similarityMap.nodes.map(function(node) { return node.value;}));
	  var minSize = d3.min(similarityMap.nodes, function (node) { return node.value;})
	  var maxSize = d3.max(similarityMap.nodes, function (node) { return node.value;})
	  $( "#topic_size_slider" ).slider({
        range: true,
        min: minSize,
        max: maxSize,
        values: [ minSize, maxSize ],
        slide: function( event, ui ) {
			if (vals.indexOf(ui.values[0]) == -1 || vals.indexOf(ui.values[1])==-1) return false;
            $( "#topic_size" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] + " tweets");
			filterViz();
         },
		 change: function( event, ui) {
 			if (vals.indexOf(ui.values[0]) == -1 || vals.indexOf(ui.values[1])==-1) return false;
            $( "#topic_size" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] + " tweets" );
		 	filterViz();
		}
          });
          $( "#topic_size" ).text( $( "#topic_size_slider" ).slider( "values", 0 ) +
              " - " + $( "#topic_size_slider" ).slider( "values", 1 ) + " tweets" );
	
	  // edge weight sliders
	  var edgeVals = jQuery.unique(similarityMap.links.map(function(link) { return Math.floor(link.value);}));
	  var minSize = d3.min(similarityMap.links, function (link) { return Math.floor(link.value);})
	  var maxSize = d3.max(similarityMap.links, function (link) { return Math.floor(link.value);})
	  $( "#similarity_weight_slider" ).slider({
       range: true,
       min: 0,
       max: maxSize,
       values: [ 0, maxSize ],
       slide: function( event, ui ) {
		   $( "#similarity_weight" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
		   filterViz();
        },
		change: function (event, ui) {
 		   $( "#similarity_weight" ).text( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			filterViz();
		}
         });
         $( "#similarity_weight" ).text( $( "#similarity_weight_slider" ).slider( "values", 0 ).toFixed(0) +
             " - " + $( "#similarity_weight_slider" ).slider( "values", 1 ).toFixed(0) );
			 
	  // topic type checkboxes
	  if ($(":checked").length < 5) {
		  $('input:checkbox:not(:checked)').attr("checked","true");
		  showAllNodesAndEdges();
	  }
	  
	  $('.checkall').click(function () {
		 $(this).parents('fieldset:eq(0)').find(':checkbox').attr('checked', this.checked);
	  });
	  
	  $('input[type=checkbox]').on("click", filterViz);
     });
	 
	 $('.type_option').on("click",function(e) {
		 var type = e.currentTarget.classList[0];
		 if (type=="all") return;
		 var $box = $('input[type=checkbox][value='+type+']');
		 $box.attr("checked",!$box.attr("checked"));
		 filterViz();
	 })
}

function filterViz() {
	$('.search_clear').click();
	showAllNodesAndEdges();
	
	var minSize = $("#topic_size_slider").slider("values")[0];
	var maxSize = $("#topic_size_slider").slider("values")[1];
	filterNodesBySize(minSize, maxSize);

	var minWeight = $("#similarity_weight_slider").slider("values")[0];
	var maxWeight = $("#similarity_weight_slider").slider("values")[1];
	filterEdgesByWeight(minWeight, maxWeight);
	
	// if there is a min-filter set, then filter unconnected nodes (included stand-alone)
	if (minWeight > $("#similarity_weight_slider").slider("option","min"))
		filterUnconnected();
	
	filterNodesByType();
	
	if (minWeight > $("#similarity_weight_slider").slider("option","min")
		|| maxWeight < $("#similarity_weight_slider").slider("option","max")
		|| minSize > $("#topic_size_slider").slider("option","min")
		|| maxSize < $("#topic_size_slider").slider("option","max")
		|| $("input[type=checkbox]:not(:checked)").length != 0) {
		$("#reset_filters").show();
		populateTopics();
	}
	else {
		$("#reset_filters").hide();
		populateTopics();
	}
		
}

function filterNodesBySize(min, max) {
	$("g.node").each(function(key, node) {
		var id = node.__data__.name;
		if (!(node.__data__.value >= min && node.__data__.value <= max)) {
			node.style["display"] = "none";
			$("path.t"+id).hide()
		}
	});
}


function filterEdgesByWeight(min, max) {
	$("path.link").each(function(key, path) {
		if (!(path.__data__.value >= min && path.__data__.value <= max)) {
			path.style["display"] = "none";
		}
	});	
}

function filterNodesByType() {
	var values = []
	$("input[type=checkbox]:not(:checked)").each(function(key, val) {
		values.push(val.value);
	});
	values.forEach(function(val) {
		$("g."+ val).each(function(key, node) {
			var id = node.__data__.name;
			node.style["display"] = "none";
			$("path.t"+id).hide();
		});
	});
}

function filterUnconnected() {
	// Filter nodes with no visible edges
	$("g.node").each(function(key, node) {
		var id = node.__data__.name;
		var paths = $(".t" + id).filter(function(index) {
			return this.style.display != "none";
		});
		if (paths.length == 0) node.style["display"] = "none";
	});
}
function showAllNodesAndEdges() {
	$("g.node").show();
	$("path").show();
}


function resetFilters() {
	$("#topic_size_slider").slider("values", [$("#topic_size_slider").slider("option","min"),
											  $("#topic_size_slider").slider("option","max")]);
	$("#similarity_weight_slider").slider("values", [$("#similarity_weight_slider").slider("option","min"),
											  		 $("#similarity_weight_slider").slider("option","max")]);
	
	$("input[type=checkbox]:not(:checked)").attr("checked","yes");
	
	showAllNodesAndEdges();
	
	populateTopics();
	$("#reset_filters").hide();
}
/**
 * Executes once the DOM is fully loaded
 */
$(document).ready(function() {	
	// Select handler for the dataset selector
	$("#data_selector").click(function() {
		$("#dataset-popup").show();
		$("#selectbox_datasets").show();
	});
	
	 $("#popup_data_selector").menu({
   	  select: function(event, ui) { 
  		var selection = ui.item.context.id;
		if (selection == "load_new") return;
		$("#dataset-popup").hide();
		$("#selectbox_datasets").hide();
		populateVisualization(selection);
	  }});
	  
	// Select handler for the about box
	$("#about").click(function() {
		$("#dataset-popup").show();
		$("#about-popup").show();
	});

	// Close about box
	$("#close_about").click(function() {
		$("#dataset-popup").hide();
		$("#about-popup").hide();
	});

		// Close data selector
	$("#close_select").click(function() {
		$("#dataset-popup").hide();
		$("#selectbox_datasets").hide();
	});

	$("#close_about").show();
	$("#close_select").show();

	  $("#view_all").click(function() {
	  	// if there is stuff in the search box, rehighlight (this will take care of unselecting topic too)
		liveSearch();
	});
	
	$("#reset_filters").click(resetFilters);
	
	$('input#topic_searchbox').keyup(liveSearch)
		.wrap('<span class=\"search_box\"></span>')
		.after('<img src="images/search_clear.png" alt="" / class=\"search_clear\" style=\"display:none;\">');
	
	$('.search_clear').click(function(){
		   $(this).parent().find('input').val('');
		   liveSearch();
	});
	
	// to show/hide "Search for word..." prompt
	$('input[type=text][title]').each(function(i){
	    $(this).addClass('input-prompt-' + i);
	    var promptSpan = $('<span class="input-prompt"/>');
	    $(promptSpan).attr('id', 'input-prompt-' + i);
	    $(promptSpan).append($(this).attr('title'));
	    $(promptSpan).click(function(){
	      $(this).hide();
	      $('.' + $(this).attr('id')).focus();
	    });
	    if($(this).val() != ''){
	      $(promptSpan).hide();
	    }
	    $(this).before(promptSpan);
	    $(this).focus(function(){
	      $('#input-prompt-' + i).hide();
	    });
	    $(this).blur(function(){
	      if($(this).val() == ''){
	        $('#input-prompt-' + i).show();
	      }
	    });
	  });
	  
	  // Filter pane tooltips
	$("label[for=topic_size]").on("mouseover",function(n) {
			tooltip.show("Each topic is sized by the number of tweets in that topic.");
		})
		.on("mouseout",function() {tooltip.hide();})
		
	$("label[for=topic_type]").on("mouseover",function(n) {
			tooltip.show("Topics are colored by whether they are emerging, continuing, ending, or standalone topics.");
		})
		.on("mouseout",function() {tooltip.hide();});
		
	
	$("label[for=similarity_weight]").on("mouseover",function(n) {
		tooltip.show("The similarity between two topics is calculated by the cosine similarity of the probabilities of the top 10 words in each topic. Edges between nodes are weighted by this value.");
		})
		.on("mouseout",function() {tooltip.hide();});
	
	
	$("span.emerging").on("mouseover",function(n) {
			tooltip.show("Topics which are not related to any topics to the immediate left of them.");
		})
		.on("mouseout",function() {tooltip.hide();});

	 $("span.continuing").on("mouseover",function(n) {
	 		tooltip.show("Topics which are related to topics immediately to the left AND right of them.");
	 	})
	 	.on("mouseout",function() {tooltip.hide();});
			
	 $("span.ending").on("mouseover",function(n) {
	 		tooltip.show("Topics which are not related to any topics to the immediate right of them.");
	 	})
	 	.on("mouseout",function() {tooltip.hide();});
	$("span.standalone").on("mouseover",function(n) {
			tooltip.show("Topics which are not related to any topics to the immediate left OR right of them.");
		})
		.on("mouseout",function() {tooltip.hide();});
		
		
		// Add click handler for tweet list
		$("#tweet_list").delegate(".tweet_card", "click",function() {
			// Show the tweet data
			var id = $(this).attr("id");
			showTweetData(id);} );
			
			$("#topic_list").delegate(".topic_card","click",function() {		
		var id = $(this).attr("id");
		showTopicData(id);
	});
});