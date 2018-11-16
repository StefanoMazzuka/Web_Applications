"use strict"
let listaTareas = [
	{ text: "Preparar práctica AW", tags: ["AW", "practica"] },
	{ text: "Mirar fechas congreso", done: true, tags: [] },
	{ text: "Ir al supermercado", tags: ["personal"] },
	{ text: "Mudanza", done: false, tags: ["personal"] },
];
//1
function getTodoTasks(tasks){
	//Devuelve un array con los textos de aquellas tareas de la lista de tareas tasks que no estén finalizados.
	return tasks
			.filter(task => (task.done === false || !('done' in task)))
			.map(task => task.text);
}

console.log(getTodoTasks(listaTareas));

//2
function findByTag(tasks,tag){
	return tasks
			.filter(task => (task.tags.includes(tag)));
}

console.log(findByTag(listaTareas,"personal"));

//3
function findByTags(tasks, tags){
	return tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

let temp = ["personal", "pdap"];
console.log(findByTags(listaTareas, temp));

//4
function countDone(tasks){
	return tasks.length - getTodoTasks(tasks).length;
}
console.log(countDone(listaTareas));

//5
function createTask(texto){
	let task = {};
	task.text = texto.replace(/\@\w+/g,'');
	task.text=task.text.replace(/ +/g, ' ');
	task.text = task.text.trim();
	task.tags = texto.match(/\@\w+/g);
	return task;
}

console.log(createTask("Ir al medico @personal @salud"));
console.log(createTask("@AW            @practica Preparar práctica AW"));




