import { Component } from "react";
import PropTypes from "prop-types";

export default class CustomImageUnit extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		source: PropTypes.any.isRequired,
		completeCustomComponent: PropTypes.func.isRequired,
	}

	render() {
		const {
			data, source, completeCustomComponent
		} = this.props;
		const params = {
			source: source,
			style: {
				width: data.width,
				height: data.height,
				margin: data.gutter / 2
			},
			data: data
		};
		return completeCustomComponent(params);
	}
}
