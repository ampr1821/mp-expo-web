
class CustomPrompt {
    constructor() {
        this.render = function (dialog, fctn) {
            var winW = window.innerWidth;
            var winH = window.innerHeight;
            var dialogoverlay = document.getElementById('dialogoverlay');
            var dialogbox = document.getElementById('dialogbox');
            dialogoverlay.style.display = "block";
            dialogoverlay.style.height = winH + "px";
            dialogbox.style.left = (winW / 2) - (560 * .5) + "px";
            dialogbox.style.top = "5px";
            dialogbox.style.display = "block";
            document.getElementById('dialogboxhead').innerHTML = "The Ambulance form 📄";
            document.getElementById('dialogboxbody').innerHTML = "Enter the patinet's name : ";
            document.getElementById('dialogboxbody').innerHTML += '<br><input id="prompt_value1"/>';
            document.getElementById('dialogboxfoot').innerHTML = '<button onclick="promot.ok(\'' + fctn + '\')">OK</button> <button onclick="promot.cancel()">Cancel</button>';
        };
        this.cancel = function () {
            document.getElementById('dialogoverlay').style.display = "none";
            document.getElementById('dialogbox').style.display = "none";
        };
        this.ok = function (fctn) {
            var prompt_value1 = document.getElementById('prompt_value1').value;
            // window[fctn](prompt_value1);
            console.log("this is the paitent name: "+prompt_value1 )
            document.getElementById('dialogoverlay').style.display = "none";
            document.getElementById('dialogbox').style.display = "none";

            //call the gridLay.js
                // const scp = document.createElement("script");
	            // document.getElementById("grid").setAttribute("src", "gridLay.js");
                gridval = true;
                drawGrid();


        };
    }
}
var promot = new CustomPrompt();

function changeText(val){ 
	document.getElementById('status').innerHTML = val;
	}
     
// function doStuff(val){ 
// 	document.body.style.background = val; 
// 	} 