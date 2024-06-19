class Task {
  constructor(name, duration) {
    this.name = name;
    this.duration = duration;
    this.precedents = [];
    this.successors = [];
    this.earlyStart = 0;
    this.earlyFinish = 0;
    this.lateStart = Infinity;
    this.lateFinish = Infinity;
  }
}

function buildGraph(tasks) {
  const taskMap = new Map();

  tasks.forEach(taskObj => {
    const [taskName, { duree, precedents }] = Object.entries(taskObj)[0];
    if (!taskMap.has(taskName)) {
      taskMap.set(taskName, new Task(taskName, duree));
    }
    const task = taskMap.get(taskName);
    task.duration = duree;
    task.precedents = precedents;

    precedents.forEach(precedentName => {
      if (!taskMap.has(precedentName)) {
        taskMap.set(precedentName, new Task(precedentName, 0));
      }
      const precedentTask = taskMap.get(precedentName);
      precedentTask.successors.push(task);
    });
  });

  return taskMap;
}

function calculateEarlyTimes(taskMap) {
  taskMap.forEach(task => {
    task.earlyFinish = task.earlyStart + task.duration;
    task.successors.forEach(successor => {
      successor.earlyStart = Math.max(successor.earlyStart, task.earlyFinish);
    });
  });
}

function calculateLateTimes(taskMap, totalProjectDuration) {
  // Initialisation des lateFinish pour les tâches sans successeurs
  taskMap.forEach(task => {
    if (task.successors.length === 0) {
      task.lateFinish = totalProjectDuration;
    }
  });

  Array.from(taskMap.values()).reverse().forEach(task => {
    task.lateStart = task.lateFinish - task.duration;
    task.precedents.forEach(precedentName => {
      const precedentTask = taskMap.get(precedentName);
      precedentTask.lateFinish = Math.min(precedentTask.lateFinish, task.lateStart);
    });
  });
}

function findCriticalPath(taskMap) {
  const criticalPath = [];
  taskMap.forEach(task => {
    if (task.earlyStart === task.lateStart) {
      criticalPath.push(task.name);
    }
  });
  return criticalPath;
}

function calculateProjectDuration(taskMap) {
  let totalDuration = 0;
  taskMap.forEach(task => {
    totalDuration = Math.max(totalDuration, task.earlyFinish);
  });
  return totalDuration;
}

export function pert(tasks) {
  const taskMap = buildGraph(tasks);
  calculateEarlyTimes(taskMap);

  const totalProjectDuration = calculateProjectDuration(taskMap);
  calculateLateTimes(taskMap, totalProjectDuration);

  const criticalPath = findCriticalPath(taskMap);

  return {
    totalDuration: totalProjectDuration,
    criticalPath,
    taskDetails: Array.from(taskMap.values()).map(task => ({
      name: task.name,
      earlyStart: task.earlyStart,
      earlyFinish: task.earlyFinish,
      lateStart: task.lateStart,
      lateFinish: task.lateFinish,
      duration: task.earlyFinish - task.earlyStart,
      precedents: task.precedents.join(", "),
      marge: task.lateFinish - task.earlyFinish

    }))

  };
}

// Exemple d'utilisation
const tasks = [
  { 'tache 1': { duree: 3, precedents: [] } },
  { 'tache 2': { duree: 5, precedents: ['tache 1'] } },
  { 'tache 3': { duree: 2, precedents: ['tache 1'] } },
  { 'tache 4': { duree: 4, precedents: ['tache 2', 'tache 3'] } }
];

const result = pert(tasks);

console.log("Durée totale du projet :", result.totalDuration);
console.log("Chemin critique :", result.criticalPath);
console.log("Détails des tâches :", result.taskDetails);

