import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import { getItemSource } from "./utils";
import ImageCell from "./ImageCell";

export default class Column extends React.PureComponent {
	static propTypes = {
		itemSource: PropTypes.array,
		data: PropTypes.array,
		initialNumInColsToRender: PropTypes.number,
		layoutDimensions: PropTypes.object.isRequired,
		columnKey: PropTypes.string,
		backgroundColor: PropTypes.string,
		imageContainerStyle: PropTypes.object,
		spacing: PropTypes.number,

		customImageComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		customImageProps: PropTypes.object,
		completeCustomComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),
		colIndex: PropTypes.number,

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
	};

	_renderItem = ({item, index}) => {
		// Example Data Structure
		// const itemDataStructure = {
		// 		column: 0,
		// 		dimensions: {
		// 			width: 1080,
		// 			height: 1920
		// 		},
		// 		index: 20,
		// 		masonryDimensions: {
		// 			width: 185.625,
		// 			height: 330,
		// 			gutter: 3.75
		// 		},
		// 		source: {},
		// 		uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg",
		// };
		const {
			renderIndividualHeader, renderIndividualFooter,
			imageContainerStyle, onPressImage, onLongPressImage,
			customImageComponent, customImageProps,
			completeCustomComponent, itemSource
		} = this.props;
		const props = {
			renderIndividualHeader, renderIndividualFooter,
			imageContainerStyle
		};

		const image = itemSource.length > 0
			? getItemSource(item, itemSource)
			: item;

		return (
			<ImageCell
				{...props}

				key={image.uri}
				data={item}
				source={image.source}
				masonryDimensions={image.masonryDimensions}
				customImageComponent={customImageComponent}
				customImageProps={customImageProps}
				completeCustomComponent={completeCustomComponent}
				onPressImage={onPressImage}
				onLongPressImage={onLongPressImage}
			/>
		);
	}

	_keyExtractor = (item, index, colIndex) => {
		return "IMAGE-CELL-" + index.toString() + "---" + (item.id ? item.id : colIndex);
	}

	render() {
		return (
			<FlatList
				style={{flex: 1}}
				contentContainerStyle={{
					width: this.props.layoutDimensions.columnWidth,
					overflow: "hidden",
					backgroundColor: this.props.backgroundColor,
				}}
				key={this.props.colIndex}
				data={this.props.data}
				keyExtractor={(item, index) => {
					return this._keyExtractor(item, index, this.props.colIndex);
				}}
				initialNumToRender={this.props.initialNumInColsToRender}
				removeClippedSubviews={true}
				renderItem={this._renderItem}
			/>
		);
	}
}
