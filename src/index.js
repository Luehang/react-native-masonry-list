import { View, FlatList, Dimensions } from "react-native";
import React, { Component } from "react";
import PropTypes from "prop-types";

import { resolveImage, resolveLocal } from "./model";
import Column from "./Column";

export default class Masonry extends Component {
	_batchOne = [];

	static propTypes = {
		images: PropTypes.array.isRequired,
		columns: PropTypes.number,
		spacing: PropTypes.number,
		initialColToRender: PropTypes.number,
		initialNumInColsToRender: PropTypes.number,
		sorted: PropTypes.bool,
		imageContainerStyle: PropTypes.object,
		renderIndividualHeader: PropTypes.func,
		renderIndividualFooter: PropTypes.func,
		masonryFlatListColProps: PropTypes.object,

		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,

		onEndReachedThreshold: PropTypes.number,
	};

	static defaultProps = {
		images: [],
		columns: 2,
		spacing: 1,
		initialColToRender: 2,
		initialNumInColsToRender: 2,
		sorted: false,
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

	componentDidMount() {
		this.resolveImages(this.props.images, this.props.columns);
	}

	resolveImages(images, columns, offSet = 0) {
		const firstRenderNum = this.props.initialColToRender * this.props.initialNumInColsToRender;
		images
			.map((image, index) => assignObjectColumn(columns, index, image))
			.map((image, index) => assignObjectIndex(offSet + index, image))
			.map((image, index) => {
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
			.map((image, index) => {
				const uri = image.source && image.source.uri
					? image.source.uri : image.uri
					? image.uri : image.URI
					? image.URI : image.url
					? image.url : image.URL
					? image.URL : undefined;

				if (image.dimensions && image.dimensions.width && image.dimensions.height) {
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
							if (firstRenderNum > index + 1) {
								const sortedData = _insertIntoColumn(resolvedImage, this._batchOne, this.props.sorted);
								this._batchOne = sortedData;
							}

							if (firstRenderNum === index + 1) {
								const sortedData = _insertIntoColumn(resolvedImage, this._batchOne, this.props.sorted);
								this._batchOne = sortedData;
								this.setState({_sortedData: this._batchOne});
							}

							if (firstRenderNum < index + 1) {
								this.setState(state => {
									const sortedData = _insertIntoColumn(resolvedImage, state._sortedData, this.props.sorted);
									return {
										_sortedData: sortedData
									};
								});
							}
						}
					);
				}
			});
	}

	_setParentDimensions(event) {
		const {width, height} = event.nativeEvent.layout;

		this.setState({
			dimensions: {
				width,
				height
			}
		});
	}

	_onCallEndReach = () => {
		if (this.props.masonryFlatListColProps && this.props.masonryFlatListColProps.onEndReached) {
			this.props.masonryFlatListColProps.onEndReached();
		}
	}

	render() {
		return (
			<View style={{flex: 1}} onLayout={(event) => this._setParentDimensions(event)}>
				<FlatList
					style={{padding: (this.state.dimensions.width / 100) * this.props.spacing / 2, backgroundColor: "#fff"}}
					contentContainerStyle={{
						justifyContent: "space-between",
						flexDirection: "row",
						width: "100%"
					}}
					removeClippedSubviews={true}
					onEndReachedThreshold={this.props.onEndReachedThreshold}
					{...this.props.masonryFlatListColProps}
					onEndReached={this._onCallEndReach}
					initialNumToRender={this.props.initialColToRender}
					keyExtractor={(item, index) => "COLUMN-" + index.toString()}
					data={this.state._sortedData}
					renderItem={({item, index}) => {
						return (
							<Column
								data={item}
								columns={this.props.columns}
								initialNumInColsToRender={this.props.initialNumInColsToRender}
								parentDimensions={this.state.dimensions}
								imageContainerStyle={this.props.imageContainerStyle}
								spacing={this.props.spacing}
								key={`MASONRY-COLUMN-${index}`}

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

// assignObjectColumn :: Number -> [Objects] -> [Objects]
export const assignObjectColumn = (nColumns, index, targetObject) => ({...targetObject, ...{ column: index % nColumns }});

// Assigns an `index` property` from images={data}` for later sorting.
// assignObjectIndex :: (Number, Object) -> Object
export const assignObjectIndex = (index, targetObject) => ({...targetObject, ...{ index }});

// Returns a copy of the dataSet with resolvedImage in correct place
// (resolvedImage, dataSetA, bool) -> dataSetB
export function _insertIntoColumn (resolvedImage, dataSet, sorted) {
	let dataCopy = dataSet.slice();
	const columnIndex = resolvedImage.column;
	const column = dataSet[columnIndex];

	if (column) {
		// Append to existing "row"/"column"
		let images = [...column, resolvedImage];
		if (sorted) {
			// Sort images according to the index of their original array position
			images = images.sort((a, b) => (a.index < b.index) ? -1 : 1);
		}
		dataCopy[columnIndex] = images;
	} else {
		// Pass it as a new "row" for the data source
		dataCopy = [...dataCopy, [resolvedImage]];
	}

	return dataCopy;
}
