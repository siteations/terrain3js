var container;
var camera, scene, renderer;
var plane, cube, edges;
var mouse, raycaster, isShiftDown = false, isForestDown = false,  isTownDown = false, isCityDown = false;
var rollOverMesh, rollOverGeo, rollOverMaterial, forest;
var forestO, forestP, settlement, settlementP, road;
var cubeGeo, cubeMaterial;
var objects = [];
var vertical = new THREE.Vector3( 0, 1, 0 );

init();
render();

function init() {

	container = document.getElementById( 'container' );
	var info = document.createElement( 'div' );
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a><br><strong>click</strong>: add elevation, <strong>shift + click</strong>: remove elevation<br><strong>A</strong>: rotate left, <strong>S</strong>: rotate left, <strong>W</strong>: rotate 180';
	container.appendChild( info );


	//perspective camera looking at scene
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 600, 1400, 2000 ); //position A
	//camera.position.set( 2200 ,1800, 600 ); //position B
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

	//SIMPLE FRONT PLANE
	var geometryE = new THREE.PlaneGeometry( 1600, 40);
		geometryE.translate( 0, 0, 800 );
	var eMaterial = new THREE.MeshPhongMaterial({ shading: THREE.FlatShading, color: 0x000000, specular: 0x111111, shininess: 10, opacity: 0.5, transparent: true
	 });
	var edgeplane = new THREE.Mesh( geometryE, eMaterial );
	scene.add( edgeplane );

	//OTHER OBJECT CREATION
	forestO = createForest();
	scene.add(forestO);

	settlement = createSettlement();
	scene.add(settlement);

	road = createRoad();
	scene.add(road);


	territory = new THREE.Group();
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

		geometry.computeFaceNormals();

		geometry.faces.forEach( face =>{

			//console.log('slope in degrees:', face.normal.angleTo(vertical)*57.2958);
			//create a unified face-normal analysis function. . . which takes face and sets color based on slope
			//broad categories. . . easy start to settlers of caton style civilization building. . .
			face.color.setRGB(1,1,1);
		});

	var planeMaterial = new THREE.MeshPhongMaterial({ shading: THREE.FlatShading, vertexColors: THREE.FaceColors, specular: 0x111111, shininess: 10, opacity: 0.75, side: THREE.DoubleSide,
	 });

		console.log(planeMaterial);
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
		renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// listening for interactions
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, false );
	document.addEventListener( 'keyup', onDocumentKeyUp, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	//screen positon of intersection
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObject(plane);

	if (intersects.length > 0) {
		var intersect = intersects[ 0 ];
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

	}
	render();
}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	//screen positon of intersection
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {
		var intersect = intersects[ 0 ];
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
			colorBySlope(intersect.face);
			//create a unified face-normal analysis function. . . which takes face and sets color based on slope
			//broad categories. . . easy start to settlers of caton style civilization building. . .

		}
		render();
		//console.log('objects: ', objects);
	}
}

function onDocumentKeyDown( event ) {
	switch( event.keyCode ) {
		case 16: isShiftDown = true; break;
		case 17: isCityDown = true; break;
		case 84: isTownDown = true; break;
		case 70: isForestDown = true; break;

		//tie to objects/buttons later
		case 65: plane.rotation.y += Math.PI/2; console.log(event); break;
		case 83: plane.rotation.y -= Math.PI/2;  console.log(event); break;
		case 87: plane.rotation.y -= Math.PI;  console.log(event); break;
	}
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {
		case 16: isShiftDown = false; break;
		case 67: isCityDown = false; break;
		case 84: isTownDown = false; break;
		case 70: isForestDown = false; break;
	}
}

function render() {
	renderer.render( scene, camera );
}


function colorBySlope(face){
	let degSlope=face.normal.angleTo(vertical)*57.2958;



}


// MISC OBJECT CREATION
function createForest(){
	forest = new THREE.Group();
		rollOverGeo = new THREE.ConeGeometry( 10, 35);
			rollOverGeo.translate( 0, 0, 10 );
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x209168, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	forest.add( rollOverMesh );
		rollOverGeo = new THREE.ConeGeometry( 12, 40);
			rollOverGeo.translate( -15, 0, 3 );
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x5ebb29, opacity: 0.9, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	forest.add( rollOverMesh );
		rollOverGeo = new THREE.SphereGeometry( 8 );
			rollOverGeo.translate( -12, 10, 25);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xa7bb29, opacity: 1, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	forest.add( rollOverMesh );
	return forest;
}

function addForest(){
	forestP = new THREE.Group();
		rollOverGeo = new THREE.ConeGeometry( 10, 35);
			rollOverGeo.translate( 0, 0, 10 );
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x209168, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	forestP.add( rollOverMesh );
		rollOverGeo = new THREE.ConeGeometry( 12, 40);
			rollOverGeo.translate( -15, 0, 3 );
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x5ebb29, opacity: 0.9, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	forestP.add( rollOverMesh );
		rollOverGeo = new THREE.SphereGeometry( 8 );
			rollOverGeo.translate( -12, 10, 25);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xa7bb29, opacity: 1, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	forestP.add( rollOverMesh );
	return forestP;
}

function createSettlement(){
	settlement = new THREE.Group();
		rollOverGeo = new THREE.BoxGeometry( 15, 20, 15);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xd0442e, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	settlement.add(rollOverMesh);
		rollOverGeo = new THREE.BoxGeometry( 20, 12, 20);
			rollOverGeo.translate( -22, 0, 8);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xbb3d29, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	settlement.add(rollOverMesh);
		rollOverGeo = new THREE.BoxGeometry( 12, 20, 20);
			rollOverGeo.translate( 20, 0, 12);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xa63624, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	settlement.add(rollOverMesh);
		return settlement;
}

function addSettlement(){
	settlementP = new THREE.Group();
		rollOverGeo = new THREE.BoxGeometry( 15, 20, 15);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xd0442e, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	settlementP.add(rollOverMesh);
		rollOverGeo = new THREE.BoxGeometry( 20, 12, 20);
			rollOverGeo.translate( -22, 0, 8);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xbb3d29, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	settlementP.add(rollOverMesh);
		rollOverGeo = new THREE.BoxGeometry( 12, 20, 20);
			rollOverGeo.translate( 20, 0, 12);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xa63624, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	settlementP.add(rollOverMesh);
		return settlementP;
}

function createRoad(){
		rollOverGeo = new THREE.BoxGeometry( 20, 2, 20);
		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0x696969, opacity: 0.95, transparent: true } );
		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
		return rollOverMesh;
}
