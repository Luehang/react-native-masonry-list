import { PureComponent } from "react";
import PropTypes from "prop-types";

export default class CustomImageUnit extends PureComponent {
	static propTypes = {
		data: PropTypes.object.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		gutter: PropTypes.number.isRequired,
		source: PropTypes.any.isRequired,
		completeCustomComponent: PropTypes.func.isRequired,
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
		return completeCustomComponent(params);
	}
}
