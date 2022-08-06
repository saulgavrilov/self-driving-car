const carCanvas = document.querySelector('#carCanvas');
const networkCanvas = document.querySelector('#networkCanvas');

carCanvas.width = 200;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const n = 1500;
const cars = generateCars(n);
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
  for (let i = 0; i < cars.lengthl; i += 1) {
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.9);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
];

animate();

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem('bestBrain');
}

function generateCars(n) {
  const cars = [];
  for (let i = 0; i <= n; i += 1) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i += 1) {
    traffic[i].update(road.borders, []);
  }

  for (let k = 0; k < cars.length; k += 1) {
    cars[k].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let j = 0; j < traffic.length; j += 1) {
    traffic[j].draw(carCtx, 'red');
  }

  carCtx.globalAlpha = 0.2;
  for (let t = 0; t < cars.length; t += 1) {
    cars[t].draw(carCtx, 'blue');
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'blue', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}
