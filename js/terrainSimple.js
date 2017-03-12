//random, global variables
var worldWidth = 32, worldDepth = 32, worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clickcnt = 0;
//var viewType = 'surface';

//scene basics
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x3a4246 );
setLights(scene);

//camera basics
var camera = setCameraOver();

//renderer basics
var renderer = new THREE.WebGLRenderer();
renderer.setSize( 900, 600); //alt innerWindow etc.

//set in dom or div of choice
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );

//create or get geometry on various events
container.addEventListener( 'click', ()=>{
	geometry = createGeometry();
	render();
});

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

render();


//-----------------GENERIC SETTINGS----------------------------

//----------Ambient and Directional Lights - stable----------

function setLights(scene){ // decent white light settings

	var ambientLight = new THREE.AmbientLight(  0x404040, 1 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight(0xffffff );
		directionalLight.position.x = -0.263;
		directionalLight.position.y = 0.251;
		directionalLight.position.z = 0.932;
		directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight(0xffffff );
		directionalLight.position.x = -0.828;
		directionalLight.position.y = -0.028;
		directionalLight.position.z = -0.558;
		directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.x = 0.812;
		directionalLight.position.y = 0.116;
		directionalLight.position.z = 0.572;
		directionalLight.position.normalize();
	scene.add( directionalLight );

};

function setCameraOver(){
	var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

	camera.position.z = 33;
	camera.position.x = -0;
	camera.rotation.x = -Math.PI/3;
	camera.position.y = 45;

	return camera;
}

function createGeometry(){ //this should be the area of concentration for edits/updates and analysis
	//randomized tile from greyscales;

	//BUFFER STYLE PLANES
	// var geometry = new THREE.PlaneBufferGeometry( 50, 50, worldWidth - 1, worldDepth - 1 );
	// 	geometry.rotateX( - Math.PI / 2 );

	// var vertices = geometry.attributes.position.array;
	// 	console.dir(vertices);
	// 	for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) { //every third is height
	// 		vertices[ j + 1 ] = Math.random()*3;
	// 	}

	// geometry.computeFaceNormals();
	// geometry.computeVertexNormals();

	//DIRECT PLANE GEOMETRY
	var geometry = new THREE.PlaneGeometry( 50, 50, worldWidth - 1, worldDepth - 1 );
		geometry.rotateX( - Math.PI / 2 );

		for (var i = 0, l = geometry.vertices.length; i < l; i++) {
		  geometry.vertices[i].y = Math.random()*3; //remember y is height here!
		}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	clickcnt ++;

	if (clickcnt%2===0){
		var edges = new THREE.EdgesGeometry( geometry );
		var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({
			color: 0xffffff,
			linewidth: 1,
			}) );
		//scene.remove( line );
		scene.add( line );
	} else {
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xe5fcff, shininess: 10, shading: THREE.FlatShading, opacity: 0.5 } );
		var terrain = new THREE.Mesh( geometry, material );
		scene.add( terrain );

	var edges = new THREE.EdgesGeometry( geometry );
		var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({
			color: 0xe4e4e4,
			linewidth: 1,
			}) );
		//scene.remove( line );
		scene.add( line );
	}

	return geometry;
}


