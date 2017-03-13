//room to get color rgb organized

// these functions are always called interactive context with 'plane' and 'intersect' active/inherited
var plane, cube, edges;
var colorCache=[];
var isShiftDown = false, isTabDown = false, isForestDown = false,  isTownDown = false, isCityDown = false, isRoadDown = false, isBridgeDown = false, isBoatDown = false;

var slopeConv = ['peak', 'mnt', 'forest', 'field', 'shore', 'submerged'];
var slopeConvAdd = ['woods', 'urban', 'road'];  //double check --- past builds color (urban, road, bridge, port, 'woods') leave alone, all others annotate slope
var slopeUrbC= { //great then [X]... then grab rgb color for face (with some string/number & Obj.keys)
	woods: 0xa8bb29,
	urban: 0xa0b4b4,
	road: 0x696969,
}

var slopeC = { //great then [X]... then grab rgb color for face (with some string/number & Obj.keys)
	peaks: 0xebf1fc,
	mtn: 0xbec4d1,
	forest: 0x91bd00,
	field: 0xdfe374,
	shore: 0xfeffc5,
	submerged: 0xd4a153,
}

//utility: slope conversion from normals
function slope(face){ //intersect.face or plane.geometry.faces.map...
	var degSlope=face.normal.angleTo(vertical)*57.2958;
	return degSlope;
}
//utility: y elevation (for spread height test)
function vertY(face){ //intersect.face or plane.geometry.faces.map...
	var vertYs = [plane.geometry.vertices[face.a].y, plane.geometry.vertices[face.b].y, plane.geometry.vertices[face.c].y];
	return vertYs;
}

//-------------------- build or not to build? ------------------------------

// CITIES BOOLEAN
// height (min at 3' above 0, ie water level)
// highest vert.y must touch 8 faces with slope < 6 degrees
function allowCity(face){ // true or false based on height (min as 3' above 0)

}

// TOWNS BOOLEAN
// height (min at 3' above 0, ie water level)
// highest vert.y must touch 4 faces with slope < 9 degrees
function allowTown(face){ // true or false based on height (min as 3' above 0)
	var slopeM = slope(face);
	var vertM = vertY(face);
	var allow = false;

	var slopeCut = 20;

	if (slopeM < slopeCut && Math.min(...vertM)>3){
		var clusterV = [face.a, face.b, face.c];

		var adjFaceSlopes = clusterV.map(vertex=>{
			var faces = plane.geometry.faces.filter(face1 => {
				return face1.a === vertex || face1.b === vertex || face1.c === vertex ;
			});
			var adjSlopes = faces.map(face2=>{
				return slope(face2);
			});

			return (Math.max(...adjSlopes) < slopeCut); // the less than
		})

		if (adjFaceSlopes[0] || adjFaceSlopes[1] || adjFaceSlopes[2]){
			allow=true;
		}
	}

	return allow;
}

// ROAD BOOLEAN
// height (min at 3' above 0, ie water level)
// slope < 12 degrees... IGNORE CROSS-SLOPE
function allowRoad(face){ // true or false based on height (min as 3' above 0)

	var allow = false;
	var slopeM = slope(face);
	var vertM = vertY(face);

	if (Math.min(...vertM) >= 0 && slopeM < 20) {
		allow = true;
	}
	return allow;
}

// PORT/BOAT BOOLEAN
// height (max at 12' below 0, ie shallow tug channel)
// no slope specified
function allowBoat(face){ // true or false based on height (min as 3' above 0)

	var allow = false;
	var vertM = vertY(face);

	if (Math.max(...vertM) <= -5) {
		allow = true;
	}
	return allow;

}

// FOREST BOOLEAN
// height (min at 0, ie water level)
// face slope < 60 degrees
function allowForest(face){ // true or false based on height (min as 3' above 0)

	var allow = false;
	var slopeM = slope(face);
	var vertM = vertY(face);

	if (Math.min(...vertM) >= 0 && slopeM < 60) {
		allow = true;
	}
	return allow;

}

//-------------------- color or recolor? ( only when colorS===true)------------------------------
//do generic color types and on-build clicks recolor individual faces
//always update/clone the colorCacheFull=[] when coloring, one color per face
//use colorCacheWhite=[] with doing on-build additions when colorS=== false

//write a function to compare them during the on-click update and transfer the 'urban/on build swatches'... editing/swapping only the background colors

//var slopeConv = ['peak', 'mnt', 'forest', 'field', 'woods', 'urban', 'road', 'bridge', 'shore', 'submerged'];

function slopeClassing(face){ //return choosen color to fit .map structure, only run when face.color is white

	var slopeM = slope(face);
	var vertM = vertY(face);
	var type = '';

	if (slopeM > 70 && Math.min(...vertM) >= 5){
		type = slopeConv[0];
	} else if (slopeM > 50 && Math.min(...vertM) >= 5){
		type = slopeConv[1];
	} else if (slopeM > 15 && Math.min(...vertM) >= 20){
		type = slopeConv[2];
	} else if (slopeM > 0 && Math.min(...vertM) >= 5){
		type = slopeConv[3];
	} else if (Math.max(...vertM) <= 5 && Math.min(...vertM) >= 0){
		type = slopeConv[4];
	} else if (Math.min(...vertM) <= 0){
		type = slopeConv[5];
	} else {
		type = slopeConv[4];
	}//type set for automated color generation
	//console.log(slopeC[type], slopeUrbC.road);
	return slopeC[type];

}

function colorTerrain(plane){ // full color change

	plane.geometry.faces.forEach(face=>{
		var cols = slopeClassing(face);
		if (cols!== undefined){
			face.color.set(cols);
		}
	});

	plane.geometry.faces.colorsNeedUpdate = true;
}

function uncolorTerrain(plane){ // full color change remmoval

	plane.geometry.faces.forEach(face=>{
			face.color.set(0xffffff);
			//push to cacheAlso...
	});

	plane.geometry.faces.colorsNeedUpdate = true;
}
