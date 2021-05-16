var correlatedFeatures = [];
var anomalies = [];

function createDict(text) {
    let map = new Map();
    let rows = text.split("\r\n");
    let headers = rows[0].split(",")
    let arr = []
    for (let i = 0; i < headers.length; i++)
        arr[i] = []
    for (let i = 1; i < rows.length; i++) {
        let partition = rows[i].split(",");
        for (let j = 0; j < partition.length; j++) {
            arr[j].push(parseFloat(partition[j]));
        }
    }
    for (let i = 0; i < headers.length; i++) {
        if (map.has(headers[i]))
            map.set(headers[i] + '1', arr[i]);
        else
            map.set(headers[i], arr[i]);
    }
    return map;

}

function learn(dict, model_type) {
    correlatedFeatures = [];
    let arr = Array.from(dict.keys());
    let vals = [];
    let len = dict.get(arr[1]).length;
    let i;
    for (i = 0; i < arr.length; i++)
        vals[i] = [];
    for (i = 0; i < arr.length; i++) {
        let x = dict.get(arr[i]);
        for (let j = 0; j < len; j++) {
            vals[i][j] = x[j];
        }
    }

    for (i = 0; i < arr.length; i++) {
        let f1 = arr[i];
        let max = 0;
        let jmax = 0;
        for (let j = i + 1; j < arr.length; j++) {
            let p = Math.abs(pearson(vals[i], vals[j], len));
            if (p > max) {
                max = p;
                jmax = j;
            }
        }
        let f2 = arr[jmax];
        let ps = toPoints(dict.get(f1), dict.get(f2));

        regressionLearnHelper(dict, arr, max, f1, f2, ps);
        if (model_type.detection_algorithms.localeCompare("hybrid") === 0)
            hybridLearnHelper(max, f1, f2, ps);
    }
}


function regressionLearnHelper(dict, arr, p/*pearson*/, f1, f2, ps) {
    if (p > 0.9) {
        let len = dict.get(arr[1]).length;
        let c = {
            feature1: f1,
            feature2: f2,
            corrlation: p,
            lin_reg: linear_reg(ps, len),
        };
        c.threshold = findThreshold(ps, len, c.lin_reg) * 1.1
        correlatedFeatures.push(c);
    }
}


function hybridLearnHelper(p/*pearson*/, f1, f2, ps) {
    if (p > 0.5 && p < 0.9) {
        const enclosingCircle = require('smallest-enclosing-circle')
        const circle = enclosingCircle(ps);
        let c = {
            feature1: f1,
            feature2: f2,
            corrlation: p,
            threshold: circle.r * 1.1, // 10% increase
            cx: circle.x,
            cy: circle.y,
        };
        correlatedFeatures.push(c)

    }

}

function detect(dict, model_type) {
    anomalies = [];
    for (let i = 0; i < correlatedFeatures.length; i++) {
        let spanColumn = [];
        let x = dict.get(correlatedFeatures[i].feature1);
        let y = dict.get(correlatedFeatures[i].feature2);
        let j = 0;
        while (j < x.length) {
            let startIndex = j + 1;
            while (j < x.length && isAnomalous(x[j], y[j], correlatedFeatures[i], model_type)) {
                j++;
            }
            let endIndex = j + 1;
            if (startIndex !== endIndex) {
                let span = [];
                span.push(startIndex);
                span.push(endIndex);
                spanColumn.push(span);
            } else
                j++;
        }
        let pair_of_features ={
            feature1: correlatedFeatures[i].feature1,
            feature2: correlatedFeatures[i].feature2
        } ;
        let toPush = {
            pair_of_features: pair_of_features,
            anoamly_at: spanColumn.length > 0 ? spanColumn : {},
            algorithm_type: model_type.detection_algorithms
        };
        anomalies.push(toPush);

    }
    return anomalies;
}

function isAnomalous(x, y, c, model_type) {
    if (model_type.detection_algorithms.localeCompare("hybrid") === 0)
        if ((c.corrlation >= 0.9 && Math.abs(y - c.lin_reg.f(x)) > c.threshold) ||
            (c.corrlation > 0.5 && c.corrlation < 0.9 && dist(new Point(c.cx, c.cy), new Point(x, y)) > c.threshold))
            return true;
        else
            return false;
    else if (Math.abs(y - c.lin_reg.f(x)) > c.threshold)
        return true;
    else
        return false;
}

function findThreshold(ps, len, rl) {
    let max = 0;
    for (let i = 0; i < len; i++) {
        let d = Math.abs(ps[i].y - rl.f(ps[i].x));
        if (d > max)
            max = d;
    }
    return max;
}

function toPoints(x, y) {
    var ps = [];
    for (let i = 0; i < x.length; i++) {
        ps[i] = new Point(x[i], y[i]);
    }
    return ps;
}


function dist(a, b) {
    let x2 = (a.x - b.x) * (a.x - b.x);
    let y2 = (a.y - b.y) * (a.y - b.y);
    return Math.sqrt(x2 + y2);
}


class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    f(x) {
        return this.a * x + this.b;
    }
}

class Circle {
    constructor(point, radius) {
        this.center = new Point(point.x, point.y);
        this.radius = radius;
    }

}

function avg(x, size) {
    let sum = 0;
    for (let i = 0; i < size; i++) {
        sum += x[i];
    }
    return sum / size;
}

// returns the variance of X and Y
function variance(x, size) {
    let sum1 = 0, avg1 = 0, avg2 = 0;
    for (let i = 0; i < size; i++) {
        sum1 += Math.pow(x[i], 2);
    }
    avg1 = sum1 / size;
    avg2 = avg(x, size);
    return avg1 - Math.pow(avg2, 2);
}

// returns the covariance of X and Y
function cov(x, y, size) {
    let cov = 0, sum = 0;
    // getting the average of X and Y
    let Ex = avg(x, size);
    let Ey = avg(y, size);
    for (let i = 0; i < size; i++) {
        sum += (x[i] - Ex) * (y[i] - Ey);
    }
    cov = sum / size;
    return cov;
}

// returns the Pearson correlation coefficient of X and Y
function pearson(x, y, size) {
    let sigmaX = Math.sqrt(variance(x, size));
    let sigmaY = Math.sqrt(variance(y, size));
    return cov(x, y, size) / (sigmaX * sigmaY);
}

// performs a linear regression and returns the line equation
function linear_reg(points, size) {
    // creating arrays of each coordinate
    let coorX = [];
    let coorY = [];
    for (let i = 0; i < size; i++) {
        coorX[i] = points[i].x;
        coorY[i] = points[i].y;
    }
    // getting the average of X and Y
    let avgX = avg(coorX, size);
    let avgY = avg(coorY, size);
    // getting the "a" and "b" of the line equation
    let a = cov(coorX, coorY, size) / variance(coorX, size);
    let b = avgY - a * avgX;

    return new Line(a, b);
}

// returns the deviation between point p and the line equation of the points
function dev(p, points, size) {
    // initializng a line from the given points
    let line = linear_reg(points, size);
    // getting the y coordinate of the given x on the line
    let fx = line.f(p.x);
    // getting the deviation
    let dev = Math.abs(p.y - fx);
    return dev;
}

// returns the deviation between point p and the line
function dev(p, l) {
    let fx = l.f(p.x);
    let dev = Math.abs(p.y - fx);
    return dev;
}


module.exports.createDict = createDict;
module.exports.learn = learn
module.exports.detect = detect;
