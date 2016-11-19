//Last data variable used to store the data from the previous getOffers call
var lastData = [];
var dataInvalid = false;

//Initial update function, uses update parameter to force an update
function updateOffers(update, data) {
    //sets update to false, if update is not defined
    if (update === undefined) {
        update = false;
    }

    //Checks if data was invalidated on view update and forces an update if true
    if (dataInvalid){
        update = true;
        dataInvalid = false;
    }
    //Checks if the arraylength of data and lastData is the same
    if (lastData.length !== data.data.length && !update) {
        update = true;
    }
    //If update not already true, checks if the offer ids contained in lastData and data matches,
    // if not, sets update to true
    if (!update) {
        for (var i = 0; i < data.data.length; i++) {
            if (data.data[i].id !== lastData[i].id) {
                update = true;
            }
        }
    }

    if (update) {
        //Clears saved exchangeRates
        exchangeRates = [];
        onOffer = 0;

        //Creates a copy of the data array
        lastData = data.data.slice();

        addOffer(data.data);
    }
}

//Constructs the html string and stores it in offers
function createOfferHtml(offer, offers) {
    var offerHtml = "<tr>" +
        "<td>" + offer.id + "</td>" +
        "<td>" + offer.toCurrency + "</td>" +
        "<td>" + offer.amount + "</td>" +
        "<td>" + offer.since + "</td>" +
        "<td>" + offer.exchange + "</td>" +
        "<td>" +
        "<button id=" + offer.id + " class='btn btn-primary btn-xs'>Buy</button>" +
        "</td></tr>\n";
    offers.html += offerHtml;
    offers.ids.push({id: offer.id, currency: offer.toCurrency});
}

//Constructs offers from offersData
function addOffer(offersData, offers) {
    //Used if initial addOffer call
    if (offers === undefined) {
        offers = {ids: [], html: ""};
    }

    //Checks if offersData contains any more offers, if so, it pops if off the array. If not, it calls updateOffersView
    // and breaks the recursive call by returning.
    if (offersData.length > 0) {
        var offerData = offersData.pop();
    } else {
        updateOffersView(offers);
        return;
    }

    //Constructs offer object
    var offer = {
        id: offerData.id,
        toCurrency: offerData.currency,
        amount: offerData.amount,
        since: offerData.since
    };

    //Checks toCurrency
    if (offer.toCurrency !== ownCurrency) {
        //Checks if toCurrency is already saved to the exchangeRate list
        var alreadySavedResult = alreadySaved(offer); //Return if exchangeRate is already saved, if so, also returns the saved exchangeRate
        if (!alreadySavedResult.alreadySaved) {
            addExchange(offer, offers, offersData); //Retrieves exchangeRate from API
        } else {
            offer.exchange = alreadySavedResult.exchange;
            createOfferHtml(offer, offers); //Creates html for current offer
            addOffer(offersData, offers); //Calls itself to continue to next offer
        }
    } else {
        offer.exchange = 100;
        onOffer += parseFloat(offer.amount);
        createOfferHtml(offer, offers); //Creates html for current offer
        addOffer(offersData, offers); //Calls itself to continue to the next offer
    }
}
var lastDataError;
var offersIdError;

//Updates the offers table in the view with the offers data
function updateOffersView(offers) {
    $("#currentOffersTable").html(offers.html); //Replaces current offersTable html with offers.html
    offers.ids.forEach(function (id) {
        //Registers listener for each buy button
        $("#" + id.id).click(function () {
            buyOffer($(this).attr("id"));
        });
        //Hides buy button on own offers
        if (id.currency === ownCurrency) {
            $("#" + id.id).hide();
        }
    });

    //If offers.ids.length doesnt match lastData.length, forces an update on next getOffers.
    if (offers.ids.length !== lastData.length){
        dataInvalid = true;
    }
    //Updates rest of view data
    updateExchangeTable();
    getAccountData();
}

//Submits offer
function submitOffer(amount) {
    submitOfferAjax(amount);
}

//DEBUG
function checkDupes(offers) {
    offers.ids.forEach(function (id) {
        count = 0;
        offers.ids.forEach(function (id1) {
            if (id === id1){
                count++;
            }
        });
        if (count > 1){
            console.log("Dupe detected");
        }
    });
}