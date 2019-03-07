var quavers  = ["GG ", "zG ", "Gz "]
var triplets = ["(3GGG "]
var easysemi = ["G/G/G/G/ ", "GG/G/ ", "G/G/G ", "G3/2G/ "]
var hardsemi = ["z/G/z/G/ ", "zz/G/ ", "z/G/G/z/ ", "G/GG/ ", "z/G/z ", "zG/G/ ", "G/G/z ", "z/G/G/G/ "]

// 0000 // z2
// 0001 // zz/G/
// 0010 // zG
// 0100 // z/G/z
// 1000 // G2 & Gz
// 0011 // zG/G/
// 0101 // z/G/z/G/
// 1001 // G3/2G/
// 0110 // z/G/G/z/
// 1010 // GG
// 1100 // G/G/z
// 0111 // z/G/G/G/
// 1011 // GG/G/
// 1101 // G/GG/
// 1110 // G/G/G
// 1111 // G/G/G/G/

var drums = [
    "dd 76 77 60 30",              // 2/4
    "ddd 76 77 77 60 30 30",       // 3/4
    "dddd 76 77 77 77 60 30 30 30" // 4/4
]

var abc;
var meter;
var dict;
var abcTune;

function makeDict() {
    var dict = ["G2 ", "z2 "];
    function pushValue(value) {	dict.push(value); }
    if (document.getElementById("quavers").checked)
	quavers.forEach(pushValue);
    if (document.getElementById("triplets").checked)
	triplets.forEach(pushValue);
    if (document.getElementById("easysemi").checked)
	easysemi.forEach(pushValue);
    if (document.getElementById("hardsemi").checked)
	hardsemi.forEach(pushValue);
    return dict;
}

function makemidi() {
    console.log("Generating MIDI...");
    if (document.getElementById("metro").checked) {
	ABCJS.renderMidi("control", abc, {
	    animate: {
    		listener: function animateCallback(lastRange, currentRange, context) {
    		    colorRange(lastRange, "#000000");
    		    colorRange(currentRange, "#3D9AFC");
    		},
    		target: abcTune[0]
    	    },
	    qpm: document.getElementById("tempo").value,
	    drum: drums[meter-2],
	    drumIntro: 1
	});
	document.getElementById("warning").style.display = "block";
    } else {
	ABCJS.renderMidi("control", abc, {
	    animate: {
    		listener: function animateCallback(lastRange, currentRange, context) {
    		    colorRange(lastRange, "#000000");
    		    colorRange(currentRange, "#3D9AFC");
    		},
    		target: abcTune[0]
    	    },
	    qpm: document.getElementById("tempo").value
	});
	document.getElementById("warning").style.display = "none";
    }	
}

function colorRange(range, color) {
    if (range && range.elements) {
        range.elements.forEach(function (set) {
            set.forEach(function (item) {
                item.setAttribute("fill", color);
            });
        });
    }
}

function createRhythm() {
    meter = Math.floor(Math.random() * 3) + 2;
    abc = "M: ".concat(meter);
    dict = makeDict();
    abc = abc.concat("/4\nL:1/8\n");
    for (bar = 0; bar < 8; bar++) {
	for (beat = 0; beat < meter; beat++) {
	    dice = Math.floor(Math.random() * dict.length)
	    abc = abc.concat(dict[dice]);
	}
	abc = abc.concat("|");
	if (bar == 3) abc = abc.concat("\n")
    }
    abc = abc.concat("G", meter * 2,"|]");
    console.log(abc);

    abcTune = ABCJS.renderAbc("notation", abc);
    makemidi();
}
