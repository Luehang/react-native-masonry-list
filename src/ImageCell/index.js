import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import ImageComponent from "./ImageComponent";
import TouchableImageComponent from "./TouchableImageComponent";
import CustomImageUnit from "./CustomImageUnit";

export default class ImageCell extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object.isRequired,
		source: PropTypes.any.isRequired,
		imageContainerStyle: PropTypes.object,
		masonryDimensions: PropTypes.object,
		customImageComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		customImageProps: PropTypes.object,
		completeCustomComponent: PropTypes.func,
		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,
		renderIndividualHeader: PropTypes.func,
		renderIndividualFooter: PropTypes.func
	}

	_renderImage = () => {
		const {
			data, source, imageContainerStyle, onPressImage,
			onLongPressImage, customImageComponent,
			customImageProps, masonryDimensions
		} = this.props;
		const { width, height, gutter } = masonryDimensions;

		return onPressImage || onLongPressImage
			? <TouchableImageComponent
				data={data}
				width={width}
				height={height}
				gutter={gutter}
				source={source}
				imageContainerStyle={imageContainerStyle}
				customImageComponent={customImageComponent}
				customImageProps={customImageProps}

				onPressImage={onPressImage}
				onLongPressImage={onLongPressImage}
			/>
			: <ImageComponent
				width={width}
				height={height}
				gutter={gutter}
				source={source}
				imageContainerStyle={imageContainerStyle}
				customImageComponent={customImageComponent}
				customImageProps={customImageProps}
			/>;
	}

	_renderCustomImage = () => {
		const {
			data, source, completeCustomComponent, masonryDimensions
		} = this.props;
		const { width, height, gutter } = masonryDimensions;

		return (
			<CustomImageUnit
				data={data}
				width={width}
				height={height}
				gutter={gutter}
				source={source}
				completeCustomComponent={completeCustomComponent}
			/>
		);
	}

	render() {
		const {
			data, renderIndividualHeader,
			renderIndividualFooter,
			completeCustomComponent
		} = this.props;
		const masonryDimensions = {
			width: data.masonryDimensions.width,
			height: data.masonryDimensions.height,
			margin: data.masonryDimensions.gutter / 2
		};

		const renderHeader = renderIndividualHeader &&
			renderIndividualHeader(data, data.index, masonryDimensions);
		const renderFooter = renderIndividualFooter &&
			renderIndividualFooter(data, data.index, masonryDimensions);

		return (
			<View>
				{renderHeader}
				{completeCustomComponent
					? this._renderCustomImage()
					: this._renderImage()}
				{renderFooter}
			</View>
		);
	}
}
