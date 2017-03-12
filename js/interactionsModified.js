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


	//perspective camera looking at scene
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 600, 1400, 1300 );
	camera.lookAt( new THREE.Vector3() ); //just looks toward origin (0,0,0);

	scene = new THREE.Scene();

//-----------------------------CREATE OBJECT AND EVOKE/RENDER IN EVENTS-------------------------------------

	// grid as lines OLD UNDERLAY
	var size = 500, step = 25;
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
	var geometry = new THREE.PlaneGeometry( 1000, 1000, 40, 40 );
		geometry.rotateX( - Math.PI / 2 );
			for (var i = 0, l = geometry.vertices.length; i < l; i++) {
			  //geometry.vertices[i].y = (Math.random()*5)+ 5; //remember y is height here!
			  geometry.vertices[i].y = (Math.random()*1) + 5; //remember y is height here!
			}

		var white = new THREE.Color(0xffffff);
		geometry.faces.forEach( face =>{
			face.color = white ;
		});

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		//color: 0x000000

	var planeMaterial = new THREE.MeshPhongMaterial({ shading: THREE.FlatShading, vertexColors: THREE.FaceColors, specular: 0xe5fcff, shininess: 10, opacity: 0.75, side: THREE.DoubleSide,
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
		renderer.setClearColor( 0xe4e4e4 );
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

			intersect.face.color.setRGB(1,0.65,0);
			intersect.object.geometry.colorsNeedUpdate = true;

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

			//lower vertices;
			intersect.object.geometry.vertices[intersect.face.a].y -= 5;
			intersect.object.geometry.vertices[intersect.face.b].y -= 5;
			intersect.object.geometry.vertices[intersect.face.c].y -= 5;
			intersect.object.geometry.verticesNeedUpdate = true;

		} else {

			//raise vertices;
			intersect.object.geometry.vertices[intersect.face.a].y += 5;
			intersect.object.geometry.vertices[intersect.face.b].y += 5;
			intersect.object.geometry.vertices[intersect.face.c].y += 5;
			intersect.object.geometry.verticesNeedUpdate = true;
		}
		render();
		//console.log('objects: ', objects);
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
