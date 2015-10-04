var Vector = {};

Vector.ZERO = {
    x: 0,
    y: 0,
    z: 0
};
Vector.UP = {
    x: 0,
    y: 1,
    z: 0
};
Vector.WHITE = {
    x: 255,
    y: 255,
    z: 255
};

Vector.add = function(a, b) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    };
};

Vector.add3 = function(a, b, c) {
    return {
        x: a.x + b.x + c.x,
        y: a.y + b.y + c.y,
        z: a.z + b.z + c.z
    };
};

Vector.subtract = function(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    };
};

// http://en.wikipedia.org/wiki/Dot_product // iloczyn skalarny
Vector.dotProduct = function(a, b) {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
};

// http://en.wikipedia.org/wiki/Cross_product // iloczyn wektorowy
Vector.crossProduct = function(a, b) {
    return {
        x: (a.y * b.z) - (a.z * b.y),
        y: (a.z * b.x) - (a.x * b.z),
        z: (a.x * b.y) - (a.y * b.x)
    };
};

Vector.scale = function(a, multiplier) {
    return {
        x: a.x * multiplier,
        y: a.y * multiplier,
        z: a.z * multiplier
    };
};

// http://en.wikipedia.org/wiki/Unit_vector // wektor jednostkowy
// turn any vector into a vector that has a magnitude of 1
// https://en.wikipedia.org/wiki/Unit_sphere
Vector.unitVector = function(a) {
    return Vector.scale(a, 1 / Vector.length(a));
};

// https://en.wikipedia.org/wiki/Euclidean_vector#Length // długość wektora
Vector.length = function(a) {
    return Math.sqrt(Vector.dotProduct(a, a));
};

Vector.reflectThrough = function(a, normal) {
    var d = Vector.scale(normal, Vector.dotProduct(a, normal));
    return Vector.subtract(Vector.scale(d, 2), a);
};
