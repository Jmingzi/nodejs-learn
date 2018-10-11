let counts = 0;

function wait (mstime) {
  let date = Date.now();
  while (Date.now() - date < mstime) {
    // do nothing
    counts += 1
  }
}

function nextTick () {
  process.nextTick(() => {
    wait(20);
    nextTick();
  });
}

const lastTime = Date.now();

setTimeout(() => {
  console.log(counts)
  console.log('timers', Date.now() - lastTime + 'ms');
}, 0);

nextTick();