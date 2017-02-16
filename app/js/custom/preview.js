(function() {
    var uploadElements  = document.getElementById('upload'),    /*инпут типа файл*/
        previewImg      = document.getElementById('preview-img'),
        previewText     = document.getElementById('preview-text'),
        formData        = new FormData(),
        form            = document.getElementById('formWithFile'), /*форма*/
        uploadButton    = document.getElementById('upload-button'), /*кнопка загрузки*/
        xhr             = new XMLHttpRequest();

    uploadElements.addEventListener("change", function(e) {
        var arr = [].slice.call(this.files);

        if(arr.length == 0)
            return;

        arr.forEach(function (item, i, arr) {
            preview(item);

            formData.append('file[' + item.name + ']', item, item.name);

        });
    });

    form.onsubmit = function(event) {
        event.preventDefault();

        uploadButton.innerHTML = 'Загружаю...';

        xhr.open('POST', 'handler.php', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                uploadButton.innerHTML = 'Загружено';
            } else {
                uploadButton.innerHTML = 'Ошибка загрузки';
            }
        };

        xhr.send(formData);
    };

    deleteFiles = function (obj) {
        var fileName = obj.getAttribute('name'),
            img      = previewImg.childNodes;

        img.forEach(function(item, i, arr) {
            if(item.name == fileName) {
                item.remove();
            }
        });

        obj.parentNode.remove();
        formData.delete('file[' + fileName + ']');
    };

    function preview(file) {
        /*тут также можно сделать проверку на соответствие типу файла*/
        if ( file.type.match(/image.*/) ) {
            var reader = new FileReader(), img;

            reader.addEventListener("load", function(event) {
                img = document.createElement('img');
                img.src = event.target.result;
                img.name = file.name;
                previewImg.appendChild(img);
            });

            reader.readAsDataURL(file);
        }

        var li = document.createElement('li');
        li.innerHTML = "<span>" + file.name + "</span>" + " " + "<button type='button' name='" + file.name + "' onclick='deleteFiles(this)'>X</button>";
        previewText.appendChild(li);
    }
})();

