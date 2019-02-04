import React from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import ImageComponent from "./ImageComponent";

export default class TouchableImageComponent extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		gutter: PropTypes.number.isRequired,
		source: PropTypes.any.isRequired,
		imageContainerStyle: PropTypes.object,
		customImageComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		customImageProps: PropTypes.object,
		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func
	}

	render() {
		const {
			data, width, height, gutter, source,
			imageContainerStyle, onPressImage,
			onLongPressImage, customImageComponent,
			customImageProps
		} = this.props;
		return (
			<TouchableOpacity
				onPress={() => onPressImage && onPressImage(data, data.index)}
				onLongPress={() => onLongPressImage && onLongPressImage(data, data.index)}>
				<ImageComponent
					width={width}
					height={height}
					gutter={gutter}
					source={source}
					imageContainerStyle={imageContainerStyle}
					customImageComponent={customImageComponent}
					customImageProps={customImageProps}
				/>
			</TouchableOpacity>
		);
	}
}
