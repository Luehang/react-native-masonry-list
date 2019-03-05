import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import { resolveImage, resolveLocal } from "./model";
import {
	getItemSource,
	setItemSource,
	getImageSource,
	getImageUri,
	insertIntoColumn
} from "./utils";
import Column from "./Column";

export default class MasonryList extends React.PureComponent {
	_calculatedData = [];

	static propTypes = {
        itemSource: PropTypes.array,
		images: PropTypes.array.isRequired,
		layoutDimensions: PropTypes.object.isRequired,
		containerWidth: PropTypes.number,

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

		customImageComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		customImageProps: PropTypes.object,
		completeCustomComponent: PropTypes.func,

		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,

		onEndReachedThreshold: PropTypes.number,
	};

	state = {
		_sortedData: []
	}

	componentWillMount() {
		if (this.props.containerWidth) {
			this.resolveImages(
				this.props.itemSource,
				this.props.images,
				this.props.layoutDimensions,
				this.props.columns,
				this.props.sorted
			);
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.layoutDimensions.width && nextProps.layoutDimensions.height &&
			nextProps.layoutDimensions.columnWidth && nextProps.layoutDimensions.gutterSize &&
			nextProps.layoutDimensions.width !== this.props.layoutDimensions.width &&
			nextProps.layoutDimensions.height !== this.props.layoutDimensions.height &&
			!this.props.containerWidth) {
				this.resolveImages(
					nextProps.itemSource,
					nextProps.images,
					nextProps.layoutDimensions,
					nextProps.columns,
					nextProps.sorted
				);
		}
		else if (nextProps.orientation !== this.props.orientation ||
			nextProps.columns !== this.props.columns ||
			nextProps.spacing !== this.props.spacing ||
			nextProps.sorted !== this.props.sorted ||
			nextProps.containerWidth !== this.props.containerWidth) {
				this.resolveImages(
					nextProps.itemSource,
					this._calculatedData,
					nextProps.layoutDimensions,
					nextProps.columns,
					nextProps.sorted
				);
		}
		else if (nextProps.images !== this.props.images) {
			this.resolveImages(
				nextProps.itemSource,
				nextProps.images,
				nextProps.layoutDimensions,
				nextProps.columns,
				nextProps.sorted
			);
		}
	}

    _getCalculatedDimensions(imgDimensions = { width: 0, height: 0 }, columnWidth = 0, gutterSize = 0) {
		const countDecimals = function (value) {
			if (Math.floor(value) === value) {
				return 0;
			}
			return value.toString().split(".")[1].length || 0;
		};

		const divider = imgDimensions.width / columnWidth;

		const tempWidth = (imgDimensions.width / divider) - (gutterSize * 1.5);
		const tempHeight = (imgDimensions.height / divider) - (gutterSize * 1.5);

		const newWidth = countDecimals(tempWidth) > 10
			? parseFloat(tempWidth.toFixed(10))
			: tempWidth;
		const newHeight = countDecimals(tempHeight) > 10
			? parseFloat(tempHeight.toFixed(10))
			: tempHeight;

		return { width: newWidth, height: newHeight, gutter: gutterSize, margin: gutterSize / 2 };
	}

	resolveImages(
		itemSource = this.props.itemSource,
		images = this.props.images,
		layoutDimensions = this.props.layoutDimensions,
		columns = this.props.columns,
		sorted = this.props.sorted
	) {
		let unsortedIndex = 0;
		let renderIndex = 0;

		let columnHeightTotals = [];
		let columnCounting = 1;
		let columnHighestHeight = null;
		function _assignColumns(image, nColumns) {
			const columnIndex = columnCounting - 1;
			const { height } = image.masonryDimensions;

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

		if (images && itemSource.length > 0) {
			images
				.map((item) => {
					const image = getItemSource(item, itemSource);
					const source = getImageSource(image);
					const uri = getImageUri(image);

					if (source) {
						image.source = source;
					} else {
						/* eslint-disable no-console */
						console.warn(
							"react-native-masonry-list",
							"Please provide a valid image field in " +
							"data images. Ex. source, uri, URI, url, URL"
						);
						/* eslint-enable no-console */
					}

					if (image.dimensions && image.dimensions.width && image.dimensions.height) {
						return resolveLocal(image, item, itemSource);
					}

					if (image.width && image.height) {
						return resolveLocal(image, item, itemSource);
					}

					if (uri) {
						return resolveImage(uri, image, item, itemSource);
					} else {
						/* eslint-disable no-console */
						console.warn(
							"react-native-masonry-list",
							"Please provide dimensions for your local images."
						);
						/* eslint-enable no-console */
					}
				})
				.map((resolveTask, index) => {
					if (resolveTask && resolveTask.fork) {
						resolveTask.fork(
							// eslint-disable-next-line handle-callback-err, no-console
							(err) => console.warn("react-native-masonry-list", "Image failed to load."),
							(resolvedData) => {
								const resolvedImage = getItemSource(resolvedData, itemSource);
								if (sorted) {
									resolvedData.index = index;
								} else {
									resolvedData.index = unsortedIndex;
									unsortedIndex++;
								}

								resolvedImage.masonryDimensions =
									this._getCalculatedDimensions(
										resolvedImage.dimensions,
										layoutDimensions.columnWidth,
										layoutDimensions.gutterSize
									);

								resolvedData.column = _assignColumns(resolvedImage, columns);

								const finalizedData = setItemSource(resolvedData, itemSource, resolvedImage);

								if (renderIndex !== 0) {
									this.setState(state => {
										const sortedData = insertIntoColumn(finalizedData, state._sortedData, sorted);
										this._calculatedData = this._calculatedData.concat(finalizedData);
										renderIndex++;
										return {
											_sortedData: sortedData
										};
									});
								} else {
									const sortedData = insertIntoColumn(finalizedData, [], sorted);
									this._calculatedData = [finalizedData];
									renderIndex++;
									this.setState({
										_sortedData: sortedData
									});
								}
							}
						);
					}
				});
		} else if (images) {
			images
				.map((image) => {
					const source = getImageSource(image);
					const uri = getImageUri(image);

					if (source) {
						image.source = source;
					} else {
						/* eslint-disable no-console */
						console.warn(
							"react-native-masonry-list",
							"Please provide a valid image field in " +
							"data images. Ex. source, uri, URI, url, URL"
						);
						/* eslint-enable no-console */
					}

					if (image.dimensions && image.dimensions.width && image.dimensions.height) {
						return resolveLocal(image);
					}

					if (image.width && image.height) {
						return resolveLocal(image);
					}

					if (uri) {
						return resolveImage(uri, image);
					} else {
						/* eslint-disable no-console */
						console.warn(
							"react-native-masonry-list",
							"Please provide dimensions for your local images."
						);
						/* eslint-enable no-console */
					}
				})
				.map((resolveTask, index) => {
					if (resolveTask && resolveTask.fork) {
						resolveTask.fork(
							// eslint-disable-next-line handle-callback-err, no-console
							(err) => console.warn("react-native-masonry-list", "Image failed to load."),
							(resolvedImage) => {
								if (sorted) {
									resolvedImage.index = index;
								} else {
									resolvedImage.index = unsortedIndex;
									unsortedIndex++;
								}

								resolvedImage.masonryDimensions =
									this._getCalculatedDimensions(
										resolvedImage.dimensions,
										layoutDimensions.columnWidth,
										layoutDimensions.gutterSize
									);

								resolvedImage.column = _assignColumns(resolvedImage, columns);

								if (renderIndex !== 0) {
									this.setState((state) => {
										const sortedData = insertIntoColumn(resolvedImage, state._sortedData, sorted);
										this._calculatedData = this._calculatedData.concat(resolvedImage);
										renderIndex++;
										return {
											_sortedData: sortedData
										};
									});
								} else {
									const sortedData = insertIntoColumn(resolvedImage, [], sorted);
									this._calculatedData = [resolvedImage];
									renderIndex++;
									this.setState({
										_sortedData: sortedData
									});
								}
							}
						);
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
			<FlatList
				style={{
					flex: 1,
					padding: (this.props.layoutDimensions.width / 100) * this.props.spacing / 2,
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
				keyExtractor={(item, index) => {
					return "COLUMN-" + index.toString() + "/"; // + (this.props.columns - 1);
				}}
				data={this.state._sortedData}
				renderItem={({item, index}) => {
					return (
						<Column
							data={item}
							itemSource={this.props.itemSource}
							initialNumInColsToRender={this.props.initialNumInColsToRender}
							layoutDimensions={this.props.layoutDimensions}
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
		);
	}
}
