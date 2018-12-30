import React, { PureComponent } from "react";
import { View, FlatList } from "react-native";
import PropTypes from "prop-types";

import ImageCell from "./ImageCell";

export default class Column extends PureComponent {
	static propTypes = {
		data: PropTypes.array,
		columns: PropTypes.number,
		initialNumInColsToRender: PropTypes.number,
		parentDimensions: PropTypes.object,
		columnKey: PropTypes.string,
		backgroundColor: PropTypes.string,
		imageContainerStyle: PropTypes.object,
		spacing: PropTypes.number,

		customImageComponent: PropTypes.object,
		customImageProps: PropTypes.object,
		completeCustomComponent: PropTypes.func,

		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,

		renderIndividualHeader: PropTypes.func,
		renderIndividualFooter: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.state = {
			images: [],
			columnWidth: 0
		};
	}

	componentWillMount() {
		this.setState({
			images: this._resizeImages(this.props.data, this.props.parentDimensions, this.props.columns)
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			images: this._resizeImages(nextProps.data, nextProps.parentDimensions, nextProps.columns)
		});
	}

	_resizeImages (data, parentDimensions, nColumns) {
		return Object.keys(data).map((key) => {
			const image = data[key];
			const imageSizedForColumn =
				this._resizeByColumns(data[key].dimensions, parentDimensions, nColumns);
			return {
				...image,
				...imageSizedForColumn
			};
		});
	}

	_resizeByColumns (imgDimensions = { width: 0, height: 0 }, parentDimensions, nColumns = 2) {
		const {
			// height,
			width
		} = parentDimensions;

		// The gutter is 1% of the available view width
		const gutterBase = width / 100;
		const gutterSize = gutterBase * this.props.spacing;

		// Column gutters are shared between right and left image
		const columnWidth = (width / nColumns) - (gutterSize / 2);

		if (this.state.columnWidth !== columnWidth) {
			this.setState({
				columnWidth
			});
		}

		const divider = imgDimensions.width / columnWidth;

		const newWidth = imgDimensions.width / divider;
		const newHeight = imgDimensions.height / divider;

		return { masonryDimensions: { width: newWidth, height: newHeight, gutter: gutterSize } };
	}

	_renderBrick = ({item, index}) => {
		// Example Data Structure
		// {
		//   "item": {
		//     "uri": "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg",
		//     "source": {},
		//     "column": 0,
		//     "dimensions": {
		//       "width": 625,
		//       "height": 415
		//     },
		//     "width": 180.675,
		//     "height": 119.96820000000001,
		//     "gutter": 3.65
		//   },
		//   "index": 9
		// }
		const {
			renderIndividualHeader, renderIndividualFooter,
			imageContainerStyle, onPressImage, onLongPressImage,
			customImageComponent, customImageProps,
			completeCustomComponent
		} = this.props;
		const props = {
			renderIndividualHeader, renderIndividualFooter,
			imageContainerStyle
		};

		return (
			<ImageCell
				{...props}

				key={item.uri}
				data={item}
				source={item.source}
				customImageComponent={customImageComponent}
				customImageProps={customImageProps}
				completeCustomComponent={completeCustomComponent}
				onPressImage={onPressImage}
				onLongPressImage={onLongPressImage}
			/>
		);
	}

	_keyExtractor = (item, index) => ("IMAGE-CELL-" + index.toString() + "---" + (item.id ? item.id : "0"));

	render() {
		return (
			<View
				style={{
					width: this.state.columnWidth,
					overflow: "hidden",
					flex: 1,
					backgroundColor: this.props.backgroundColor,
					flexDirection: "column"
				}}>
				<FlatList
					key={this.props.columnKey}
					data={this.state.images}
					keyExtractor={this._keyExtractor}
					initialNumToRender={this.props.initialNumInColsToRender}
					removeClippedSubviews={true}
					renderItem={this._renderBrick}
				/>
			</View>
		);
	}
}
