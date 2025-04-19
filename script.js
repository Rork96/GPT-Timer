let workoutStartTime, sessionStartTime;
let workoutInterval, sessionInterval, restInterval;
let paused = false, workoutTime = 0, restTime = 0;
let isResting = false;
let restDuration = 0;

const workoutTimeEl = document.getElementById('workoutTime');
const restTimeEl = document.getElementById('restTime');
const totalTimeEl = document.getElementById('totalTime');
const messageEl = document.getElementById('message');
const beep = document.getElementById('beep');

const pauseWorkoutBtn = document.getElementById('pauseWorkout');
const resumeAfterRestBtn = document.getElementById('resumeAfterRest');
const finishWorkoutBtn = document.getElementById('finishWorkout');
const startRestBtn = document.getElementById('startRest');
const clickSound = document.getElementById('clickSound');

pauseWorkoutBtn.addEventListener('click', () => {
  paused = !paused;
  pauseWorkoutBtn.textContent = paused ? 'Resume' : 'Pause';
});

resumeAfterRestBtn.addEventListener('click', () => {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
  isResting = false;
  resumeAfterRestBtn.style.display = 'none';
  messageEl.textContent = '';
});

finishWorkoutBtn.addEventListener('click', () => {
  clearInterval(workoutInterval);
  clearInterval(sessionInterval);
  clearInterval(restInterval);
  updateSessionTime();
  messageEl.textContent = "Workout finished!";
});

startRestBtn.addEventListener('click', () => {
  const clickSound = document.getElementById("clickSound");
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play();
  }

  const totalSec = restDuration;
  if (totalSec <= 0) return;

  let remaining = totalSec;
  document.getElementById('restCircle').style.strokeDashoffset = 502;
  document.getElementById('restTimeDisplay').innerText =
    `${String(Math.floor(totalSec / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`;

  isResting = true;
  messageEl.textContent = `Resting...`;

  restInterval = setInterval(() => {
    const offset = 502 * (remaining / totalSec);
    document.getElementById('restCircle').style.strokeDashoffset = offset;
    document.getElementById('restTimeDisplay').innerText =
      `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;

    if (--remaining <= 0) {
      clearInterval(restInterval);
      restTime += totalSec;
      updateTimeDisplay(restTimeEl, restTime);

      messageEl.textContent = "Break is over — press Resume Workout!";
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 600);
      resumeAfterRestBtn.style.display = 'inline-block';
      resumeAfterRestBtn.classList.add('blink');

      let repeatCount = 0;
      const repeatBeep = () => {
        if (!isResting || repeatCount >= 10) return;
        beep.currentTime = 0;
        beep.play();
        repeatCount++;
        setTimeout(repeatBeep, 3000);
      };
      repeatBeep();
    } else {
      messageEl.textContent = `Resting...`;
    }
  }, 1000);
});

function updateSessionTime() {
  const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
  updateTimeDisplay(totalTimeEl, duration);
}

function updateTimeDisplay(el, timeInSec) {
  const min = String(Math.floor(timeInSec / 60)).padStart(2, '0');
  const sec = String(timeInSec % 60).padStart(2, '0');
  el.textContent = `${min}:${sec}`;
}