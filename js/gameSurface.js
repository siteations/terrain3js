//REMINDER OF INITIALIZE VARIABLES

// var rollOverMesh, rollOverGeo, rollOverMaterial, forest;
// var forestO, forestP, settlement, settlementP, road;

// var swatch1, swatch2, swatch3, swatch4, swatch5;
// var sH1, sH2, sH3, sH4, sH5;

var container;
var camera, scene, renderer;
var mouse, raycaster;
var cubeGeo, cubeMaterial;
var objects = [];
var vertical = new THREE.Vector3( 0, 1, 0 );

var cameraP= [{x:600,y:1400,z:2200}, {x:-2200,y:1400,z:600} ,{x:-600,y:1400,z:-2200},{x:2200,y:1400,z:-600}];

var colorS = false; //boolean for slope driven coloring

// var slopeConv = ['peak', 'mnt', 'forest', 'field', 'woods', 'urban', 'road', 'bridge', 'shore', 'submerged']; //double check --- past builds color (urban, road, bridge, port, 'woods') leave alone, all others annotate slope
// var slopeUrbC= { //great then [X]... then grab rgb color for face (with some string/number & Obj.keys)
// 	woods: {
// 		r:168,
// 		g:187,
// 		b:41,
// 	},
// 	urban: {
// 		r:160,
// 		g:180,
// 		b:180,
// 	},
// 	road: {
// 		r:105,
// 		g:105,
// 		b:105,
// 	},
// }

// var slopeC = { //great then [X]... then grab rgb color for face (with some string/number & Obj.keys)
// 	peaks: {
// 		r:168,
// 		g:187,
// 		b:41,
// 	},
// 	mtn: {
// 		r:160,
// 		g:180,
// 		b:180,
// 	},
// 	forest: {
// 		r:105,
// 		g:105,
// 		b:105,
// 	},
// 	field: {
// 		r:105,
// 		g:105,
// 		b:105,
// 	},
// 	shore: {
// 		r:105,
// 		g:105,
// 		b:105,
// 	},
// 	submerged: {
// 		r:105,
// 		g:105,
// 		b:105,
// 	},
// }


init();
render();

function init() {

	container = document.getElementById( 'terrain' );



	//perspective camera looking at scene
	camera = new THREE.PerspectiveCamera( 35, 1000 / 600, 1, 10000 );
	camera.position.set( cameraP[0].x, cameraP[0].y, cameraP[0].z  ); //position A
	camera.lookAt( new THREE.Vector3() ); //just looks toward origin (0,0,0);

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xf8efdf, 0.00035 );

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

	//setting up the interactions for finding 'space' intersects
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();


	//SURFACE TO MANIPULATE
	var geometry = new THREE.PlaneGeometry( 1600, 1600, 40, 40 );
		geometry.rotateX( - Math.PI / 2 );
			for (var i = 0, l = geometry.vertices.length; i < l; i++) {
			  //geometry.vertices[i].y = (Math.random()*5)+ 5; //remember y is height here!
			  geometry.vertices[i].y = (Math.random()*2) + 20; //remember y is height here!
			}
		console.log(geometry.vertices.length);
		geometry.computeFaceNormals();

		geometry.faces.forEach( face =>{

			//console.log('slope in degrees:', face.normal.angleTo(vertical)*57.2958);
			//create a unified face-normal analysis function. . . which takes face and sets color based on slope
			//broad categories. . . easy start to settlers of caton style civilization building. . .
			face.color.setRGB(1,1,1);
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
		renderer.setSize( 1000, 600 );
	container.appendChild( renderer.domElement );

	// listening for interactions
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

// ---------------- CORE FUNCTIONS AND INTERACTIONS ------------------------------------

function onWindowResize() {
	camera.aspect = 1000 / 600;
	camera.updateProjectionMatrix();
	renderer.setSize( 1000 , 600 );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	//screen positon of intersection
	mouse.set( ( (event.clientX+10) / 1000 ) * 2 - 1, - ( (event.clientY+10) / 600 ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObject(plane);

	if (intersects.length > 0) {
		var intersect = intersects[ 0 ];
		event.target.style.cursor = 'crosshair';

			//intersect.object.geometry.faces[intersect.faceIndex].color
			intersect.object.geometry.faces.forEach(face => {
				face.color.setRGB(1,1,1);
			})
			intersect.face.color.setRGB(1,0.65,0);
			intersect.object.geometry.colorsNeedUpdate = true;

			forest.position.copy( intersect.point ).add( intersect.face.normal );
			forest.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			forest.position.y +=100;

			settlement.position.copy( intersect.point ).add( intersect.face.normal );
			settlement.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			settlement.position.y +=200;

			road.position.copy( intersect.point ).add( intersect.face.normal );
			road.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			road.position.y +=300;

	render();
	} else {
		event.target.style.cursor = '';
	}

}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	//screen positon of intersection
	//mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	mouse.set( ( (event.clientX+10) / 1000 ) * 2 - 1, - ( (event.clientY+10) / 600 ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {
		var intersect = intersects[ 0 ];
		event.target.style.cursor = 'crosshair';

			//readout.innertext = intersect.face.normal.angleTo(vertical)*57.2958;
		// delete cube
		if ( isShiftDown ) {

			//lower vertices;
			intersect.object.geometry.vertices[intersect.face.a].y -= 5;
			intersect.object.geometry.vertices[intersect.face.b].y -= 5;
			intersect.object.geometry.vertices[intersect.face.c].y -= 5;
			intersect.object.geometry.verticesNeedUpdate = true;
			intersect.object.geometry.computeFaceNormals();

			console.log('slope in degrees:', intersect.face.normal.angleTo(vertical)*57.2958);


		} else if ( isForestDown ) {

			var forestA = addForest();
			//unpack this math for placing new object - vector3 Math!!!!!
			forestA.position.copy( intersect.point ).add( intersect.face.normal );
			forestA.position.y +=20;
			scene.add( forestA );
			objects.push( forestA );

		} else if ( isTownDown ) {

			var townA = addSettlement();
			//unpack this math for placing new object - vector3 Math!!!!!
			townA.position.copy( intersect.point ).add( intersect.face.normal );
			townA.position.y +=20;
			scene.add( townA );
			objects.push( townA );

		} else 	{

			//raise vertices;
			intersect.object.geometry.vertices[intersect.face.a].y += 5;
			intersect.object.geometry.vertices[intersect.face.b].y += 5;
			intersect.object.geometry.vertices[intersect.face.c].y += 5;
			intersect.object.geometry.verticesNeedUpdate = true;
			intersect.object.geometry.computeFaceNormals();

			//console.log('slope in degrees:', intersect.face.normal.angleTo(vertical)*57.2958);
			//colorBySlope(intersect.face);
			//create a unified face-normal analysis function. . . which takes face and sets color based on slope
			//broad categories. . . easy start to settlers of caton style civilization building. . .

		}
		render();
		//console.log('objects: ', objects);
	}
	event.target.style.cursor = '';
}

function onDocumentKeyDown( event ) {
	switch( event.keyCode ) {
		case 16: isShiftDown = true; break;
		case 17: isCityDown = true; break;
		case 82: isRoadDown = true; break;
		case 84: isTownDown = true; break;
		case 70: isForestDown = true; break;

		//tie to objects/buttons later
		// case 65: plane.rotation.y += Math.PI/2; console.log(event); break;
		// case 83: plane.rotation.y -= Math.PI/2;  console.log(event); break;
		// case 87: plane.rotation.y -= Math.PI;  console.log(event); break;
		case 49: rotateCamera(0); break;
		case 50: rotateCamera(1); break;
		case 51: rotateCamera(2); break;
		case 52: rotateCamera(3); break;
	}
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {
		case 16: isShiftDown = false; break;
		case 67: isCityDown = false; break;
		case 82: isRoadDown = false; break;
		case 84: isTownDown = false; break;
		case 70: isForestDown = false; break;
	}
}

function render() {
	renderer.render( scene, camera );
}

function showSlope(event){
	event.preventDefault();

	if (event.target.value === 'show'){
		colorS = true;
	} else {
		colorS = false;
	};

}

function rotateCamera(num){

	camera.position.set( cameraP[num].x, cameraP[num].y, cameraP[num].z  ); //0-4 are the 4 spots
	camera.lookAt( new THREE.Vector3() );

	render();

}

