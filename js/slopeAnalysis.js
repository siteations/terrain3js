//room to get color rgb organized

// these functions are always called interactive context with 'plane' and 'intersect' active/inherited
var plane, cube, edges;
var isShiftDown = false, isForestDown = false,  isTownDown = false, isCityDown = false, isRoadDown = false, isBridgeDown = false;

var slopeConv = ['peak', 'mnt', 'forest', 'field', 'woods', 'urban', 'road', 'bridge', 'shore', 'submerged']; //double check --- past builds color (urban, road, bridge, port, 'woods') leave alone, all others annotate slope
var slopeUrbC= { //great then [X]... then grab rgb color for face (with some string/number & Obj.keys)
	woods: {
		r:168,
		g:187,
		b:41,
	},
	urban: {
		r:160,
		g:180,
		b:180,
	},
	road: {
		r:105,
		g:105,
		b:105,
	},
}

var slopeC = { //great then [X]... then grab rgb color for face (with some string/number & Obj.keys)
	peaks: {
		r:168,
		g:187,
		b:41,
	},
	mtn: {
		r:160,
		g:180,
		b:180,
	},
	forest: {
		r:105,
		g:105,
		b:105,
	},
	field: {
		r:105,
		g:105,
		b:105,
	},
	shore: {
		r:105,
		g:105,
		b:105,
	},
	submerged: {
		r:105,
		g:105,
		b:105,
	},
}

//utility slope conversion from normals
function slope(face){ //intersect.face or plane.geometry.faces.map...
	var degSlope=face.normal.angleTo(vertical)*57.2958;
	return degSlope;
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

}

// ROAD BOOLEAN
// height (min at 1' above 0, ie water level)
// slope < 12 degrees... IGNORE CROSS-SLOPE
function allowRoad(face){ // true or false based on height (min as 3' above 0)

}

// PORT/BOAT BOOLEAN
// height (max at 12' below 0, ie shallow tug channel)
// no slope specified
function allowBoat(face){ // true or false based on height (min as 3' above 0)

}

// FOREST BOOLEAN
// height (min at 0, ie water level)
// face slope < 60 degrees
function allowForest(face){ // true or false based on height (min as 3' above 0)

}
