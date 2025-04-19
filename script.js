let workoutStartTime, sessionStartTime;
let workoutInterval, sessionInterval, restInterval;
let paused = false, workoutTime = 0, restTime = 0;
let isResting = false;

const workoutTimeEl = document.getElementById('workoutTime');
const restTimeEl = document.getElementById('restTime');
const totalTimeEl = document.getElementById('totalTime');
const messageEl = document.getElementById('message');
const beep = document.getElementById('beep');

const startWorkoutBtn = document.getElementById('startWorkout');
const pauseWorkoutBtn = document.getElementById('pauseWorkout');
const resumeAfterRestBtn = document.getElementById('resumeAfterRest');
const finishWorkoutBtn = document.getElementById('finishWorkout');
const startRestBtn = document.getElementById('startRest');

startWorkoutBtn.addEventListener('click', () => {
  if (!sessionStartTime) sessionStartTime = Date.now();
  if (!workoutStartTime) workoutStartTime = Date.now();

  if (!sessionInterval) sessionInterval = setInterval(updateSessionTime, 1000);
  if (!workoutInterval) workoutInterval = setInterval(() => {
    if (!paused && !isResting) {
      workoutTime++;
      updateTimeDisplay(workoutTimeEl, workoutTime);
    }
  }, 1000);
});

pauseWorkoutBtn.addEventListener('click', () => {
  paused = !paused;
  pauseWorkoutBtn.textContent = paused ? 'Resume' : 'Pause';
});

resumeAfterRestBtn.addEventListener('click', () => {
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
  const min = parseInt(document.getElementById('restMin').value) || 0;
  const sec = parseInt(document.getElementById('restSec').value) || 0;
  const totalSec = min * 60 + sec;

  if (totalSec <= 0) return;

  let remaining = totalSec;
  isResting = true;
  messageEl.textContent = `Resting: ${min}m ${sec}s`;

  restInterval = setInterval(() => {
    if (--remaining <= 0) {
      clearInterval(restInterval);
      restTime += totalSec;
      updateTimeDisplay(restTimeEl, restTime);
      beep.play();
      messageEl.textContent = "Break is over — press Resume Workout!";
      resumeAfterRestBtn.style.display = 'inline-block';
      resumeAfterRestBtn.classList.add('blink');
    } else {
      messageEl.textContent = `Resting: ${Math.floor(remaining / 60)}m ${remaining % 60}s`;
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