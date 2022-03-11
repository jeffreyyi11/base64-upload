//function to convert to base64
	const toBase64 = async (file, cb) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function() {
			cb(null, reader.result);
		}
		reader.onerror = function(error) {
			cb(error, null);
		}
	}

	//function to upload post object after converting attached files to base64
	const submitNews = async (data) => {
		//convert attachments to base64
		console.log(data.images[0]);
		let image = data.images[0];
		let imageData;
		if (image) {
			await toBase64(image, (err, result) => {
				if(result) {
					imageData = result;
				};
				if(err) console.log(err);
			});
		}
		//create data objects for each api call
		let blogName = data.title;
		let dataBody = {
			title: data.title,
			date: data.date,
			content: content
		};

		//stringify data then submit to api calls to upload blog event and attachments
		let response = await fetch('/api/communitynews/uploadpost', {
			method: 'POST',
			body: JSON.stringify(dataBody),
		}).then((res) => {
			// if image exists, upload to image attachment folders
			if (imageData) {
				console.log('image attached');
				let imageAttachmentBody = {
					title: blogName,
					imageAttachment: imageData
				};
				fetch('/api/communitynews/uploadimage', {
					method: 'POST',
					body: JSON.stringify(imageAttachmentBody)
				})
					.then((res) => {
						res = res.json();
						console.log(res);
						return res;
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				res = res.json();
				return res;
			}
		}).catch((err) => {
            console.log("🚀 ~ file: NewsUpload.js ~ line 114 ~ submitNews ~ err", err)
		});
		console.log(response);
		if (response.message === 'upload success' || response.message === 'image success') {
			console.log('submitted')
			setPostSubmitted(true);
			setUploadMessage('News Post Uploaded');
			reset();
			refresh();
			console.log('success')
		}
	};
