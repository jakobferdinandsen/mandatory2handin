//Exchangerate array to avoid calling the API for each offer.
var exchangeRates = [];

//Checks if exchangerate already is in the exchangeRates array, if not, it adds it.
function saveExchange(offer) {
    //Constructs new rate object
    var rate = {currency: offer.toCurrency, amount: offer.exchange};

    //Checks if exchange already exists in the exchangeRates array, if not, rate is pushed to the array.
    if (!alreadySaved(offer).alreadySaved) {
        exchangeRates.push(rate);
    }
}

//Checks if exchangerate already is in the exchangeRates array.
function alreadySaved(offer) {
    //Constructs nwe rate object
    var rate = {currency: offer.toCurrency, amount: offer.exchange};

    //Constructs new result object
    var result = {alreadySaved: false};

    //Checks exchangeRates array for rate.currency occurance
    exchangeRates.forEach(function (exchangeRate) {
        if (exchangeRate.currency === rate.currency) {
            result.alreadySaved = true;
            result.exchange = exchangeRate.amount;
        }
    });
    return result;
}

//Updates the exchange rate table in the view.
function updateExchangeTable() {
    //Clears table content
    $('#exchangeRateTableBody').html("");

    //Constructs html string for each exchangeRate and appends it to the table
    exchangeRates.forEach(function (exchangeRate) {
        if (exchangeRate.currency !== ownCurrency) {
            var rate = "<tr>" +
                "<td>" + exchangeRate.currency + "</td>" +
                "<td>" + exchangeRate.amount + "</td>" +
                "</tr>";
            $('#exchangeRateTableBody').append(rate);
        }
    })
}
