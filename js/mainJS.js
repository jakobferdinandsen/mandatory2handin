var bankApi = "http://52.57.228.6/man2API/php/BankPhp.php?";
var apiKey = "";

//DATA REFRESH INTERVALS
var interval;
var forceUpdate;

$(document).ready(function () {
    //Submit offer listener
    $("#createOfferButton").click(function () {
        submitOffer($("#createOfferInput").val());
    });

    //Change API key listener
    $("#changeApiKeyButton").click(function () {
        setApiKey($("#changeApiKeyInput").val());
    });

    //Loads account data, forced here in case getOffers() is slow
    getAccountData();

    //Initial loading of offer data
    getOffers();

    //Calls getOffers every 3 seconds
    interval = setInterval(getOffers, 3000);

    //Calls getOffers with update = true to force update every 4 minutes.
    // This is to avoid 5 minute old data on the page as getOffers doesnt update page content if there are no updates
    forceUpdate = setInterval("getOffers(true)", 240000);
});
