import React, { Component } from "react";
import { Platform, View, FlatList, Dimensions } from "react-native";
import PropTypes from "prop-types";

import { resolveImage, resolveLocal } from "./model";
import Column from "./Column";

export default class MasonryList extends Component {
	_mounted = false;

	static propTypes = {
		images: PropTypes.array.isRequired,
		columns: PropTypes.number,
		spacing: PropTypes.number,
		initialColToRender: PropTypes.number,
		initialNumInColsToRender: PropTypes.number,
		sorted: PropTypes.bool,
		backgroundColor: PropTypes.string,
		imageContainerStyle: PropTypes.object,
		renderIndividualHeader: PropTypes.func,
		renderIndividualFooter: PropTypes.func,
		masonryFlatListColProps: PropTypes.object,

		customImageComponent: PropTypes.object,
		customImageProps: PropTypes.object,
		completeCustomComponent: PropTypes.func,

		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,

		onEndReachedThreshold: PropTypes.number,
	};

	static defaultProps = {
		images: [],
		columns: 2,
		initialColToRender: Platform.OS === "ios" ? 2 : null,
		initialNumInColsToRender: 1,
		spacing: 1,
		sorted: false,
		backgroundColor: "#fff",
		imageContainerStyle: {},
		onEndReachedThreshold: 25
	};

	constructor(props) {
		super(props);
		this.state = {
			dimensions: {},
			initialOrientation: true,
			_sortedData: []
		};
		// Assuming that rotation is binary (vertical|landscape)
		Dimensions.addEventListener("change", (window) => this.setState(state => ({ initialOrientation: !state.initialOrientation })));
	}

	componentWillMount() {
		this._mounted = true;
		this.resolveImages(this.props.images, this.props.columns);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	resolveImages(images, columns, offSet = 0) {
		const firstRenderNum = this.props.initialColToRender * this.props.initialNumInColsToRender;
		let unsortedIndex = 0;
		let renderIndex = 0;
		let batchOne = [];

		let columnHeightTotals = [];
		let columnCounting = 1;
		let columnHighestHeight = null;
		function _assignColumns(image, nColumns) {
			const columnIndex = columnCounting - 1;
			const { height } = image.dimensions;

			if (!columnHeightTotals[columnCounting - 1]) {
				columnHeightTotals[columnCounting - 1] = height;
			} else {
				columnHeightTotals[columnCounting - 1] = columnHeightTotals[columnCounting - 1] + height;
			}

			if (!columnHighestHeight) {
				columnHighestHeight = columnHeightTotals[columnCounting - 1];
				columnCounting = columnCounting < nColumns ? columnCounting + 1 : 1;
			} else if (columnHighestHeight <= columnHeightTotals[columnCounting - 1]) {
				columnHighestHeight = columnHeightTotals[columnCounting - 1];
				columnCounting = columnCounting < nColumns ? columnCounting + 1 : 1;
			}

			return columnIndex;
		}

		images
			.map((image) => {
				const source = image.source
					? image.source : image.uri
					? { uri: image.uri } : image.URI
					? { uri: image.URI } : image.url
					? { uri: image.url } : image.URL
					? { uri: image.URL } : undefined;

				if (source) {
					image.source = source;
				} else {
					// eslint-disable-next-line no-console
					console.warn(
						"react-native-masonry-list",
						"Please provide a valid image field in " +
						"data images. Ex. source, uri, URI, url, URL"
					);
				}

				return image;
			})
			.map((image) => {
				const uri = image.source && image.source.uri
					? image.source.uri : image.uri
					? image.uri : image.URI
					? image.URI : image.url
					? image.url : image.URL
					? image.URL : undefined;

				if (image.dimensions && image.dimensions.width && image.dimensions.height) {
					return resolveLocal(image);
				}

				if (image.width && image.height) {
					return resolveLocal(image);
				}

				if (uri) {
					return resolveImage(image);
				} else {
					// eslint-disable-next-line no-console
					console.warn(
						"react-native-masonry-list",
						"Please provide dimensions for your local images."
					);
				}
			})
			.map((resolveTask, index) => {
				if (resolveTask && resolveTask.fork) {
					resolveTask.fork(
						// eslint-disable-next-line handle-callback-err, no-console
						(err) => console.warn("react-native-masonry-list", "Image failed to load."),
						(resolvedImage) => {
							if (this.props.sorted) {
								resolvedImage.index = index;
							} else {
								resolvedImage.index = unsortedIndex;
								unsortedIndex++;
							}

							resolvedImage.column = _assignColumns(resolvedImage, columns);

							if (firstRenderNum - 1 > renderIndex) {
								const sortedData = _insertIntoColumn(resolvedImage, batchOne, this.props.sorted);
								batchOne = sortedData;
								renderIndex++;
							}
							else if (firstRenderNum - 1 === renderIndex) {
								const sortedData = _insertIntoColumn(resolvedImage, batchOne, this.props.sorted);
								batchOne = sortedData;
								this.setState({_sortedData: batchOne});
								renderIndex++;
							}
							else if (firstRenderNum - 1 <= renderIndex) {
								this.setState(state => {
									const sortedData = _insertIntoColumn(resolvedImage, state._sortedData, this.props.sorted);
									return {
										_sortedData: sortedData
									};
								});
								renderIndex++;
							}
						}
					);
				}
			});
	}

	_setParentDimensions(event) {
		const {width, height} = event.nativeEvent.layout;

		if (this._mounted) {
			this.setState({
				dimensions: {
					width,
					height
				}
			});
		}
	}

	_onCallEndReach = () => {
		this.props.masonryFlatListColProps &&
		this.props.masonryFlatListColProps.onEndReached &&
			this.props.masonryFlatListColProps.onEndReached();
	}

	render() {
		return (
			<View style={{flex: 1}} onLayout={(event) => this._setParentDimensions(event)}>
				<FlatList
					style={{
						padding: (this.state.dimensions.width / 100) * this.props.spacing / 2,
						backgroundColor: this.props.backgroundColor
					}}
					contentContainerStyle={{
						justifyContent: "space-between",
						flexDirection: "row",
						width: "100%"
					}}
					removeClippedSubviews={true}
					onEndReachedThreshold={this.props.onEndReachedThreshold}
					{...this.props.masonryFlatListColProps}
					onEndReached={this._onCallEndReach}
					initialNumToRender={
						this.props.initialColToRender
							? this.props.initialColToRender
							: this.props.columns
					}
					keyExtractor={(item, index) => "COLUMN-" + index.toString()}
					data={this.state._sortedData}
					renderItem={({item, index}) => {
						return (
							<Column
								data={item}
								columns={this.props.columns}
								initialNumInColsToRender={this.props.initialNumInColsToRender}
								parentDimensions={this.state.dimensions}
								backgroundColor={this.props.backgroundColor}
								imageContainerStyle={this.props.imageContainerStyle}
								spacing={this.props.spacing}
								key={`MASONRY-COLUMN-${index}`}

								customImageComponent={this.props.customImageComponent}
								customImageProps={this.props.customImageProps}
								completeCustomComponent={this.props.completeCustomComponent}

								onPressImage={this.props.onPressImage}
								onLongPressImage={this.props.onLongPressImage}

								renderIndividualHeader={this.props.renderIndividualHeader}
								renderIndividualFooter={this.props.renderIndividualFooter}
							/>
						);
					}}
				/>
			</View>
		);
	}
}

export function _insertIntoColumn (resolvedImage, dataSet, sorted) {
	let dataCopy = dataSet.slice();
	const columnIndex = resolvedImage.column;
	const column = dataSet[columnIndex];

	if (column) {
		let images = [...column, resolvedImage];
		if (sorted) {
			images = images.sort((a, b) => (a.index < b.index) ? -1 : 1);
		}
		dataCopy[columnIndex] = images;
	} else {
		dataCopy = [...dataCopy, [resolvedImage]];
	}

	return dataCopy;
}
