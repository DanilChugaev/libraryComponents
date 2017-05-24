(function (window) {
	if (!!window.SSDownloadFiles) {
		return;
	}

  /*объект загрузки файлов*/
	window.SSDownloadFiles = function (param) {
		this.uploadElements  = param.uploadElements;
		this.previewText     = param.previewText;
		this.form            = param.form;
		this.uploadButton    = param.uploadButton;
		this.typeFiles       = param.typeFiles;
		this.droppable       = param.droppable;
		this.tempFormDataObj = [];
		/*+++*/
		this.previewImg      = param.previewImg;
		/*+++*/
		this.countFiles      = param.countFiles;
		this.reqCountFiles   = param.reqCountFiles;

		this.Init();
	};

  /*методы*/
	window.SSDownloadFiles.prototype.onChangeInputFiles = function(filesReceived) {
		// debugger;
		let caller = this,
			arr;

		var filesCreated = (filesReceived.currentTarget !== undefined) ? caller.uploadElements.files : filesReceived;

		arr = [].slice.call(filesCreated);
		caller.typeFiles.style.display = "none";

		if (arr.length == 0)
			return;

      /*определяем поддержку на forEach*/
		if (arr.forEach) {
			arr.forEach(function (item) {
				let tempFile = {};
				if (caller.countFiles < caller.reqCountFiles) {
					caller.preview(item);

					let newName = caller.renameFile(item.name, 1);

					tempFile.name = 'file[' + newName + ']';
					tempFile.value = item;
					tempFile.fileName = newName;
					caller.tempFormDataObj.push(tempFile);
					caller.countFiles++;
				}
			});
		} else {
          /*данный код для IE*/
			for (var i = 0; i < arr.length; i++) {
				let tempFile = {};
				if (caller.countFiles < caller.reqCountFiles) {
					caller.preview(arr[i]);

					let newName = caller.renameFile(arr[i].name, 1);

					tempFile.name = 'file[' + newName + ']';
					tempFile.value = arr[i];
					tempFile.fileName = newName;
					caller.tempFormDataObj.push(tempFile);
					caller.countFiles++;
				}
			}
		}
	};

	window.SSDownloadFiles.prototype.onSubmitForm = function(event) {
		event.preventDefault();
		let caller   = this,
			formData = new FormData(),
			xhr      = new XMLHttpRequest(),
			download = 'Загружаю...',
			send = 'Отправляю...',
			error = 'Ошибка отправки';

		caller.uploadButton.innerHTML = download;
		xhr.open('POST', 'handler.php', true);
		xhr.onload = function () {
			if (xhr.status === 200) {
				caller.uploadButton.innerHTML = send;
			} else {
				caller.uploadButton.innerHTML = error;
			}
		};

		caller.tempFormDataObj.forEach(function(item){
			formData.append(item.name, item.value, item.fileName);
		});

		xhr.send(formData);
	};

	window.SSDownloadFiles.prototype.onClickDroppable = function() {
		let caller = this;
		caller.uploadElements.value = null;
		caller.uploadElements.click();
	};

	window.SSDownloadFiles.prototype.onDropDroppable = function(event) {
		let caller = this,
			files;
		event.preventDefault();
		event.stopPropagation();
		caller.droppable.classList.remove('dragover');

		if (event.dataTransfer) {
			files = event.dataTransfer.files;
		} else if (event.target) {
			files = event.target.files;
		}

		caller.onChangeInputFiles(files);
	};

	window.SSDownloadFiles.prototype.onDragOverDroppable = function(event) {
		let caller = this;
		event.preventDefault();
		event.stopPropagation();
		caller.droppable.classList.add('dragover');
	};

	window.SSDownloadFiles.prototype.onDragLeaveDroppable = function(event) {
		let caller = this;
		event.preventDefault();
		event.stopPropagation();
		caller.droppable.classList.remove('dragover');
	};

	window.SSDownloadFiles.prototype.textCropping = function(text, max) {
		if (text.length <= 30)
			return text;

		return text.substring(0, max) + '...';
	};

	window.SSDownloadFiles.prototype.preview = function(file) {
		let caller = this,
			newName = caller.textCropping(caller.renameFile(file.name, 1), 30),
			li = document.createElement('li');

            /*+++*/

		if ( file.type.match(/image.*/) ) {
			var reader = new FileReader(), img;

			reader.addEventListener("load", function(event) {
				img = document.createElement('img');
				img.src = event.target.result;
				img.name = newName;
				caller.previewImg.appendChild(img); /*здесь картинка вставляется на страницу*/
			});

			reader.readAsDataURL(file);
		}

		/*+++*/

		li.setAttribute('class', 'document-list document-list__file-name');
		li.setAttribute('title', file.name);

		li.innerHTML = "<span>" + newName + "</span>" + " " + "<button class='add-document__delete' type='button' name='" + newName + "'></button>";
		caller.previewText.appendChild(li);

		li.addEventListener('click', function (event) {
			event.stopPropagation();
		});

		let button = li.querySelector('button');
		button.addEventListener('click', $.proxy( this.deleteFiles, this ));
	};

	window.SSDownloadFiles.prototype.renameFile = function(name, number) {
		switch (number) {
			case 1:
				return name.replace(/'/g, '&#34;');
				break;
			case 2:
				return name.replace(/"/g, '&#34;');
				break;
		}
	};

	window.SSDownloadFiles.prototype.deleteFiles = function(event) {
		event.stopPropagation();
		let caller = this,
			fileName = caller.renameFile(event.currentTarget.getAttribute('name'), 2),
			/*+++*/
			img      = this.previewImg.childNodes;

      /*определяем поддержку на forEach*/
		if (img.forEach) {
			img.forEach(function (item, i, arr) {
				var newName = caller.renameFile(item.name, 1);

				if (newName == fileName) {
					caller.createRemove();
					item.remove();
				}
			});
		} else {
          /*данный код для IE*/
			for (var i = 0; i < img.length; i++) {
				var newName = caller.renameFile(img[i].name, 1);

				if (newName == fileName) {
					debugger;
					caller.createRemove();
					img[i].remove();
				}
			}
		}
		/*+++*/

		caller.createRemove();
		event.currentTarget.parentNode.remove();
		caller.tempFormDataObj.splice(caller.tempFormDataObj.indexOf(fileName),1);
		caller.countFiles--;

		if (!caller.countFiles) {
			caller.typeFiles.style.display = "block";
		}
	};

	window.SSDownloadFiles.prototype.createRemove = function(someElement) {
		if (!someElement) {
			if (!Element.prototype.remove) {
				Element.prototype.remove = function remove() {
					if (this.parentNode) {
						this.parentNode.removeChild(this);
					}
				};
			}
		} else {
			if (!someElement.prototype.remove) {
				someElement.prototype.remove = function remove() {
					if (this.parentNode) {
						this.parentNode.removeChild(this);
					}
				};
			}
		}
	};

  /*инициализация объекта*/
	window.SSDownloadFiles.prototype.Init = function () {

		this.droppable.addEventListener('dragover', $.proxy( this.onDragOverDroppable, this ));
		this.droppable.addEventListener('dragleave', $.proxy( this.onDragLeaveDroppable, this ));
		this.droppable.addEventListener('drop', $.proxy( this.onDropDroppable, this ));
		this.droppable.addEventListener('click', $.proxy( this.onClickDroppable, this ));
		this.uploadElements.addEventListener('change', $.proxy( this.onChangeInputFiles, this ));
		this.form.addEventListener('submit', $.proxy( this.onSubmitForm, this) );

		console.log('create');
	};

  /*создание объекта*/
	new SSDownloadFiles({
		uploadElements  : document.querySelector('#upload'), /*инпут типа файл*/
		previewText     : document.querySelector('#preview-text'), /*тут выводятся наименования файлов*/
		form            : document.querySelector('#order-form'), /*форма*/
		uploadButton    : document.querySelector('#submit-button'), /*кнопка загрузки*/
		typeFiles       : document.querySelector('#type-files'),
		droppable       : document.querySelector('#droppable'),
		/*+++*/
        previewImg      : document.getElementById('preview-img'),/*тут выводятся превьюшки изображений*/
		/*+++*/
        countFiles      : 0,
		reqCountFiles   : 5
	});
})(window);