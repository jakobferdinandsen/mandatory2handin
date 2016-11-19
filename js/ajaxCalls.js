//Call to retrieve account data
function getAccountData() {
    $.ajax({
        method: "GET",
        url: bankApi,
        data: {
            what: "account_info",
            apikey: apiKey
        },
        dataType: "json",
        success: function (data) {
            errorCheck(data);
            updateAccountData(data);
        },
        error: function (a, textStatus, errorThrown) {
            $.notify("Call to API failed: " + textStatus + "\n" + errorThrown, {position: "bottom right"});
        }
    });
}

//Call to retrieve offers data
function getOffers(update) {
    $.ajax({
        method: "GET",
        url: bankApi,
        data: {
            what: "offers",
            apikey: apiKey
        },
        dataType: "json",
        success: function (data) {
            errorCheck(data);
            updateOffers(update, data);
        },
        error: function (a, textStatus, errorThrown) {
            $.notify("Call to API failed: " + textStatus + "\n" + errorThrown, {position: "bottom right"});
        }
    });
}

//Call to retrieve specific exchangerate from ownCurrency to the currency of the specific offer
function addExchange(offer, offers, offersData) {
    $.ajax({
        method: "GET",
        url: bankApi,
        data: {
            what: "exchange_rate",
            from: ownCurrency,
            to: offer.toCurrency,
            apikey: apiKey
        },
        dataType: "json",
        success: function (data) {
            errorCheck(data);
            offer.exchange = data.data.amount;
            saveExchange(offer);
            createOfferHtml(offer, offers);
            addOffer(offersData, offers);
        },
        error: function (a, textStatus, errorThrown) {
            $.notify("Call to API failed: " + textStatus + "\n" + errorThrown, {position: "bottom right"});
        }
    });
}

//Call to buy specific offer
function buyOffer(id) {
    $("#"+id).hide();
    $.ajax({
        method: "GET",
        url: bankApi,
        data: {
            what: "buy",
            offer: id,
            apikey: apiKey
        },
        dataType: "json",
        success: function (data) {
            if (data.code !== undefined){
                $("#"+id).show();
            }
            errorCheck(data);
            getOffers(true);
        },
        error: function (a, textStatus, errorThrown) {
            $.notify("Call to API failed: " + textStatus + "\n" + errorThrown, {position: "bottom right"});
        }
    });
}

//Call to submit an offer
function submitOfferAjax(amount) {
    $.ajax({
        method: "GET",
        url: bankApi,
        data: {
            what: "sell",
            amount: amount,
            apikey: apiKey
        },
        dataType: "json",
        success: function (data) {
            errorCheck(data);
            getOffers(true);
        },
        error: function (a, textStatus, errorThrown) {
            $.notify("Call to API failed: " + textStatus + "\n" + errorThrown, {position: "bottom right"});
        }
    });
}

//Checks the returned data of an ajax call. if it contains data.code, it uses notifyJS to show the messages the API returned
function errorCheck(data) {
    if (data.code !== undefined) {
        $.notify("Code: " + data.code + "\n Status: " + data.status + "\n Message: " + data.msg, {position: "bottom right"});
    }
}

//Call to check if new API key is valid.
function setApiKey(key) {
    $.ajax({
        method: "GET",
        url: bankApi,
        data: {
            what: "account_info",
            apikey: key
        },
        dataType: "json",
        success: function (data) {
            errorCheck(data);
            //Updates view if data.data exists
            if (data.data !== undefined) {
                apiKey = key;
                getAccountData();
                getOffers(true);
                $('.modal').modal('hide');
                $('.loading').addClass('hidden');
                $('.delete').removeAttr('disabled');
            }
        },
        error: function (a, textStatus, errorThrown) {
            $.notify("Call to API failed: " + textStatus + "\n" + errorThrown, {position: "bottom right"});
        }
    });
}