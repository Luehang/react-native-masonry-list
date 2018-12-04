import React, { Component } from "react";
import {
	TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ImageComponent from "./ImageComponent";

export default class TouchableImageComponent extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		source: PropTypes.any.isRequired,
		imageContainerStyle: PropTypes.object,
		customImageComponent: PropTypes.object,
		customImageProps: PropTypes.object,
		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func
	}

	render() {
		const {
			data, source, imageContainerStyle, onPressImage,
			onLongPressImage, customImageComponent,
			customImageProps
		} = this.props;
		return (
			<TouchableOpacity
				onPress={() => onPressImage(data)}
				onLongPress={() => onLongPressImage(data)}>
				<ImageComponent
					width={data.width}
					height={data.height}
					gutter={data.gutter}
					source={source}
					imageContainerStyle={imageContainerStyle}
					customImageComponent={customImageComponent}
					customImageProps={customImageProps}
				/>
			</TouchableOpacity>
		);
	}
}
