class GridPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  render() {
    noStroke()
    fill(0)
    circle(this.x, this.y, 4)
  }

  translate(x, y) {
    this.x += x;
    this.y += y;
  }
  
  static avgPos(a, b) {
    return [(a.x + b.x) / 2, (a.y + b.y) / 2]
  }

  static lineEquals(pointCoords0, direction0, pointCoords1, direction1) {
    if (pointCoords0[0] != pointCoords1[0]) {
      return false;
    }
    if (pointCoords0[1] != pointCoords1[1]) {
      return false;
    }
    if (direction0 != direction1) {
      return false;
    }
    return true;
  }
}

class Grid {
  constructor(width, height, scale) {
    this.rows = [];
    this.placedLines = [];
    this.placedTwistLines = [];
    for (let i = 0; i < height; i += 1) {
      this.rows.push([]);
      for (let j = 0; j < width; j += 1) {
        angleMode(DEGREES);
        this.rows[i].push(new GridPoint((j + (i % 2) / 2) * scale, i * scale * sin(60)));
      }
    }
  }

  render() {
    for (let i = 0; i < this.rows.length; i += 1) {
      for (let j = 0; j < this.rows[i].length; j += 1) {
        this.rows[i][j].render()
      }
    }
  }
  
  load(savedLines, savedTwistLines) {
    this.placedLines = savedLines
    this.placedTwistLines = savedTwistLines
  }
  
  nearestMidpoint(x, y) {
    let closestDistance = Infinity
    let direction = 0
    let closestPoint = [0, 0]
    let dirs = [[0, 1], [1, 0], [1, -1], [0, 1], [1, 1], [1, 0]]
    for (let i = 1; i < this.rows.length - 1; i += 1) {
      for (let j = 1; j < this.rows[i].length - 1; j += 1) {
        let curDistance = 0
        let avgPos = [0, 0]
        for (let d = 0; d < 3; d += 1) {
          let dirOffset = dirs[3 * (i % 2) + d]
          avgPos = GridPoint.avgPos(this.rows[i][j], this.rows[i + dirOffset[0]][j + dirOffset[1]])
          curDistance = dist(avgPos[0], avgPos[1], x, y)
          if (curDistance < closestDistance) {
            closestDistance = curDistance
            closestPoint = [i, j]
            direction = 3 * (i % 2) + d
          }
        }
      }
    }
    return [closestPoint, direction];
  }
  
  renderPreviewLine(pointCoords, direction) {
    let dirs = [[0, 1], [1, 0], [1, -1], [0, 1], [1, 1], [1, 0]]
    let dirOffset = dirs[direction]
    let sourcePoint = this.rows[pointCoords[0]][pointCoords[1]]
    let sinkPoint = this.rows[pointCoords[0] + dirOffset[0]][pointCoords[1] + dirOffset[1]]
    let alreadyExists = false
    for (let i = 0; i < this.placedLines.length; i += 1) {
      if (GridPoint.lineEquals(pointCoords, direction, this.placedLines[i][0], this.placedLines[i][1])) {
        alreadyExists = true
      }
    }
    strokeCap(ROUND)
    stroke(0)
    if (alreadyExists) {
      stroke(255, 200)
    }
    strokeWeight(5)
    line(sourcePoint.x, sourcePoint.y, sinkPoint.x, sinkPoint.y)
  }

  placeLine(pointCoords, direction) {
    let alreadyExists = false
    for (let i = 0; i < this.placedLines.length; i += 1) {
      if (GridPoint.lineEquals(pointCoords, direction, this.placedLines[i][0], this.placedLines[i][1])) {
        alreadyExists = true
      }
    }
    if (!alreadyExists) {
      this.placedLines.push([pointCoords, direction])
    }
  }

  removeLine(pointCoords, direction) {
    let alreadyExists = false
    let lineIndex = 0
    for (let i = 0; i < this.placedLines.length; i += 1) {
      if (GridPoint.lineEquals(pointCoords, direction, this.placedLines[i][0], this.placedLines[i][1])) {
        alreadyExists = true
        lineIndex = i
        print(i)
      }
    }
    if (alreadyExists) {
      this.placedLines.splice(lineIndex, 1)
    }
  }

  placeTwistLine(pointCoords, direction) {
    let alreadyExists = false
    for (let i = 0; i < this.placedTwistLines.length; i += 1) {
      if (GridPoint.lineEquals(pointCoords, direction, this.placedTwistLines[i][0], this.placedTwistLines[i][1])) {
        alreadyExists = true
      }
    }
    if (!alreadyExists) {
      this.placedTwistLines.push([pointCoords, direction])
    }
  }

  removeTwistLine(pointCoords, direction) {
    let alreadyExists = false
    let lineIndex = 0
    for (let i = 0; i < this.placedTwistLines.length; i += 1) {
      if (GridPoint.lineEquals(pointCoords, direction, this.placedTwistLines[i][0], this.placedTwistLines[i][1])) {
        alreadyExists = true
        lineIndex = i
        print(i)
      }
    }
    if (alreadyExists) {
      this.placedTwistLines.splice(lineIndex, 1)
    }
  }

  renderPlacedLines() {
    let dirs = [[0, 1], [1, 0], [1, -1], [0, 1], [1, 1], [1, 0]]
    for (let i = 0; i < this.placedLines.length; i += 1) {
      let sourcePoint = this.rows[this.placedLines[i][0][0]][this.placedLines[i][0][1]]
      let sinkPoint = this.rows[this.placedLines[i][0][0] + dirs[this.placedLines[i][1]][0]][this.placedLines[i][0][1] + dirs[this.placedLines[i][1]][1]]
      strokeCap(ROUND)
      stroke(0)
      strokeWeight(5)
      line(sourcePoint.x, sourcePoint.y, sinkPoint.x, sinkPoint.y)
    }
  }
  
  renderPlacedTwistLines() {
    let dirs = [[-1, 0, 1, 0], [0, 1, 1, -1], [0, -1, 1, 0], [-1, 1, 1, 1], [0, 1, 1, 0], [0, -1, 1, 1]]
    for (let i = 0; i < this.placedTwistLines.length; i += 1) {
      let sourcePoint = this.rows[this.placedTwistLines[i][0][0] + dirs[this.placedTwistLines[i][1]][0]][this.placedTwistLines[i][0][1] + dirs[this.placedTwistLines[i][1]][1]]
      let sinkPoint = this.rows[this.placedTwistLines[i][0][0] + dirs[this.placedTwistLines[i][1]][2]][this.placedTwistLines[i][0][1] + dirs[this.placedTwistLines[i][1]][3]]
      strokeCap(ROUND)
      stroke(0)
      strokeWeight(5)
      line(sourcePoint.x, sourcePoint.y, sinkPoint.x, sinkPoint.y)
    }
  }

  translate(x, y) {
    for (let i = 0; i < this.rows.length; i += 1) {
      for (let j = 0; j < this.rows[i].length; j += 1) {
        this.rows[i][j].translate(x, y)
      }
    }
  }
}

var grid
var loadedLinesStrings
var loadedLines
var loadedTwistLines

function preload() {
  loadedLinesStrings = loadStrings('bloom.txt')
}

function setup() {
  loadedLines = JSON.parse(loadedLinesStrings[0])
  loadedTwistLines = JSON.parse(loadedLinesStrings[1])
  createCanvas(windowWidth, windowHeight)
  print('hello')
  grid = new Grid(100, 100, 30)
  document.addEventListener('contextmenu', event => event.preventDefault());
  grid.load(loadedLines, loadedTwistLines)
}

function draw() {
  background(255)
  grid.render()
  let closestPointInfo = grid.nearestMidpoint(mouseX, mouseY)
  grid.renderPlacedLines()
  grid.renderPlacedTwistLines()
  grid.renderPreviewLine(closestPointInfo[0], closestPointInfo[1])
}

function mousePressed() {
  let closestPointInfo = grid.nearestMidpoint(mouseX, mouseY)
  if (mouseButton === LEFT) {
    if (keyIsDown(32)) {
      grid.placeTwistLine(closestPointInfo[0], closestPointInfo[1])
    } else {
      grid.placeLine(closestPointInfo[0], closestPointInfo[1])
    }
  }
  if (mouseButton === RIGHT) {
    if (keyIsDown(32)) {
      grid.removeTwistLine(closestPointInfo[0], closestPointInfo[1])
    } else {
      grid.removeLine(closestPointInfo[0], closestPointInfo[1])
    }
  }
  savedLines = JSON.stringify(grid.placedLines)
  print(savedLines)
  savedTwistLines = JSON.stringify(grid.placedTwistLines)
  print(savedTwistLines)
}

function keyPressed() {
  if (key === 'w') {
    grid.translate(0, 100)
  }
  if (key === 'a') {
    grid.translate(100, 0)
  }
  if (key === 's') {
    grid.translate(0, -100)
  }
  if (key === 'd') {
    grid.translate(-100, 0)
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}