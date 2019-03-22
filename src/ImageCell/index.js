import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import ImageComponent from "./ImageComponent";
import TouchableImageComponent from "./TouchableImageComponent";
import CustomImageUnit from "./CustomImageUnit";
import {
    isReactComponent,
    isElement
} from "./../utils";

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
		completeCustomComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),
		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,
		renderIndividualHeader: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),
		renderIndividualFooter: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),
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

		let renderHeader = null;
		let renderFooter = null;

		if (renderIndividualHeader) {
			if (isReactComponent(renderIndividualHeader)) {
				renderHeader = React.createElement(renderIndividualHeader, {
					data: data,
					index: data.index
				});
			}
			else if (typeof renderIndividualHeader === "function") {
				renderHeader = renderIndividualHeader(data, data.index);
			}
			else if (isElement(renderIndividualHeader)) {
				renderHeader = renderIndividualHeader;
			}
		}

		if (renderIndividualFooter) {
			if (isReactComponent(renderIndividualFooter)) {
				renderFooter = React.createElement(renderIndividualFooter, {
					data: data,
					index: data.index
				});
			}
			else if (typeof renderIndividualFooter === "function") {
				renderFooter = renderIndividualFooter(data, data.index);
			}
			else if (isElement(renderIndividualFooter)) {
				renderFooter = renderIndividualFooter;
			}
		}

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
