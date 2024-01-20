/*
smash.js RETRY
(not) copyright 2023 elliott black
made with love, tears, and Trout Mask Replica

i do not want to talk about the embarassment that was the previous smash.js
*/

/*
MAIN GOALS

|  Perform GET requests to pokeapi.co without making website break via async or callback functions.
|  Use results of GET requests to modify website content on the fly.
|  Save a token to localStorage per smash logging what the choice was and when it was made.
|  Configure a modal popup for viewing the smash log and the no-sue-pls notice.
|  Maintain sanity. (optional)
*/

$(onPageLoad);


// document ready wrapper for sanity purposes
async function onPageLoad(){
    // setup onclick events
    registerClickEvents();
    // configure page to default if necessary
    // resetPage();
    // do the funny
    let boobs = await createNewSmash();
}


// click event binder
function registerClickEvents(){
    let $retry = $("#btn-retry"); // restarts the page when the redo button is clicked
    $retry.click(resetPage);

    let $history = $("#btn-history"); // unimplemented
    // $history.click();

    let $disclaimer = $("#btn-disclaimer");
    $disclaimer.click(showDisclaimer);
    
//    let $modal = $("#modal"); //  modal closes if you click on the page
//    $modal.click(deactivateModal);
//    let $modalContent = $("#modal-text");
//    $modalContent.click(); // DO NOT CLOSE THE MODAL YET
    // i hate selectors
    let $window = $(window);
    let $modal = $("#modal");
    let $modalContent = $("#modal-content");
    $window.click(function(event){
        if(event.target == $modal[0]){
            deactivateModal();
        }
        else{
            //nothing
        };
    });
    
    let $modalClose = $("#close");
    $modalClose.click(deactivateModal); // or the X button
}



async function fetchPokeAPIData(dbURL){
   // let bobbert = "https://pokeapi.co/api/v2/" + dbURL;
    let lol = await $.ajax(
        {
            type:"GET",
            url:dbURL,
            success:function(result){
                //console.log(result);
            }
        }
    );
    //console.log(lol);
    return lol;
}

async function createPokemonArtwork(pos,url){
    let data = await fetchPokeAPIData(url);
    console.log(data);
    let artworkURL = data.sprites.other["official-artwork"].front_default;
    console.log(artworkURL);
    if(pos == "left"){
        $("#imgL")[0].setAttribute("src",artworkURL);
    }else{
        $("#imgR")[0].setAttribute("src",artworkURL);
    };
}

async function fillPokemonData(pos,number){
    let url = "https://pokeapi.co/api/v2/pokemon-species/" + number;
    let pokemonData = await fetchPokeAPIData(url);
    let pokemonName = pokemonData.names[8].name;
    let pokemonDetailURL = pokemonData.varieties[0].pokemon.url;
    console.log(pokemonName);
    if(pos == "left"){
        $("#titleL").text(pokemonName);
        $("#entryL").text(number);
    }else{
        $("#titleR").text(pokemonName);
        $("#entryR").text(number);
    };
    createPokemonArtwork(pos,pokemonDetailURL);
}

async function createNewSmash(){
    $("#btn-smashL").prop("disabled", true); // prevents bug leading to nil pokemon smashes
    $("#btn-smashR").prop("disabled", true);
    
    let randInt01 = Math.floor(Math.random()*1016) + 1; // There are only 1017 logged pokemon.
    let randInt02 = Math.floor(Math.random()*1016) + 1; // Google says they're missing 4...
    if(randInt01 == randInt02){ // May be unnecessary, but just in case.
        console.log("Optionless smash detected, re-generating...");
        while(randInt01 == randInt02){
            randInt02 = Math.floor(Math.random()*1016) + 1; // PLAY IT AGAIN, VERN
        }
    }
    fillPokemonData("left",randInt01);
    fillPokemonData("right",randInt02);

    $("#btn-smashL").prop("disabled", false); // that was embarassing
    $("#btn-smashR").prop("disabled", false);
    
    let $left = $("#btn-smashL");
    let $right = $("#btn-smashR");
    $left.click(function(){
        registerSmashed("left")
        });
    $right.click(function(){
        registerSmashed("right")
        });
    
    return 1;
}


// todo set up a $(document).ready wrapper for this and other stuff
//createNewSmash();



async function resetPage(){
    $("#after-smash").fadeOut(300); // hide post-smash options <div>
    //$("#btn-smashL").prop("disabled", true);
    //$("#btn-smashR").prop("disabled", true); // redundant
    let $left = $("#btn-smashL");
    let $right = $("#btn-smashR");
    wipeClasses($left);
    wipeClasses($right);
    
    let isThisNecessary = await createNewSmash();
    console.log("Page reset with status code " + isThisNecessary);
    $("#btn-smashL").prop("disabled", false);
    $("#btn-smashR").prop("disabled", false);
}
async function wipeClasses($button){
    if($button.hasClass("button-selected")){
        $button.removeClass("button-selected");
    }
    if($button.hasClass("button-unselected")){
        $button.removeClass("button-unselected");
    }
}

function registerSmashed(pos){
    // Log which pokemon were decided between, and which one was chosen.
    console.log("Registering smash...");
    let smashLogEntry = {
        date: 0, //replace later
        smashed: pos,
        left_name: "Lopunny", //we replace these later
        left_id: "428",
        right_name: "Amoonguss",
        right_id: "591"
    };
    smashLogEntry.left_name = $("#titleL").text();
    smashLogEntry.left_id = $("#entryL").text();
    smashLogEntry.right_name = $("#titleR").text();
    smashLogEntry.right_id = $("#entryR").text();
    let d = new Date();
    smashLogEntry.date = d.getTime();

    // code that adds smashLogEntry to localStorage

    // code that disables both smash buttons and unveils post-smash bar
    let $left = $("#btn-smashL");
    let $right = $("#btn-smashR");
    let $afterSmash = $("#after-smash");
    $left.prop("disabled", true);
    $right.prop("disabled", true);
    // Set up visual representation of smashing.
    
    if(pos == "left"){
        $left.addClass("button-selected");
        // Code that fades out right side smash button.
        $right.addClass("button-unselected");
        // Code that fades out right side icon?
        // Code that colors left side name green?
        console.log("left add code running");
    }else{
        $right.addClass("button-selected");
        // Code that fades out left side smash button.
        $left.addClass("button-unselected");
        // Code that fades out left side icon?
        // Code that colors right side name green?
        console.log("right add code running");
    }

    // code that unhides the retry button
    //let $afterSmash = $("#after-smash");
    $afterSmash.fadeIn(300);
//    $("#btn-retry").delay(1000).slideDown(600, "linear");
}

function showSmashed(){
    // code that opens localstorage and checks entries for domain
    // code that iterates through localstorage entries starting from most recent
    // code that translates localstorage entry to user friendly format
    // code that adds entry to scrolling table of past smashes
    // (OPTIONAL) - code that makes clicking on entry bring back up the same smash/pass
    // code that breaks loop when complete and opens modal with scrolling table inside
    let $modalHTML = $("#modal-text");
    let outputString = "<p> Warning: This is still in development. </p> "; // we build on this later
    outputString = outputString + "<h3> Smash History </h3> <ul>";



    // do stuff

    
    outputString = outputString + "</ul>";
    //console.log(outputString);
    // $modalHTML.html(outputString);
    
    activateModal();
}

function showDisclaimer(){
    let disclaimerText = "This project runs on jQuery 3.6.0, which belongs to the jQuery foundation, and uses PokéAPI, which is owned and maintained by the PokéAPI community. Pokémon and the Pokémon brand are property of The Pokemon Company, a subsidiary of Nintendo Co. Limited. I own nothing. NOTHING!";
    $("#modal-text").text(disclaimerText);
    activateModal();
}

function deactivateModal(){
    let $modal = $("#modal");
    $modal.hide();
    let $modalText = $("#modal-text");
    $modalText.text("");
}

function activateModal(){
    let $modal = $("#modal");
    $modal.show();
}

