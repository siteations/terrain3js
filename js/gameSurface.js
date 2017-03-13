//REMINDER OF INITIALIZE VARIABLES


var container;
var camera, scene, renderer;
var mouse, raycaster;
var cubeGeo, cubeMaterial;
var objects = [];
var vertical = new THREE.Vector3( 0, 1, 0 );

var cameraP= [{x:300,y:1400,z:2200}, {x:-2200,y:1400,z:300} ,{x:-300,y:1400,z:-2200},{x:2200,y:1400,z:-300},{x:0,y:3000,z:0},{x:0,y:0,z:3000}];

var colorS = false; //boolean for slope driven coloring


init();
render();

function init() {

	container = document.getElementById( 'terrain' );



	//perspective camera looking at scene
	camera = new THREE.PerspectiveCamera( 35, 900 / 600, 1, 10000 );
	camera.position.set( cameraP[0].x, cameraP[0].y, cameraP[0].z  ); //position A
	camera.lookAt( new THREE.Vector3() ); //just looks toward origin (0,0,0);

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xf8efdf, 0.00030 );

//-----------------------------CREATE OBJECT AND EVOKE/RENDER IN EVENTS-------------------------------------

	//GROUND WATER FOR FLOODS, ETC.
	var geometry = new THREE.PlaneGeometry( 1600, 1600);
		geometry.rotateX( - Math.PI / 2 );
	var gwMaterial = new THREE.MeshPhongMaterial({ shading: THREE.FlatShading, color: 0x00c6d8, specular: 0x111111, shininess: 10, opacity: 0.5, transparent: true
	 });
	var waterplane = new THREE.Mesh( geometry, gwMaterial );
	scene.add( waterplane );
	console.log(waterplane);

	//COMPONENT OBJECTS CREATION
	forestO = createForest();
	scene.add(forestO);

	settlement = createSettlement();
	scene.add(settlement);

	road = createRoad();
	scene.add(road);

	boat = createBoat();
	scene.add(boat);

	//setting up the interactions for finding 'space' intersects
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();


	//SURFACE TO MANIPULATE
	var geometry = new THREE.PlaneGeometry( 1600, 1600, 40, 40 );
		geometry.rotateX( - Math.PI / 2 );
			for (var i = 0, l = geometry.vertices.length; i < l; i++) {
			  geometry.vertices[i].y = (Math.random()*2) + 20; //remember y is height here!
			}
		console.log(geometry.vertices.length);
		geometry.computeFaceNormals();

		geometry.faces.forEach( face =>{

			if (colorS){ // won't actually run at start, but this should be the pattern

			} else {
				face.color.setRGB(1,1,1);
			}
		});

	var planeMaterial = new THREE.MeshPhongMaterial({ shading: THREE.FlatShading, vertexColors: THREE.FaceColors, specular: 0x111111, shininess: 10, opacity: 0.75, side: THREE.DoubleSide,
	 });

	plane = new THREE.Mesh( geometry, planeMaterial );
	scene.add( plane );
	objects.push( plane );


	// Lights
	var ambientLight = new THREE.AmbientLight( 0x606060 );
		scene.add( ambientLight );
	var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
		scene.add( directionalLight );

	// Renderers
	renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor( 0x333333);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( 900, 600 );
	container.appendChild( renderer.domElement );

	// listening for interactions
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

// ---------------- CORE FUNCTIONS AND MOUSEOVER INTERACTIONS ------------------------------------

function onWindowResize() {
	camera.aspect = 900 / 600;
	camera.updateProjectionMatrix();
	renderer.setSize( 900 , 600 );
}

// ---------------------------- ON CODED MOUSE CLICKS ------------------------------------

function onDocumentMouseDown( event ) {
	event.preventDefault();
	//screen positon of intersection
	mouse.set( ( (event.clientX+10) / 900 ) * 2 - 1, - ( (event.clientY+10) / 600 ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObject(plane);

	if (intersects.length > 0) {
		var intersect = intersects[ 0 ];
		event.target.style.cursor = 'crosshair';

		var roadBuild = allowRoad(intersect.face);
		var forestBuild = allowForest(intersect.face);
		var townBuild = allowTown(intersect.face);
		// var cityBuild = allowCity(intersect.face);
		var boatBuild = allowBoat(intersect.face);

		if (isForestDown && forestBuild) {
			//console.log(slope(intersect.face));

			var forestA = addForest();
			//unpack this math for placing new object - vector3 Math!!!!!
			forestA.position.copy( intersect.point ).add( intersect.face.normal );
			forestA.position.y +=10;
			scene.add( forestA );
			objects.push( forestA );

			//also update color beneath object...

		} else if (isTownDown && townBuild) {

			var townA = addSettlement();
			//unpack this math for placing new object - vector3 Math!!!!!
			townA.position.copy( intersect.point ).add( intersect.face.normal );
			townA.position.y +=10;
			scene.add( townA );
			objects.push( townA );

		} else if (isRoadDown && roadBuild) {

			var roadA = addRoad(intersect.face); //face object instead of mesh continuous
			scene.add( roadA );
			objects.push( roadA );

		} //else if (isCityDown && cityBuild) {

		// 	var townA = addSettlement();
		// 	//unpack this math for placing new object - vector3 Math!!!!!
		// 	townA.position.copy( intersect.point ).add( intersect.face.normal );
		// 	townA.position.y +=20;
		// 	scene.add( townA );
		// 	objects.push( townA );

		// }
		else if (isBoatDown && boatBuild) {

			var boatA = addBoat();
			//unpack this math for placing new object - vector3 Math!!!!!
			boatA.position.copy( intersect.point ).add( intersect.face.normal );
			boatA.position.y = 0;
			scene.add( boatA );
			objects.push( boatA );

		}

	render();

	} else {

		event.target.style.cursor = '';
	}

}

// ------------------------------- MOUSEOVER INTERACTIONS ------------------------------------

function onDocumentMouseMove( event ) { //heavy terrain edits and boolean: what can be built
	event.preventDefault();
	//screen positon of intersection
	//mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	mouse.set( ( (event.clientX+10) / 900 ) * 2 - 1, - ( (event.clientY+10) / 600 ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {
		var intersect = intersects[ 0 ];
		event.target.style.cursor = 'crosshair';


//--------------------- major additions and subtractions first ----------------------

		if ( isShiftDown ) {

			//lower vertices;
			intersect.object.geometry.vertices[intersect.face.a].y -= 5;
			intersect.object.geometry.vertices[intersect.face.b].y -= 5;
			intersect.object.geometry.vertices[intersect.face.c].y -= 5;
			intersect.object.geometry.verticesNeedUpdate = true;
			intersect.object.geometry.computeFaceNormals();

		} else if ( isTabDown ) {

			//raise vertices;
			intersect.object.geometry.vertices[intersect.face.a].y += 5;
			intersect.object.geometry.vertices[intersect.face.b].y += 5;
			intersect.object.geometry.vertices[intersect.face.c].y += 5;
			intersect.object.geometry.verticesNeedUpdate = true;
			intersect.object.geometry.computeFaceNormals();


		} else { // this is then all the hover conditions

			var roadBuild = allowRoad(intersect.face);
			var forestBuild = allowForest(intersect.face);
			var townBuild = allowTown(intersect.face);
			var cityBuild = allowCity(intersect.face);
			var boatBuild = allowBoat(intersect.face);

			//console.log('road? :', roadBuild);

			intersect.object.geometry.faces.forEach((face, i) => {

					if (colorS){
						var cols = slopeClassing(face);
						if (cols!== undefined){
							face.color.set(cols);
						} // retains road color
					} else {
							face.color.set(0xffffff);
					}
			});

			intersect.face.color.setRGB(1,0.65,0);
			intersect.object.geometry.colorsNeedUpdate = true;
			//no cache on hoover if colorS off... otherwise add updates to terrain,
			//but ignore insersect.face.color

			if (forestBuild){
				forest.position.copy( intersect.point ).add( intersect.face.normal );
				forest.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
				forest.position.y = 10;
				forest.position.x = 850;
			}

			if (townBuild){
				settlement.position.copy( intersect.point ).add( intersect.face.normal );
				settlement.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
				// settlement.position.y +=100;
				// settlement.position.y +=50;
				settlement.position.y = 10;
				settlement.position.x = 950;
			}

			if (roadBuild){
				road.position.copy( intersect.point ).add( intersect.face.normal );
				road.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
				road.position.y =10;
				road.position.x =900;
			}

			// if (cityBuild){
			// 	road.position.copy( intersect.point ).add( intersect.face.normal );
			// 	road.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			// 	road.position.y +=340;
			// }

			if (boatBuild){
				//console.log('boat build');
				boat.position.copy( intersect.point ).add( intersect.face.normal );
				boat.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
				boat.position.y = 10;
				boat.position.x = 875;
				boat.position.z -= -100;
			}

			//console.log(slopeClassing(intersect.face));

		}

		render();
		//console.log('objects: ', objects);
	}
	event.target.style.cursor = '';
}

function onDocumentKeyDown( event ) {
	switch( event.keyCode ) {
		case 16: isShiftDown = true; break;
		case 9: isTabDown = true; break;
		case 17: isCityDown = true; break;
		case 82: isRoadDown = true; break;
		case 84: isTownDown = true; break;
		case 70: isForestDown = true; break;
		case 66: isBoatDown = true; break;

		//tie to objects/buttons later
		// case 65: plane.rotation.y += Math.PI/2; console.log(event); break;
		// case 83: plane.rotation.y -= Math.PI/2;  console.log(event); break;
		// case 87: plane.rotation.y -= Math.PI;  console.log(event); break;
		case 49: rotateCamera(0); break;
		case 50: rotateCamera(1); break;
		case 51: rotateCamera(2); break;
		case 52: rotateCamera(3); break;
		case 53: rotateCamera(4); break;
		case 54: rotateCamera(5); break;
	}
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {
		case 16: isShiftDown = false; break;
		case 9: isTabDown = false; break;
		case 67: isCityDown = false; break;
		case 82: isRoadDown = false; break;
		case 84: isTownDown = false; break;
		case 70: isForestDown = false; break;
		case 66: isBoatDown = false; break;
	}
}

function render() {
	renderer.render( scene, camera );
}

function showSlope(event){
	event.preventDefault();

	if (event.target.value === 'show'){
		colorS = true;
		colorTerrain(plane);
		plane.geometry.faces.colorsNeedUpdate = true;

		render();

	} else {
		colorS = false;
		uncolorTerrain(plane);
		plane.geometry.faces.colorsNeedUpdate = true;

		render();
	};

}

function rotateCamera(num){

	camera.position.set( cameraP[num].x, cameraP[num].y, cameraP[num].z  ); //0-4 are the 4 spots
	camera.lookAt( new THREE.Vector3() );

	render();

}

