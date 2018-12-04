import React, { Component } from "react";
import {
	View,
	TouchableOpacity,
	Image
} from "react-native";
import PropTypes from "prop-types";

class ImageComponent extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		source: PropTypes.any.isRequired,
		imageContainerStyle: PropTypes.object
	}

	render() {
		const {
			source, data, imageContainerStyle
		} = this.props;
		return (
			<Image
				source={source}
				resizeMethod="auto"
				style={{
					width: data.width,
					height: data.height,
					margin: data.gutter / 2,
					backgroundColor: "lightgrey",
					...imageContainerStyle
				}}
			/>
		);
	}
}

class TouchableImageComponent extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		source: PropTypes.any.isRequired,
		onPressImage: PropTypes.func.isRequired,
		onLongPressImage: PropTypes.func,
		imageContainerStyle: PropTypes.object
	}

	render() {
		const {
			source, data, imageContainerStyle,
			onPressImage, onLongPressImage
		} = this.props;
		return (
			<TouchableOpacity
				onPress={() => onPressImage(data)}
				onLongPress={() => onLongPressImage(data)}>
				<Image
					source={source}
					resizeMode="cover"
					style={{
						width: data.width,
						height: data.height,
						margin: data.gutter / 2,
						backgroundColor: "lightgrey",
						...imageContainerStyle
					}}
				/>
			</TouchableOpacity>
		);
	}
}

export default class ImageCell extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		source: PropTypes.any.isRequired,
		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,
		renderIndividualHeader: PropTypes.func,
		renderIndividualFooter: PropTypes.func,
		imageContainerStyle: PropTypes.object
	}

	render() {
		const {
			data, source, imageContainerStyle, onPressImage,
			onLongPressImage, renderIndividualHeader,
			renderIndividualFooter
		} = this.props;
		const props = {
			data, source, imageContainerStyle
		};
		const renderImage = onPressImage
			? <TouchableImageComponent
				{...props}
				onPressImage={onPressImage}
				onLongPressImage={onLongPressImage}
			/>
			: <ImageComponent
				{...props}
			/>;
		const renderHeader = (renderIndividualHeader)
			? renderIndividualHeader(data)
			: null;
		const renderFooter = (renderIndividualFooter)
			? renderIndividualFooter(data)
			: null;
		return (
			<View>
				{renderHeader}
				{renderImage}
				{renderFooter}
			</View>
		);
	}
}
