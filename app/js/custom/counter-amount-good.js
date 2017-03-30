(function() {
    /*
     *    счетчик
     */
    var amount = document.getElementById('amount-good'),
        lessAmount = document.getElementById('less-amount'),
        moreAmount = document.getElementById('more-amount');

    amount.addEventListener('keydown', function(event) {
        if( (isNaN(event.key) || event.key == " ") && event.key != "Backspace" ) {
            event.preventDefault();
        }
    });

    lessAmount.addEventListener('click', function(event) {

        if(amount.value == 1)
            return false;

        amount.value--;
    });

    moreAmount.addEventListener('click', function(event) {
        amount.value++;
    });
})();