(function(){
    var maxSize = document.querySelector('#maxSize'),
        minSize = document.querySelector('#minSize'),
        maxWidth = document.querySelector('#maxWidth'),
        minWidth = document.querySelector('#minWidth'),
        result = document.querySelector('#result'),
        output = document.querySelector('#output-text');



        result.addEventListener('click', function() {
            var maxSizeVal =  maxSize.value,
                minSizeVal =  minSize.value,
                maxWidthVal = maxWidth.value,
                minWidthVal = minWidth.value;

           var m = ( maxSizeVal - minSizeVal ) / ( maxWidthVal - minWidthVal );

           var b = minSizeVal - m * minWidthVal;

           var y = m * 100 + b;

           var m_out = (m * 100).toFixed(2);
           var b_out = (b).toFixed(2);

           console.log('y = '+ m_out + 'vw + ' + b_out + 'px');
           output.value += 'y = calc( '+ m_out + 'vw + ' + b_out + 'px )\n';
        });
})();
