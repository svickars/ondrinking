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

var haystack = []
d3.json("js/search_terms.json", function(terms) {
  for (var i = 0; i < terms.length; i++) {
    t = terms[i];
    haystack.push(t.name);
    haystack.push(t.drink);
    haystack.push(t.category);
    haystack.push(t.type);
  }
})

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

function homeSearchEnter(value) {
  $(".fullWrapper").addClass("fullWrapperUp");
  $(".try").addClass("tryDown");

  d3.json("js/search_terms.json", function(terms) {
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
    var fuse = new Fuse(terms, options);
    var result = fuse.search(value);
    drawDranks(result);
  })
}

function drawDranks(data) {
  for (var i = 0; i < data.length; i++) {
    var d = data[i],
      color = d.colour,
      name = d.name,
      type = d.type,
      sub = d.sub,
      left = d.left;

    var drinkContainer = d3.select("#row1").append("div").attr("class", "box col-md-3 col-sm-4 col-xs-12").html('<div class="box_inner" id="box_inner-' + i + '"></div>');
    $(".box").css("height", $(".box").width() + "px")

    var drinkInner = d3.select("#box_inner-" + i);
    drinkInner.style("background-color", "none").transition().duration(500).style("background-color", color);

    drinkInner.append("div")
      .attr("class", "dName")
      .html(name);

    drinkInner.append("div")
      .attr("class", "dSub")
      .html(sub);

    drinkInner.append("div")
      .attr("class", "dLeft")
      .html(left + "%");

    drinkInner.append("div")
      .attr("class", "dRight")
      .html(type);

    drinkInner.append("div")
      .attr("class", "dGlass")
      .html(d.code);

    d3.select("#row1").transition().delay(500).duration(500).style("opacity", 1);

  }
}



function loadDrinks(thing) {
  d3.json("js/data.json", function(data) {
    data = data[thing];

    for (var i = 0; i < data.length; i++) {
      var d = data[i],
        color = d.colour,
        name = d.name,
        type = d.type;


      var drinkContainer = d3.select("#row1").append("div").attr("class", "box col-md-3 col-sm-4 col-xs-12").html('<div class="box_inner" id="box_inner-' + i + '"></div>');
      $(".box").css("height", $(".box").width() + "px")

      var drinkInner = d3.select("#box_inner-" + i);
      drinkInner.style("background-color", color);

      drinkInner.append("div")
        .attr("class", "dName")
        .html(name);

      if (thing === "beer") {
        var IBUl = d.IBU_low,
          IBUh = d.IBU_high,
          ABVl = d.ABV_low.toFixed(1),
          ABVh = d.ABV_high.toFixed(1);
        drinkInner.append("div")
          .attr("class", "dSub")
          .html(IBUl + "-" + IBUh + " IBUs");

        drinkInner.append("div")
          .attr("class", "dLeft")
          .html(ABVl + "-" + ABVh + "%");
      } else {
        if (thing === "wine") {
          var country = d.country,
            ABV = d.abv;

          if (country.length > 60) {
            country = country.substring(0, 50) + "..."
          } else {
            country = country;
          }

          drinkInner.append("div")
            .attr("class", "dSub")
            .html(country);

          drinkInner.append("div")
            .attr("class", "dLeft")
            .html(ABV + "%");
        } else {
          var flavour = (d.flavour),
            ABV = d.abv.toFixed(1);
          drinkInner.append("div")
            .attr("class", "dSub")
            .html(flavour);

          drinkInner.append("div")
            .attr("class", "dLeft")
            .html(ABV + "%");
        }
      }

      drinkInner.append("div")
        .attr("class", "dRight")
        .html(type);

      drinkInner.append("div")
        .attr("class", "dGlass")
        .html(d.code);

    }
  })
}
