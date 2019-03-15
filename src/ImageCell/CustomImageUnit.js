import React from "react";
import PropTypes from "prop-types";
import {
    isReactComponent
} from "./../utils";

export default class CustomImageUnit extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		gutter: PropTypes.number.isRequired,
		source: PropTypes.any.isRequired,
		completeCustomComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]).isRequired,
	}

	render() {
		const {
			data, width, height, gutter, source,
			completeCustomComponent
		} = this.props;
		const params = {
			source: source,
			style: {
				width: width,
				height: height,
				margin: gutter / 2
			},
			data: data
		};
		if (isReactComponent(completeCustomComponent)) {
			return React.createElement(completeCustomComponent, params);
		}
		return completeCustomComponent(params);
	}
}
