# React Easy Store

<p align="center">
![Travis (.org)](https://img.shields.io/travis/coriou/react-easy-store?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@coriou/react-easy-store)
</p>

A dead simple wrapper around MobX to easily create and maintain a simple global store

**Disclaimer**: Not ready for production

### Huh ?

I’m sick of writing large boilerplate code when I just need a simple « store » I want to use from anywhere in my React app. I’m using the approach to greatly simplify this process. It’s not meant to be used in large apps, that need complex store management and update logic.

But when I just want to make a simple React app, and I need a global store (which is most of the times), this makes it much easier.

The package exports a single function « createStore » which takes at least two arguments « initialState » and « actions ».

-   `initialState` has to be an object, but can be empty. It’s your initial state for your global store

-   `actions` has to be an object, but can be empty. This is where you’ll put your logic to update the store

```js
// An object representing your initial state
const initialState = {
	todo: [
		{
			task: "Finish this project",
			completed: false
		}
	]
}

// An object where each key is a method
const reducers = {
	addToDo: (store, [task]) => {
		store.todo.push(task)
	},
	toggleTodoState: (store, [task]) => {
		store.todo[task].completed = !store.todo[task].completed
	},
	deleteToDo: (store, [task]) => {
		store.todo.splice(task, 1)
	}
}
```

### Usage

```js
import React from "react"
import { createStore } from "@coriou/react-easy-store"

const initialState = {
	todo: []
}

const reducers = {
	addToDo: (store, [task, completed]) => {
		store.todo.push({
			task: task,
			completed: completed
		})
	},
	toggleTodoState: (store, [task]) => {
		store.todo[task].completed = !store.todo[task].completed
	}
}

// Create the store and the actions
const { Consumer, actions, store } = createStore(initialState, reducers)

// Can now call actions.addToDo
actions.addToDo("Do something with my life", false)

console.log(store.todo)
// [ { task: 'Do something with my life', completed: false } ]

// Use in React
const Component = () => (
	<>
		<h1>To do list</h1>
		<Consumer inject="todo">
			{({ todo }) => (
				<ul>
					{todo.map((t, i) => (
						<li
							key={i}
							style={{ color: t.completed ? "red" : "green" }}
							onClick={() => actions.toggleTodoState(i)}
						>
							{t.task}
						</li>
					))}
				</ul>
			)}
		</Consumer>
	</>
)
```

### Install

`yarn add @coriou/react-easy-store`

You must install `mobx` (>= 4) and `react` (>= 16.8.0) if you don’t use them already

`yarn add mobx react`

### Example

```js
import React from "react"
import { createStore } from "@coriou/react-easy-store"

// Your initial store
const initialState = {
	todo: [
		{
			task: "Finish this project",
			completed: false
		},
		{
			task: "Write a readme",
			completed: true
		}
	]
}

// The « actions » / « reducers »
const reducers = {
	addToDo: (store, [task]) => {
		store.todo.push(task)
	},
	toggleTodoState: (store, [task]) => {
		store.todo[task].completed = !store.todo[task].completed
	},
	deleteToDo: (store, [task]) => {
		store.todo.splice(task, 1)
	}
}

const { Consumer, actions } = createStore(initialState, reducers)

// Your app
const App = () => (
	<>
		<h1>React Easy Store</h1>

		{/** Listening to all store changes */}
		<Consumer>
			{store => {
				return <pre>{JSON.stringify(store, null, 2)}</pre>
			}}
		</Consumer>

		<hr />

		{/** Listening only to "todo" changes */}
		<Consumer inject="todo">
			{({ todo }) => {
				if (!todo.length) return null

				return (
					<>
						<h4>Todo list:</h4>
						<ul>
							{todo.map((td, i) => (
								<li key={i}>
									<span
										onClick={() =>
											actions.toggleTodoState(i)
										}
										style={{
											color: td.completed
												? "green"
												: "red",
											textDecoration: td.completed
												? "line-through"
												: "none",
											cursor: "pointer"
										}}
									>
										{i} - {td.task}
									</span>
									<span
										style={{
											display: "block",
											color: "#BABABA",
											fontSize: "60%"
										}}
									>
										Status:{" "}
										{td.completed ? "Done" : "To do"}
									</span>
									<span
										style={{
											display: "block",
											fontSize: "60%"
										}}
									>
										<a
											href="#"
											onClick={() =>
												actions.deleteToDo(i)
											}
										>
											Delete
										</a>
									</span>
								</li>
							))}
						</ul>
					</>
				)
			}}
		</Consumer>

		<input
			type="text"
			placeholder="Add todo"
			onChange={e => (newToDo = e.target.value)}
			ref={inputElement}
		/>
		<button onClick={add}>Add to list</button>
	</>
)
```
