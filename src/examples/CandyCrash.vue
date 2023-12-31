<template>
<div>
  <canvas id="canvasId" ref="canvasRef" class="canvas-container"></canvas>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { paper, Path, Point } from 'paper'

const canvasRef = ref()

function Ball(r, p, v) {
	this.radius = r;
	this.point = p;
	this.vector = v;
	this.maxVec = 15;
	this.numSegment = Math.floor(r / 3 + 2);
	this.boundOffset = [];
	this.boundOffsetBuff = [];
	this.sidePoints = [];
	this.path = new Path({
		fillColor: {
			hue: Math.random() * 360,
			saturation: 1,
			brightness: 1
		},
		blendMode: 'lighter'
	});

	for (var i = 0; i < this.numSegment; i ++) {
		this.boundOffset.push(this.radius);
		this.boundOffsetBuff.push(this.radius);
		this.path.add(new Point());
		this.sidePoints.push(new Point({
			angle: 360 / this.numSegment * i,
			length: 1
		}));
	}
}

Ball.prototype = {
	iterate: function() {
    this.checkBorders();
    if (this.vector.length > this.maxVec) {
			this.vector.length = this.maxVec;
    }
		this.point = this.point.add(this.vector)
		this.updateShape();
	},

	checkBorders: function() {
    var size = paper.view.size;
		if (this.point.x < -this.radius)
			this.point.x = size.width + this.radius;
		if (this.point.x > size.width + this.radius)
			this.point.x = -this.radius;
		if (this.point.y < -this.radius)
			this.point.y = size.height + this.radius;
		if (this.point.y > size.height + this.radius)
			this.point.y = -this.radius;
	},

	updateShape: function() {
		var segments = this.path.segments;
		for (var i = 0; i < this.numSegment; i ++)
			segments[i].point = this.getSidePoint(i);

    this.path.smooth();
		for (var i = 0; i < this.numSegment; i ++) {
      if (this.boundOffset[i] < this.radius / 4)
				this.boundOffset[i] = this.radius / 4;
			var next = (i + 1) % this.numSegment;
			var prev = (i > 0) ? i - 1 : this.numSegment - 1;
			var offset = this.boundOffset[i];
			offset += (this.radius - offset) / 15;
			offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
			this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
		}
	},

  react: function (b) {
    var dist = this.point.getDistance(b.point);
		if (dist < this.radius + b.radius && dist != 0) {
			var overlap = this.radius + b.radius - dist;
			var direc = this.point.subtract(b.point).normalize(overlap * 0.015);
			this.vector = this.vector.add(direc);
      b.vector = b.vector.subtract(direc)

			this.calcBounds(b);
			b.calcBounds(this);
			this.updateBounds();
			b.updateBounds();
		}
	},

  getBoundOffset: function (b) {
		var diff = this.point.subtract(b);
		var angle = (diff.angle + 180) % 360;
		return this.boundOffset[Math.floor(angle / 360 * this.boundOffset.length)];
	},

	calcBounds: function(b) {
		for (var i = 0; i < this.numSegment; i ++) {
			var tp = this.getSidePoint(i);
			var bLen = b.getBoundOffset(tp);
			var td = tp.getDistance(b.point);
			if (td < bLen) {
				this.boundOffsetBuff[i] -= (bLen  - td) / 2;
			}
		}
	},

	getSidePoint: function (index) {
		return this.point.add(this.sidePoints[index].multiply(this.boundOffset[index]));
	},

	updateBounds: function() {
		for (let i = 0; i < this.numSegment; i ++)
			this.boundOffset[i] = this.boundOffsetBuff[i];
	}
};

const balls = [];
const numBalls = 10;


function onFrame() {
  for (let i = 0; i < balls.length - 1; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].react(balls[j]);
    }
  }
  for (let i = 0, l = balls.length; i < l; i++) {
    balls[i].iterate();
  }
}

function onResize() {
	console.log(canvasRef.value.width);
}

function draw() {
  paper.setup(canvasRef.value)
  paper.view.onFrame = onFrame
  paper.view.onResize = onResize
  for (let i = 0; i < numBalls; i++) {
      const position = Point.random().multiply(paper.view.size);
      const vector = new Point({
        angle: 360 * Math.random(),
        length: Math.random() * 10
      });
      const radius = Math.random() * 6 + 60;
      balls.push(new Ball(radius, position, vector));
  }
}

onMounted(() => {
	draw()
	window.addEventListener('resize', () => {
		canvasRef.value.width = window.innerWidth
		canvasRef.value.height = window.innerHeight
	})
})
</script>
<style scoped>
.canvas-container {
	width: 100vw;
	height: 100vh;
}
</style>