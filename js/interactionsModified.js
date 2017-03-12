var container;
var camera, scene, renderer;
var plane, cube, edges;
var mouse, raycaster, isShiftDown = false;
var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;
var objects = [];

init();
render();

function init() {

	container = document.getElementById( 'container' );

	var info = document.createElement( 'div' );
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - voxel painter - webgl<br><strong>click</strong>: add voxel, <strong>shift + click</strong>: remove voxel';
	container.appendChild( info );

	//perspective camera looking at scene
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 500, 800, 1300 );
	camera.lookAt( new THREE.Vector3() );

	scene = new THREE.Scene();

//-----------------------------CREATE OBJECT AND EVOKE/RENDER IN EVENTS-------------------------------------
	// roll-over helpers or highlights
	rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
	rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xffa500, opacity: 0.25, transparent: true } );

	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );

	//scene.add( rollOverMesh ); //HOOVER LOCATION HELPER

	// cubes
	cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
	cubeMaterial = new THREE.MeshPhongMaterial( { color: 0xffa500, specular: 0xe5fcff, shininess: 10, shading: THREE.FlatShading, opacity: 0.80, transparent: true } );

	// grid as lines OLD UNDERLAY
	var size = 500, step = 50;
	var geometry = new THREE.Geometry();
	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
		geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
	}

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );
	var baseline = new THREE.LineSegments( geometry, material );
	scene.add( baseline ); // LINES ON BACKGROUND

	//setting up the interactions for finding 'space' intersects
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	//the plane geometry
	var geometry = new THREE.PlaneGeometry( 1000, 1000, 20, 20 );
		geometry.rotateX( - Math.PI / 2 );
			for (var i = 0, l = geometry.vertices.length; i < l; i++) {
			  geometry.vertices[i].y = (Math.random()*50)+ 5; //remember y is height here!
			}

		var white = new THREE.Color(0xffffff);
		geometry.faces.forEach( face =>{
			face.color = white ;
		});

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		//color: 0x000000

	var planeMaterial = new THREE.MeshPhongMaterial({ shading: THREE.FlatShading, vertexColors: THREE.FaceColors, specular: 0xe5fcff, shininess: 10, opacity: 0.5, side: THREE.DoubleSide
	 });

		console.log(planeMaterial);
	plane = new THREE.Mesh( geometry, planeMaterial );
	scene.add( plane );
	objects.push( plane );

	//edges from plane itself;
	var edges = new THREE.EdgesGeometry( geometry );
	var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({
		color: 0xe4e4e4,
		linewidth: 1,
		}) );
	scene.add( line );
	//objects.push( line );

	// Lights
	var ambientLight = new THREE.AmbientLight( 0x606060 );
		scene.add( ambientLight );
	var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
		scene.add( directionalLight );

	// Renderers
	renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor( 0xf0f0f0 );
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
	//scene.remove( temp );
	//screen positon of intersection
	mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObject(plane);

	if (intersects > 0) {
		var intersect = intersects[0];

		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xffa500, opacity: 0.5, transparent: true } );

		if (plane.geometry.vertices[intersect.face.a] !== undefined && plane.geometry.vertices[intersect.face.b] !== undefined && plane.geometry.vertices[intersect.face.c] !== undefined){

			var highlight = new THREE.PlaneGeometry();
				highlight.vertices = [];
				highlight.vertices[0]= plane.geometry.vertices[intersect.face.a];
				highlight.vertices[1]= plane.geometry.vertices[intersect.face.b];
				highlight.vertices[2]= plane.geometry.vertices[intersect.face.c];
				highlight.vertices.forEach(vertex=>{
					vertex.y += .25;
				});
				highlight.faces.push( new THREE.Face3( 0, 1, 2 ));

			temp = new THREE.Mesh( highlight, rollOverMaterial );
			scene.add( temp );
			console.log(temp);
		};

		//unpack this math for showing active position... setting position of rollover, unpack w/ on-click version
		//INITIAL IMAGES ROUTE
		// rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
		// rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

		// COLOR ROUTE . . .
		// var orange = new THREE.Color(0xffa500);
		// plane.geometry.faces.forEach( (face, i) =>{
		// 	if (face.a === intersect.face.a && face.b === intersect.face.b && face.c === intersect.face.c
		// 	    ){
		// 		face.color = orange ;
		// 		console.log(i);
		// 	}
		// });

	}
	render();
	//console.log(scene.children);

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
			if ( intersect.object != plane ) {
				scene.remove( intersect.object );
				objects.splice( objects.indexOf( intersect.object ), 1 ); //remove that from array
			}
		// create cube
		} else {
			var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
			console.log('voxel positon: ', intersect.point, intersect.face.normal);
			//unpack this math for placing new object - vector3 Math!!!!!
			voxel.position.copy( intersect.point ).add( intersect.face.normal );
			voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
			scene.add( voxel );
			objects.push( voxel ); //add to array with plane
		}
		render();
		console.log('objects: ', objects);
	}
}

function onDocumentKeyDown( event ) {
	switch( event.keyCode ) {
		case 16: isShiftDown = true; break;
	}
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {
		case 16: isShiftDown = false; break;
	}
}

function render() {
	renderer.render( scene, camera );
}
