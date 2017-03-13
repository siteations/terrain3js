//INITIALIZED VARIABLES for topo

// topo height maps (41x41 pixels in greyscale) ---- start game w/ topo
var heightmap; //array of ordered height values 0 - 255, remapped from 0-100? relatively flat terrain.


function addTerrain(file){

	if (file){

	loader = new THREE.ImageLoader();

	// load a image resource
	loader.load(file, ( image ) => { //'../terrain/test.jpg'

		heightmap = extractData(image);


		//incorporate that info...
		plane.geometry.vertices.forEach( (vertex, i) =>{
			vertex.y = heightmap[i] - 15; //near or at water surface w/ minor edits
		})
		plane.geometry.verticesNeedUpdate = true;
		plane.geometry.computeFaceNormals();

		if (colorS){
			colorTerrain(plane);
			plane.geometry.faces.colorsNeedUpdate = true;
		};

		scene.children.forEach((child, i)=>{
			if (i>7 || child.name === 'settlementP' || child.name === 'forestP'  || child.name === 'cityP' || child.name === 'bridgeP'|| child.name === 'boatP'){
				scene.remove(child);
			}
		});

		render();

		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);

	} else { // when random, run initial randomness

		plane.geometry.vertices.forEach( (vertex, i) =>{
			  vertex.y = (Math.random()*2) + 20;
			});

		plane.geometry.verticesNeedUpdate = true;
		plane.geometry.computeFaceNormals();

		if (colorS){
			colorTerrain(plane);
			plane.geometry.faces.colorsNeedUpdate = true;
		};

		for (var i=0; i<scene.children ; i++){

			if (scene.children[i].name ==='settlementP'){
				scene.remove(scene.children[i]);

			}
		};

		render();
	}

}

function extractData(image){

	var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );
		context.drawImage( image, 0, 0 );

		var data = context.getImageData(0, 0, 41, 41).data; //this is R, G, B, A... so lose A and average values.
		var datagray = [];

		for (var i=0; i<data.length; i+=4){
			var avg = (data[i] + data[i+1] + data[i+2])/3;
			datagray.push(avg);
		};

		var lowest = Math.min(...datagray);
		var diff = Math.max(...datagray) - Math.min(...datagray);

		var adjHeight = datagray.map(height=>{
			return height-(lowest + 1);
		});

		//accomodate shorter values
		if (diff<150 && diff>100){
			adjHeight = adjHeight.map(height=>{
				return height*1.25;
			});
		} else if (diff<100){
			adjHeight = adjHeight.map(height=>{
				return height*2.5;
			});
		}

		return adjHeight;

}

function onTerrainThumb(event){
	//event.preventDefault();
	//console.log(event.target.value);
	var file = event.target.value;
	//var file = '../terrain/02.jpg';
	addTerrain(file);

};

function saveTerrain(event){
	//event.preventDefault();
	//console.log(event.target.value);
	alert('this is in the works!');

	let imgPt = plane.geometry.vertices;

};


//onTerrainThumb(); // just to check... convert to selection based event
