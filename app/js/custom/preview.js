(function() {
    var uploadElements  = document.getElementById('upload'),    /*инпут типа файл*/
        previewImg      = document.getElementById('preview-img'),/*тут выводятся превьюшки изображений*/
        previewText     = document.getElementById('preview-text'),/*тут выводятся наименования файлов*/
        formData        = new FormData(),   /*объект формДата для отправки файлов на сервер*/
        form            = document.getElementById('formWithFile'), /*форма*/
        uploadButton    = document.getElementById('upload-button'), /*кнопка загрузки*/
        xhr             = new XMLHttpRequest();

    /*событие загрузки файлов*/
    uploadElements.addEventListener("change", function(e) {
        var arr = [].slice.call(this.files);

        if(arr.length == 0)
            return;

        arr.forEach(function (item, i, arr) {
            preview(item);

            var newName = rename(item.name,1);

            formData.append('file[' + newName + ']', item, newName);

        });
    });

    /*отправка формы*/
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

    /*удаление файлов*/
    deleteFiles = function (obj) {
        var fileName = rename(obj.getAttribute('name'),2),
            img      = previewImg.childNodes;

        img.forEach(function(item, i, arr) {
            var newName = rename(item.name,1);

            if(newName == fileName) {
                item.remove();
            }
        });

        obj.parentNode.remove();
        formData.delete('file[' + fileName + ']');
    };

    /*показ превью и наименования файлов*/
    function preview(file) {
        var newName = rename(file.name,1);

        /*тут также можно сделать проверку на соответствие типу файла*/
        if ( file.type.match(/image.*/) ) {
            var reader = new FileReader(), img;

            reader.addEventListener("load", function(event) {
                img = document.createElement('img');
                img.src = event.target.result;
                img.name = newName;
                previewImg.appendChild(img);
            });

            reader.readAsDataURL(file);
        }

        var li = document.createElement('li');
        li.innerHTML = "<span>" + newName + "</span>" + " " + "<button type='button' name='" + newName + "' onclick='deleteFiles(this)'>X</button>";
        previewText.appendChild(li);
    }

    /*замена регулярным выражением кавычек в имени*/
    function rename(name,number) {
        switch(number) {
            case 1:  return name.replace(/'/g, '&#34;'); break;
            case 2:  return name.replace(/"/g, '&#34;'); break;
        }
    }
})();

