import React, { Component } from "react";
import "./App.css";
import NoteListContainer from "./components/noteList/NoteListContainer"
import PageContainer from "./components/PageContainer";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../src/actions'

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {
			displayedNote: "new",
		}
	}

	componentDidMount() {
		this.setState({
			displayedNote: "new"
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.notes.length != this.props.notes.length) {
			this.setState({
				displayedNote: "new"
			}, 	this.props.loadAllNotes())
		}
	}

	selectNote = (event) => {
		console.log("in selectNote")
		let target_id = event.target.id
		let selected = ""
		if (target_id != "new") {
			selected =  this.props.notes.find((note) => {
				return note.id == target_id
			})
		} else {
			selected = "new"
		}
		this.setState({
			displayedNote: selected
		})

	}


	render() {
		return (
			<div className="App">
				<NoteListContainer selectNote={this.selectNote}/>
				<PageContainer displayedNote={this.state.displayedNote} />
			</div>
		);
	}
}

function mapStateToProps(state, props) {
  return {
    notes: state.notes.allNotes,
		displayedNote: state.notes.displayedNote
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
