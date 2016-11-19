var ownCurrency = "";
var onOffer = 0;

//Updates account info in the view
function updateAccountData(data) {
    ownCurrency = data.data[0].currency;
    $("#accountInfoCurrency").html(ownCurrency);
    $("#accountInfoBalance").html(data.data[0].amount);
    $("#accountInfoOnOffer").html(onOffer);
}