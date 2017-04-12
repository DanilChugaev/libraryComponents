(function() {
    let arrOpenModalLink = [].slice.call( document.getElementsByClassName("open-modal") ),
        arrCloseModalLink = [].slice.call( document.getElementsByClassName("open-modal") );

    arrOpenModalLink.forEach(function(item, i, arr){
       item.addEventListener('click', function(event){
           event.preventDefault();
           let attr  = ( this.getAttribute('href') ).slice(1),
               modal = document.getElementById(attr);

           modal.style.display = "block";
       });
    });

    // var modal = document.getElementById('policy'),
    //     activate = document.getElementById("activate-modal"),
    //     close = document.getElementsByClassName("modal__close")[0];
    //
    // activate.onclick = function() {
    //     modal.style.display = "block";
    // }
    // /*закрывает модальное окно при клике на крестик*/
    // close.onclick = function() {
    //     modal.style.display = "none";
    // }
    // /*закрывает модальное окно при клике на пространстве вне модального окна*/
    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }
    // /*закрывает модальное окно при клике на ESC*/
    // window.onkeydown = function(event) {
    //     if (event.keyCode == 27) {
    //         modal.style.display = "none";
    //     }
    // };
})();
