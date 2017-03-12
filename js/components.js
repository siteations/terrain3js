//REMINDER OF INITIALIZE VARIABLES

var rollOverMesh, rollOverGeo, rollOverMaterial, forest;
var forestO, forestP, settlement, settlementP, road;


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
