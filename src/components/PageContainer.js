import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions'
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import createHighlightPlugin from "./plugins/highlightPlugin";
import addLinkPlugin from "./plugins/addLinkPlugin";

const highlightPlugin = createHighlightPlugin();


class PageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			noteTitle: "",
			editorState: EditorState.createEmpty()
		};

		this.plugins = [
			addLinkPlugin,
			highlightPlugin,
		];
	}


	componentDidMount() {
		let displayedNote = this.props.displayedNote
		if (displayedNote == "new" ) {
			editorState: EditorState.createEmpty()
		} else if (!!displayedNote && !!displayedNote.id) {
			editorState: EditorState.createWithContent(convertFromRaw(this.props.displayedNote.content))
		}

	}

	onChange = editorState => {
		this.setState({
			editorState
		});
	}

	submitEditor = () => {
		debugger
		let displayedNote = this.props.displayedNote
		let contentState = this.state.editorState.getCurrentContent()
		if (displayedNote == "new") {
			let noteTitle = this.state.noteTitle
			let note = {title: noteTitle, content: convertToRaw(contentState)}
			note["content"] = JSON.stringify(note.content)
			console.log(note)
			this.props.createNote(note.title, note.content)
		} else if (!!displayedNote && !!displayedNote.id) {
			this.props.updateNote(displayedNote.id, this.state.noteTitle, convertToRaw(this.state.editorState))

		}
	}

	captureTitle = (event) => {
		event.preventDefault()
		let value = event.target.value
		this.setState({
			noteTitle: value
		})
	}

	handleKeyCommand = command => {
		const newState = RichUtils.handleKeyCommand(
			this.state.editorState,
			command
		);
		if (newState) {
			this.onChange(newState);
			return "handled";
		}
		return "not-handled";
	};

	onUnderlineClick = () => {
		this.onChange(
			RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
		);
	};

	onBoldClick = () => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
	};

	onItalicClick = () => {
		this.onChange(
			RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
		);
	};

	render() {
		return (
			<div className="editorContainer">

				<button onClick={this.onUnderlineClick}>
					U
				</button>
				<button onClick={this.onBoldClick}>
					<b>B</b>
				</button>
				<button onClick={this.onItalicClick}>
					<em>I</em>
				</button>
				<div className="aboveEditor">
					<div><button className="submitNote" onClick={this.submitEditor}>Save</button></div>
					<input type="text" name="noteTitle" className="noteTitle" value={this.state.noteTitle} onChange={this.captureTitle}/>
				</div>
				<div className="editors">
					<Editor
						editorState={this.state.editorState}
						handleKeyCommand={this.handleKeyCommand}
						plugins={this.plugins}
						onChange={this.onChange}
						/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		notes: state.notes.allNotes,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer)
