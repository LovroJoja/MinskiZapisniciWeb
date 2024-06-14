const currentURL = window.location.href;
const urlObject = new URL(currentURL);
const pathComponents = urlObject.pathname.split("/");
const id = pathComponents[pathComponents.length - 1];

const imageDiv = document.getElementById('image');
const img = document.createElement('img');
img.src = `../Skice/${id}.png`;
img.alt = `Skica nedostupna`;
imageDiv.appendChild(img);

		document.getElementById('exportButton').addEventListener('click', function(){

			
			const detailsDiv = document.getElementById('details');
			const detailsJSON = {
				"@context": "http://schema.org/",
				"@type": "DeminingDocument"
			};
			detailsDiv.querySelectorAll('p').forEach(p => {
				const key = p.querySelector('strong').textContent.replace(':', '').trim();
				const value = p.textContent.replace(key + ':', '').trim();
				detailsJSON[key] = value;
			});
			const jsonData = JSON.stringify(detailsJSON, null, 2);
			const blob = new Blob([jsonData], {type:'application/ld+json'});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${id}.json`;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);
		});
document.getElementById('mapDButton').addEventListener('click', function() {
    window.location.href = `../field/${id}`;
});
	