var sceneCanvas = document.getElementById('scene');
var width = 240;
var height = 180;
var cameraPointXDefault = -10;
var cameraPointYDefault = 1.8;
var cameraPointZDefault = 10;
var cameraAngleDefault = 60;
var cameraVectorXDefault = -2;
var cameraVectorYDefault = 3;
var cameraVectorZDefault = 0;

var lightsDefault = [{
    x: -30,
    y: 3,
    z: 20
}];

var lightsLocal = [{
    x: parseInt(localStorage['pointLightX']) || lightsDefault[0].x,
    y: parseInt(localStorage['pointLightY']) || lightsDefault[0].y,
    z: parseInt(localStorage['pointLightZ']) || lightsDefault[0].z
}]

sceneCanvas.width = width;
sceneCanvas.height = height;
sceneCanvas.style.cssText = 'width: ' + (width) + 'px; height: ' + (height) + 'px';

var sceneCanvasContext = sceneCanvas.getContext('2d');
var data = sceneCanvasContext.getImageData(0, 0, width, height);
var scene = {};

sceneCanvasContext.mozImageSmoothingEnabled = true;
sceneCanvasContext.imageSmoothingEnabled = true;

scene.camera = { // point where the camera sits
    point: {
        x: parseInt(localStorage['cameraPointX']) || cameraPointXDefault,
        y: parseInt(localStorage['cameraPointY']) || cameraPointYDefault,
        z: parseInt(localStorage['cameraPointZ']) || cameraPointZDefault
    },
    fieldOfView: parseInt(localStorage['cameraAngle']) || cameraAngleDefault, // is the angle from the right to the left side of its frame
    vector: { // determines what angle it points in
        x: parseInt(localStorage['cameraVectorX']) || cameraVectorXDefault,
        y: parseInt(localStorage['cameraVectorY']) || cameraVectorYDefault,
        z: parseInt(localStorage['cameraVectorZ']) || cameraVectorZDefault
    }
};

scene.lights = lightsLocal;

scene.objects = [{
    type: 'sphere',
    point: {
        x: 0,
        y: 3,
        z: -3
    },
    color: {
        x: 255,
        y: 103,
        z: 15
    },
    specular: 0.8,
    lambert: 0.3,
    ambient: 0.3,
    radius: 2.5,
    visible: true
}, {
    type: 'sphere',
    point: {
        x: -5,
        y: 3,
        z: -1
    },
    color: {
        x: 50,
        y: 255,
        z: 50
    },
    specular: 0.1,
    lambert: 1,
    ambient: 0.1,
    radius: 0.2,
    visible: true
}, {
    type: 'sphere',
    point: {
        x: -4,
        y: 1,
        z: -1
    },
    color: {
        x: 255,
        y: 0,
        z: 0
    },
    specular: 0.1,
    lambert: 1,
    ambient: 0.1,
    radius: 0.2,
    visible: true
}, {
    type: 'sphere',
    point: {
        x: -5,
        y: 5,
        z: -3
    },
    color: {
        x: 0,
        y: 150,
        z: 255
    },
    specular: 0.25,
    lambert: 0.5,
    ambient: 0.2,
    radius: 0.7,
    visible: true
}];

function render(scene) {
    var camera = scene.camera;

    var eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point));
    var vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP));
    var vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector));

    var fovRadians = Math.PI * (camera.fieldOfView / 2) / 180;
    var heightWidthRatio = height / width;
    var halfWidth = Math.tan(fovRadians);
    var halfHeight = heightWidthRatio * halfWidth;
    var cameraWidth = halfWidth * 1.8;
    var cameraHeight = halfHeight * 1.8;
    var pixelWidth = cameraWidth / width;
    var pixelHeight = cameraHeight / height;

    var index;
    var color;
    var ray = {
        point: camera.point
    };

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {

            var xScaled = Vector.scale(vpRight, (x * pixelWidth) - halfWidth);
            var yScaled = Vector.scale(vpUp, (y * pixelHeight) - halfHeight);

            ray.vector = Vector.unitVector(Vector.add3(eyeVector, xScaled, yScaled));

            color = trace(ray, scene, 0);
            index = (x * 4) + (y * width * 4),
                data.data[index + 0] = color.x;
            data.data[index + 1] = color.y;
            data.data[index + 2] = color.z;
            data.data[index + 3] = 255;
        }
    }

    sceneCanvasContext.putImageData(data, 0, 0);
}

function trace(ray, scene, depth) {
    // checks that we haven't gone more than three bounces into a reflection
    if (depth > 3) {
        return;
    }

    var distObject = intersectScene(ray, scene);

    // if we don't hit anything, set white
    if (distObject[0] === Infinity) {
        return Vector.WHITE;
    }

    var dist = distObject[0];
    var object = distObject[1];

    var pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));

    return surface(ray, scene, object, pointAtTime, sphereNormal(object, pointAtTime), depth);
}

function intersectScene(ray, scene) {

    var closest = [Infinity, null];

    for (var i = 0; i < scene.objects.length; i++) {

        var object = scene.objects[i];
        var dist = sphereIntersection(object, ray);

        if (dist !== undefined && dist < closest[0]) {
            closest = [dist, object];
        }
    }
    return closest;
}

function sphereIntersection(sphere, ray) {
    var eyeToCenter = Vector.subtract(sphere.point, ray.point);
    var eyeRayDotProduct = Vector.dotProduct(eyeToCenter, ray.vector);
    var eyeObjectDotProduct = Vector.dotProduct(eyeToCenter, eyeToCenter);
    var discriminant = (sphere.radius * sphere.radius) - eyeObjectDotProduct + (eyeRayDotProduct * eyeRayDotProduct);

    if (discriminant < 0) {
        return;
    } else {
        return eyeRayDotProduct - Math.sqrt(discriminant);
    }
}

function sphereNormal(sphere, pos) {
    return Vector.unitVector(Vector.subtract(pos, sphere.point));
}

function surface(ray, scene, object, pointAtTime, normal, depth) {
    var b = object.color;
    var c = Vector.ZERO;
    var lambertAmount = 0;

    if (object.lambert) {
        for (var i = 0; i < scene.lights.length; i++) {

            var lightPoint = scene.lights[0];

            if (!isLightVisible(pointAtTime, scene, lightPoint)) continue;

            var contribution = Vector.dotProduct(Vector.unitVector(
                Vector.subtract(lightPoint, pointAtTime)), normal);

            if (contribution > 0) lambertAmount += contribution;

        }
    }

    if (object.specular) {

        var reflectedRay = {
            point: pointAtTime,
            vector: Vector.reflectThrough(ray.vector, normal)
        };

        var reflectedColor = trace(reflectedRay, scene, ++depth);

        if (reflectedColor) {
            c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
        }

    }

    lambertAmount = Math.min(1, lambertAmount);

    return Vector.add3(c,
        Vector.scale(b, lambertAmount * object.lambert),
        Vector.scale(b, object.ambient));
}

function isLightVisible(pt, scene, light) {
    var distObject = intersectScene({
        point: pt,
        vector: Vector.unitVector(Vector.subtract(pt, light))
    }, scene);
    return distObject[0] > -0.01;
}

var sphere0 = 0;
var sphere1 = 0;
var sphere2 = 0;
var sphere3 = 0;
var light = 0;

var dynamic = localStorage['dynamic'] || 'true';

function tick() {
    sphere0 += 0.01;
    sphere1 += 0.1;
    sphere2 += 0.2;
    sphere3 += 0.05;

    scene.objects[1].point.x = Math.tan(sphere1) * 3.5;
    scene.objects[1].point.z = -3 + (Math.cos(sphere1) * 3.5);

    scene.objects[2].point.x = Math.sin(sphere2) * 4;
    scene.objects[2].point.z = -3 + (Math.cos(sphere2) * 4);

    scene.objects[3].point.y = Math.tan(sphere3) * 5;
    scene.objects[3].point.z = -1 + (Math.tan(sphere3) * 2);

    render(scene);

    if (dynamic == 'true') {

        light += 0.05;
        lightsLocal[0].x = Math.sin(light) * 20;
        lightsLocal[0].z = -3 + (Math.cos(light) * 20);

    }

    if (playing) setTimeout(tick, 10);
}

var playing = false;


function stop() {
    playing = false;
}

function play() {
    playing = true;
    tick();
}

render(scene);

document.getElementById('play').onclick = play;
document.getElementById('stop').onclick = stop;
