

		$(document).ready(function() {
			$('#createForm').submit(function(e) {
				e.preventDefault();
				var formData = new FormData(this);
				var imageFile = document.getElementById('image').files

				//var id = $('ID').val();
				console.log(id)
				formData.append('ID', id);
				if ('imageFile'){
					formData.append('image', imageFile)
				} else{
					console.log("No image");
				}
				//console.log(formData);
				$.ajax({
					url: '/update',
					type: 'POST',
					data: formData,
					processData: false,
					contentType: false,
					success: function(response){
						console.log(response);
						if (response.message){
							alert(response.message)
						}
					},
					error: function(xhr, status, error){
						console.error(error);

						if (xhr.status === 400) {
							alert(xhr.responseJSON.message);
						}
					}
				});
			});
		});
		var dropArea = document.getElementById('dropArea');

			['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
				dropArea.addEventListener(eventName, preventDefaults, false)
			});

			function preventDefaults (e) {
				e.preventDefault()
				e.stopPropagation()
			}
			;['dragenter', 'dragover'].forEach(eventName => {
				dropArea.addEventListener(eventName, highlight, false)
			});

			;['dragleave', 'drop'].forEach(eventName => {
				dropArea.addEventListener(eventName, unhighlight, false)
			});

			function highlight(e){
				dropArea.classList.add('highlight')
			}
			function unhighlight(e){
				dropArea.classList.remove('highlight');
			}

			dropArea.addEventListener('drop', handleDrop, false);

			function handleDrop(e){
				let dt = e.dataTransfer
				let files = dt.files

				handleFiles(files)
				document.getElementById('image').files = files;
			}

			function handleFiles(files){
				files = [...files]
				files.forEach(uploadFile)
			}

			function uploadFile(file){
				let reader = new FileReader();

				reader.onload = function(event){

					let img = document.createElement('img');
					img.src = event.target.result;
					document.getElementById('imagePreview').innerHTML = ''
					document.getElementById('imagePreview').appendChild(img);

				}
				reader.readAsDataURL(file);
			}