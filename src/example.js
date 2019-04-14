import React, { useEffect, useRef, useState } from "react"
import { render } from "react-dom"
import { createStore } from "./index"

const initialState = {
	todo: [
		{
			task: "Finish this project",
			completed: false
		}
	],
	someotherstuff: "Oh yeah",
	deep: {
		so: ["fucking", "deep"]
	}
}

const reducers = {
	addToDo: (store, [task]) => {
		store.todo.push(task)
	},
	toggleTodoState: (store, [task]) => {
		store.todo[task].completed = !store.todo[task].completed
	},
	deleteToDo: (store, [task]) => {
		store.todo.splice(task, 1)
	},
	changeOtherStuff: (store, [event]) => {
		store.someotherstuff = event.target.value
	},
	editDeep: store => {
		// store.deep.so.push("isn't it ?")
		store.deep.so[1] = "cool"
	}
}

const { Consumer, actions } = createStore(initialState, reducers)

const App = () => {
	// Test component that'll run an action after x ms
	const AutoUpdate = ({ timeout = 5e3, action = () => {} }) => {
		const autoUpdateTimeoutMS = timeout
		const [updateIn, setUpdateIn] = useState(autoUpdateTimeoutMS / 1000)
		const [done, setDone] = useState(false)

		useEffect(() => {
			const willUpdateAt = Date.now() + autoUpdateTimeoutMS

			const timeout = setTimeout(() => action(), autoUpdateTimeoutMS)
			const interval = setInterval(() => {
				setUpdateIn(((willUpdateAt - Date.now()) / 1000).toFixed(2))
				if (willUpdateAt - Date.now() <= 0) {
					clearInterval(interval)
					setUpdateIn(0)
					setDone(true)
				}
			}, autoUpdateTimeoutMS / 50)

			return () => {
				clearInterval(interval)
				clearTimeout(timeout)
			}
		}, [timeout, action])

		if (done) return null

		return (
			<span
				style={{
					color: "#BABABA",
					fontSize: "60%"
				}}
			>
				Will auto-update in {updateIn} s
			</span>
		)
	}

	var newToDo = ""
	const inputElement = useRef(null)
	const add = () => {
		if (newToDo && newToDo !== "") {
			actions.addToDo({
				task: newToDo,
				completed: false
			})
			newToDo = ""
			inputElement.current.value = newToDo
		}
	}

	return (
		<>
			<h1>React Easy Store</h1>

			<AutoUpdate timeout={5e3} action={actions.editDeep} />

			<h4>Store:</h4>

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

			<hr />

			{/** Listening only to "someotherstuff" changes */}
			<Consumer inject="someotherstuff">
				{({ someotherstuff }) => {
					return (
						<>
							<h4>Some other stuff</h4>
							<p>{someotherstuff}</p>
							<textarea
								onChange={actions.changeOtherStuff}
								placeholder={"Type something"}
							/>
						</>
					)
				}}
			</Consumer>
		</>
	)
}

render(<App />, document.getElementById("app"))
