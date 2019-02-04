import React from "react";
import { Image } from "react-native";
import PropTypes from "prop-types";
import Injector from "./Injector";

export default class ImageComponent extends React.PureComponent {
	static propTypes = {
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		gutter: PropTypes.number.isRequired,
		source: PropTypes.any.isRequired,
		imageContainerStyle: PropTypes.object,
		customImageComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		customImageProps: PropTypes.object
	}

	render() {
		const {
			width,
			height,
			gutter,
			source,
			imageContainerStyle,
			customImageComponent,
			customImageProps
		} = this.props;
		const imageProps = {
			source: source,
			resizeMethod: "auto",
			style: {
				width: width,
				height: height,
				margin: gutter / 2,
				backgroundColor: "gainsboro",
				...imageContainerStyle
			}
		};

		return (
			<Injector
				defaultComponent={Image}
				defaultProps={imageProps}
				injectant={customImageComponent}
				injectantProps={customImageProps}
			/>
		);
	}
}
