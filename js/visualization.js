var randomTextArray = ["beer...", "ale...", "lager...", "amber ale...", "pale ale...", "stout...", "wine...", "red wine...", "white wine...", "medium red...", "zinfandel...", "pinot...", "orange...", "dry...", "rose...", "citrusy light white...", "old fashioned...", "orange...", "whisky...", "vodka...", "gin...", "rum...", "tequila...", "tomato...", "apple...", "cider..."]

function RndText() {
  var rannum = Math.floor(Math.random() * randomTextArray.length);

  $('.tryRandom').fadeOut('slow', function() {
    $(this).text(randomTextArray[rannum]).fadeIn('slow');
  });
}

$(function() {
  RndText();
});
var inter = setInterval(function() {
  RndText();
}, 3000);

var haystack = [];
var newHaystack = [];

d3.json("js/search_terms.json", function(terms) {
  for (var i = 0; i < terms.length; i++) {
    t = terms[i];
    haystack.push(t.name);
    haystack.push(t.drink);
    haystack.push(t.category);
    haystack.push(t.type);
  }
})

$.getJSON("js/haystack.json", function(data) {
  newHaystack = data;
});



jQuery(document).ready(function($) {});

$(function() {
  $('#searchHome').suggest(haystack, {
    suggestionColor: '#cccccc',
    moreIndicatorClass: 'suggest-more',
    moreIndicatorText: ''
  });

  $("#searchHome").keyup(function() {
    // $('.under').fadeOut('medium', function() {
    //   $(this).html('Hit enter to search').fadeIn('slow');
    // });
    $('.under').html('Hit enter to search').fadeIn('slow');
  })
});

setTimeout(function() {
  var $select = $('.input-tags').selectize({
    plugins: ['remove_button'],
    maxItems: 4,
    valueField: 'name',
    labelField: 'name',
    searchField: ['name'],
    options: newHaystack,
    openOnFocus: false,
    render: {
      item: function(item, escape) {
        return '<div>' +
          (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
          '</div>';
      }
    }
  });
  var selectize = $select[0].selectize;

  $('.input-tags').focusin(function() {
    selectize.close();
    console.log("focus")
  })

  $('.input-tags').on("change", function(event) {
    selectize.close();
    values = selectize.getValue();
    values = values.split(",")
    newSearch(values);
  });
}, 10);


var searchResults = [],
  searchTerm = "";

var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "name",
    "type",
    "category",
    "sub",
    "left",
    "drink"
  ]
};


function newSearch(values) {


  d3.json("js/search_terms.json", function(terms) {
    var value0 = values[0],
      value1 = values[1],
      value2 = values[2],
      value3 = values[3];


    if (values.length === 1) {
      var fuse = new Fuse(terms, options);
      var result0 = fuse.search(value0);
      searchResults = result0;
      drawDranks(result0);
      console.log(result0);
    } else {
      if (values.length === 2) {
        var fuse = new Fuse(terms, options);
        var result0 = fuse.search(value0);
        var fuse1 = new Fuse(result0, options);
        var result1 = fuse1.search(value1);
        searchResults = result1;
        drawDranks(result1);
        console.log(result1);
      } else {
        if (values.length === 3) {
          var fuse = new Fuse(terms, options);
          var result0 = fuse.search(value0);
          var fuse1 = new Fuse(result0, options);
          var result1 = fuse1.search(value1);
          var fuse2 = new Fuse(result1, options);
          var result2 = fuse2.search(value1);
          searchResults = result2;
          drawDranks(result2);
          console.log(result2);
        } else {
          if (values.length === 4) {
            var fuse = new Fuse(terms, options);
            var result0 = fuse.search(value0);
            var fuse1 = new Fuse(result0, options);
            var result1 = fuse1.search(value1);
            var fuse2 = new Fuse(result1, options);
            var result2 = fuse2.search(value1);
            var fuse3 = new Fuse(result2, options);
            var result3 = fuse3.search(value3);
            searchResults = result3;
            drawDranks(result3);
            console.log(result3);
          }
        }
      }
    }
  });
}

//
//
// function homeSearchEnter(value) {
//   $(".fullWrapper").addClass("fullWrapperUp");
//   $(".try").addClass("tryDown");
//
//   d3.json("js/search_terms.json", function(terms) {
//     var fuse = new Fuse(terms, options);
//     var result = fuse.search(value);
//     searchResults = result;
//     searchTerm = value;
//     drawDranks(result);
//     // launchSearch(result);
//     console.log(searchResults);
//   })
// }

// var svg = d3.select("#row1").append("svg").attr("class", "svgMain"),
//   g = svg.append("g");

function drawDranks(data) {
  $('.under').css("opacity", 0);
  $(".try").css("opacity", 0);
  $(".logo").css("opacity", 0);
  $(".fullWrapper").addClass("fullWrapper-top");
  $(".fullInner").addClass("fullInner-top");
  $(".selectize-input").addClass("selectize-input-top");
  $("#input-tags-selectized").css("height", "50px").css("font-size", "18px").css("color", "white");

  d3.selectAll(".dRemove").remove()

  // var tag1 = d3.select(".header").append("div").attr("class", "tag").html(searchTerm);

  for (var i = 0; i < data.length; i++) {
    var d = data[i],
      color = d.colour,
      name = d.name,
      type = d.type,
      sub = d.sub,
      left = d.left;

    var drinkContainer = d3.select("#row1").append("div").attr("class", "dRemove box col-md-3 col-sm-4 col-xs-12").attr("id", "drank-" + i).html('<div class="dRemove box_inner" id="box_inner-' + i + '"></div>');
    $(".box").css("height", $(".box").width() + "px");

    var drinkInner = d3.select("#box_inner-" + i);
    drinkInner.style("background-color", "none").transition().duration(500).style("background-color", color);

    var rgb = hexToRgb(color)
    var o = Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) / 1000);

    if (o > 200) {
      drinkInner.style("color", "#333");
    } else {
      drinkInner.style("color", "white");
    }

    drinkInner.on("click", function(d) {
      drinkClick(this);
    });

    drinkInner.append("div")
      .attr("class", "dName")
      .html(name);

    drinkInner.append("div")
      .attr("class", "dSub")
      .html(sub.substring(0, 50));

    drinkInner.append("div")
      .attr("class", "dLeft")
      .html(left + "%");

    drinkInner.append("div")
      .attr("class", "dRight")
      .html(type);

    drinkInner.append("div")
      .attr("class", "dGlass")
      .attr("id", "dGlass-" + i);

    $("#dGlass-" + i).html(d.code);
    // .html(d.code);

    d3.select("#row1").transition().delay(2000).duration(1000).style("opacity", 1);
  }
}




function drinkClick(thisDrink) {
  var index = $(thisDrink).attr("id");
  index = index.substring(10, index.length);
  var deets = searchResults[index];

  d3.select("#drank-" + index).append("div").attr("class", "drinkOverlay").html("<div class='drinkOverlay-inner' id='drinkOverlay" + index + "'></div>");
  var drinkOverlay = d3.select("#drinkOverlay" + index).style("display", "flex").style("align-items", "center").append("div").style("width", "100%").style("text-align", "center").style("color", "white").style("padding", "15px");

  var drink = deets.drink.replace("s", ""),
    category = deets.category,
    type = deets.type,
    glassware = deets.glassware,
    info1 = deets.info1,
    info2 = deets.info2,
    info3 = deets.info3,
    info4 = deets.info4,
    name = deets.name,
    color = deets.colour;
  if (deets.drink === "beers") {
    drinkOverlay.html("<div class='oL1 oLt'>Drink</div><div class='oL15 oLm'>" + drink + "</div><div class='oL2 oLt'>Category</div><div class='oL25 oLm'>" + category + "</div><div class='oL3 oLt'>Colour</div><div class='oL35 oLm'>" + info1 + "</div><div class='oL4 oLt'>Clarity</div><div class='oL45 oLm'>" + info3 + "</div><div class='oL5 oLt'>Served in:</div><div class='oL55 oLm'>a " + glassware + " glass</div>");
  } else {
    if (deets.drink === "wines") {
      drinkOverlay.html("<div class='oL1 oLt'>Drink</div><div class='oL15 oLm'>" + drink + "</div><div class='oL2 oLt'>Category</div><div class='oL25 oLm'>" + category + "</div><div class='oL4 oLt'>Origins</div><div class='oL45 oLm'>" + info1 + "</div>");
    } else {
      drinkOverlay.html("<div class='oL1 oLt'>Drink</div><div class='oL15 oLm'>" + drink + "</div><div class='oL2 oLt'>Category</div><div class='oL25 oLm'>" + type + "</div><div class='oL4 oLt'>Ingredients</div><div class='oL45 oLm'>" + info1 + "</div><div class='oL5 oLt'>Served in:</div><div class='oL55 oLm'>a " + glassware + " glass</div>");
    }
  }
  var exit = drinkOverlay.append("div").attr("class", "exit").html('<i class="fa fa-times" aria-hidden="true"></i>');
  exit.on("click", function(d) {
    d3.selectAll("#drinkOverlay" + index).remove();
  })
  drinkOverlay.on("click", function(d) {
    d3.selectAll("#drinkOverlay" + index).remove();
  })
}









function getRGB(str) {
  var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? {
    red: match[1],
    green: match[2],
    blue: match[3]
  } : {};
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
