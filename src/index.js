import React, { useState, useEffect, useRef } from "react"
import { observable, action, toJS, autorun } from "mobx"
import PropTypes from "prop-types"

const createStore = (initialState, actions, options = {}) => {
	const defaultOptions = {
		persist: []
	}

	if (typeof options === "object")
		options = Object.assign({}, defaultOptions, options)

	const store = observable(initialState)

	const reactiveActions = {}
	// Make actions, well, actions
	if (typeof actions === "object")
		Object.keys(actions).forEach(k => {
			if (typeof actions[k] === "function") {
				reactiveActions[k] = (...params) =>
					action(() => {
						actions[k].call(null, store, params)
					})()
			}
		})

	const Consumer = ({ children: Children, inject = [] }) => {
		inject = useRef(inject)
		let injected = inject.current
		if (!Array.isArray(injected)) injected = [injected] // TODO: Better type check

		// Inject all store if not provided
		if (!injected.length || injected[0] === "*" || injected[0] === undefined)
			injected = Object.keys(store)

		// Returns the elements in the store we have injected in the component
		const generateStoreSubset = () => {
			if (!injected.length || injected[0] === "*" || injected[0] === undefined)
				injected = Object.keys(store)

			return injected
				.filter(v => Object.keys(store).includes(v))
				.reduce((obj, key) => {
					obj[key] = store[key]
					return obj
				}, {})
		}

		// Bind the watched keys to component's state
		const [state, setState] = useState(generateStoreSubset())

		// This is somewhat sorcery
		useEffect(() => {
			const newState = {}

			const disposer = autorun(() => {
				// Populating this just so MobX will watch those and the autorun function will run when they get updated
				injected.forEach(k => {
					newState[k] = toJS(store[k])
				})

				setState(generateStoreSubset())
			})

			return disposer
		}, [inject])

		// If I render "<Component..." instead of "<Children...", React creates a new component on each render
		// const Component = memo(props => <Children {...props} />)

		return <Children key={injected.join(",")} {...state} />
	}

	Consumer.propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.node.isRequired,
			PropTypes.func
		]),
		inject: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
	}

	return { store, Consumer, actions: reactiveActions }
}

export { createStore }
