<template>
  <div>
    <canvas id="canvasId" ref="canvasRef" class="canvas-container"></canvas>
  </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue'
  import { paper, Path, Point } from 'paper'
  
  const canvasRef = ref()
  const path = ref()
  
  var points = 25;

// The distance between the points:
var length = 35;

function onMouseMove(event) {
	path.value.firstSegment.point = event.point;
	for (var i = 0; i < points - 1; i++) {
		var segment = path.value.segments[i];
		var nextSegment = segment.next;
		var vector = segment.point.subtract(nextSegment.point);
		vector.length = length;
		nextSegment.point = segment.point.subtract(vector);
	}
	path.value.smooth({ type: 'continuous' });
}

function onMouseDown(event) {
	path.value.fullySelected = true;
	path.value.strokeColor = '#e08285';
}

function onMouseUp(event) {
	path.value.fullySelected = false;
	path.value.strokeColor = '#e4141b';
}
  
  function draw() {
    paper.setup(canvasRef.value)
    paper.view.onMouseMove = onMouseMove
    paper.view.onMouseDown = onMouseDown
    paper.view.onMouseUp = onMouseUp

    path.value = new Path({
      strokeColor: '#E4141B',
      strokeWidth: 20,
      strokeCap: 'round'
    });

    var start = paper.view.center / [10, 1];
      for (var i = 0; i < points; i++) {
        path.value.add(start + new Point(i * length, 0));
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