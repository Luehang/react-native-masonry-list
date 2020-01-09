import React from "react";
import { FlatList, InteractionManager } from "react-native";
import PropTypes from "prop-types";

import { resolveImage, resolveLocal } from "./lib/model";
import Task from "./lib/task";
import { sequence } from "./lib/monad-basic";

import Column from "./Column";

import {
	getItemSource,
	setItemSource,
	getImageSource,
	getImageUri,
	insertIntoColumn
} from "./utils";

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
		listContainerStyle: PropTypes.object,
		renderIndividualHeader: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),
		renderIndividualFooter: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),
		masonryFlatListColProps: PropTypes.object,
		rerender: PropTypes.bool,

		customImageComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),
		customImageProps: PropTypes.object,
		completeCustomComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node
		]),

		onImageResolved: PropTypes.func,
		onImagesResolveEnd: PropTypes.func,

		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,

		onEndReached: PropTypes.func,
		onEndReachedThreshold: PropTypes.number,
        refreshing: PropTypes.bool,
        onRefresh: PropTypes.func
	};

	state = {
		_sortedData: []
	}

	doneTotal = 0;
	unsortedIndex = 0;
	renderIndex = 0;

	columnHeightTotals = [];
	columnCounting = 1;
	columnHighestHeight = null;

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			if (this.props.containerWidth) {
				this.resolveImages(
					this.props.itemSource,
					this.props.images,
					this.props.layoutDimensions,
					this.props.columns,
					this.props.sorted
				);
			}
		});
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		if (nextProps.layoutDimensions.width && nextProps.layoutDimensions.height &&
			nextProps.layoutDimensions.columnWidth && nextProps.layoutDimensions.gutterSize &&
			nextProps.layoutDimensions.width !== this.props.layoutDimensions.width &&
			nextProps.layoutDimensions.height !== this.props.layoutDimensions.height &&
			!this.props.containerWidth) {
				this.unsortedIndex = 0;
				this.renderIndex = 0;
				this.columnHeightTotals = [];
				this.columnCounting = 1;
				this.columnHighestHeight = null;
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
				this.unsortedIndex = 0;
				this.renderIndex = 0;
				this.columnHeightTotals = [];
				this.columnCounting = 1;
				this.columnHighestHeight = null;
				this.resolveImages(
					nextProps.itemSource,
					this._calculatedData,
					nextProps.layoutDimensions,
					nextProps.columns,
					nextProps.sorted
				);
		}
		// else if (nextProps.images !== this.props.images) {
		// 	this.unsortedIndex = 0;
		// 	this.renderIndex = 0;
		// 	this.columnHeightTotals = [];
		// 	this.columnCounting = 1;
		// 	this.columnHighestHeight = null;
		// 	this.resolveImages(
		// 		nextProps.itemSource,
		// 		nextProps.images,
		// 		nextProps.layoutDimensions,
		// 		nextProps.columns,
		// 		nextProps.sorted
		// 	);
		// }

		if (!this.props.rerender) {
			// load more add datasource
			if (nextProps.images.length > this.props.images.length) {
				let newImages = nextProps.images.concat().splice(this.props.images.length, nextProps.images.length); // nextProps.images
				this.resolveImages(
					nextProps.itemSource,
					newImages,
					nextProps.layoutDimensions,
					nextProps.columns,
					nextProps.sorted
				);
			}

			// pull refresh reset datasource
			if (nextProps.images.length < this.props.images.length) {
					this.unsortedIndex = 0;
					this.renderIndex = 0;
					this.columnHeightTotals = [];
					this.columnCounting = 1;
					this.columnHighestHeight = null;
				// this.renderIndex = 0;
				this.resolveImages(
					nextProps.itemSource,
					nextProps.images,
					nextProps.layoutDimensions,
					nextProps.columns,
					nextProps.sorted
				);
			}
		} else {
			if (nextProps.images !== this.props.images) {
				this.unsortedIndex = 0;
				this.renderIndex = 0;
				this.columnHeightTotals = [];
				this.columnCounting = 1;
				this.columnHighestHeight = null;
				this.resolveImages(
					nextProps.itemSource,
					nextProps.images,
					nextProps.layoutDimensions,
					nextProps.columns,
					nextProps.sorted
				);
			}
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

		const tempWidth = (imgDimensions.width / divider) - (gutterSize * 1.5) || 0;
		const tempHeight = (imgDimensions.height / divider) - (gutterSize * 1.5) || 0;

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
		// eslint-disable-next-line consistent-this
		let resolverObj = this;
		function _assignColumns(image, nColumns) {
			const columnIndex = resolverObj.columnCounting - 1;
			const { height } = image.masonryDimensions;

			if (!resolverObj.columnHeightTotals[resolverObj.columnCounting - 1]) {
				resolverObj.columnHeightTotals[resolverObj.columnCounting - 1] = height;
			} else {
				resolverObj.columnHeightTotals[resolverObj.columnCounting - 1] = resolverObj.columnHeightTotals[resolverObj.columnCounting - 1] + height;
			}

			if (!resolverObj.columnHighestHeight) {
				resolverObj.columnHighestHeight = resolverObj.columnHeightTotals[resolverObj.columnCounting - 1];
				resolverObj.columnCounting = resolverObj.columnCounting < nColumns ? resolverObj.columnCounting + 1 : 1;
			} else if (resolverObj.columnHighestHeight <= resolverObj.columnHeightTotals[resolverObj.columnCounting - 1]) {
				resolverObj.columnHighestHeight = resolverObj.columnHeightTotals[resolverObj.columnCounting - 1];
				resolverObj.columnCounting = resolverObj.columnCounting < nColumns ? resolverObj.columnCounting + 1 : 1;
			}

			return columnIndex;
		}

		if (images && itemSource.length > 0) {
			const resolveImages = images
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
				});
			if (sorted) {
				sequence(Task, resolveImages.map((resolveTask) => {
					if (resolveTask && resolveTask.fork) {
						return resolveTask;
					}
				})).fork(
					(err) => {
						// eslint-disable-next-line handle-callback-err, no-console
						console.warn("react-native-masonry-list", "Image failed to load.", err);

						this.doneTotal++;
						if (
							this.props.onImagesResolveEnd &&
							this.doneTotal === this.props.images.length
						) {
							this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
						}
					},
					(resolvedImages) => {
						resolvedImages.map((resolvedData, index) => {
							const resolvedImage = getItemSource(resolvedData, itemSource);
							if (this.renderIndex !== 0) {
								index = this.renderIndex;
							}
							resolvedData.index = index;

							resolvedImage.masonryDimensions =
								this._getCalculatedDimensions(
									resolvedImage.dimensions,
									layoutDimensions.columnWidth,
									layoutDimensions.gutterSize
								);

							resolvedData.column = _assignColumns(resolvedImage, columns);

							let finalizedData = setItemSource(resolvedData, itemSource, resolvedImage);

							if (this.props.onImageResolved) {
								finalizedData = this.props.onImageResolved(finalizedData, this.renderIndex) || finalizedData;
							}

							if (this.renderIndex !== 0) {
								this.setState(state => {
									const sortedData = insertIntoColumn(finalizedData, state._sortedData, sorted);
									this._calculatedData = this._calculatedData.concat(finalizedData);
									this.renderIndex++;
									return {
										_sortedData: sortedData
									};
								});
							} else {
								const sortedData = insertIntoColumn(finalizedData, [], sorted);
								this._calculatedData = [finalizedData];
								this.renderIndex++;
								this.setState({
									_sortedData: sortedData
								});
							}

							this.doneTotal++;
							if (
								this.props.onImagesResolveEnd &&
								this.doneTotal === this.props.images.length
							) {
								this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
							}
						});
					});
			} else {
				resolveImages.map((resolveTask) => {
					if (resolveTask && resolveTask.fork) {
						return resolveTask.fork(
							(err) => {
								// eslint-disable-next-line handle-callback-err, no-console
								console.warn("react-native-masonry-list", "Image failed to load.", err);

								this.doneTotal++;
								if (
									this.props.onImagesResolveEnd &&
									this.doneTotal === this.props.images.length
								) {
									this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
								}
							},
							(resolvedData) => {
								const resolvedImage = getItemSource(resolvedData, itemSource);

								resolvedImage.index = this.unsortedIndex;
								this.unsortedIndex++;

								resolvedImage.masonryDimensions =
									this._getCalculatedDimensions(
										resolvedImage.dimensions,
										layoutDimensions.columnWidth,
										layoutDimensions.gutterSize
									);

								resolvedData.column = _assignColumns(resolvedImage, columns);

								let finalizedData = setItemSource(resolvedData, itemSource, resolvedImage);

								if (this.props.onImageResolved) {
									finalizedData = this.props.onImageResolved(finalizedData, this.renderIndex) || finalizedData;
								}

								if (this.renderIndex !== 0) {
									this.setState(state => {
										const sortedData = insertIntoColumn(finalizedData, state._sortedData, sorted);
										this._calculatedData = this._calculatedData.concat(finalizedData);
										this.renderIndex++;
										return {
											_sortedData: sortedData
										};
									});
								} else {
									const sortedData = insertIntoColumn(finalizedData, [], sorted);
									this._calculatedData = [finalizedData];
									this.renderIndex++;
									this.setState({
										_sortedData: sortedData
									});
								}

								this.doneTotal++;
								if (
									this.props.onImagesResolveEnd &&
									this.doneTotal === this.props.images.length
								) {
									this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
								}
							});
					}
				});
			}

		} else if (images) {
			const resolveImages = images
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
				});
			if (sorted) {
				sequence(Task, resolveImages.map((resolveTask) => {
					if (resolveTask && resolveTask.fork) {
						return resolveTask;
					}
				})).fork(
					(err) => {
						// eslint-disable-next-line handle-callback-err, no-console
						console.warn("react-native-masonry-list", "Image failed to load.", err);

						this.doneTotal++;
						if (
							this.props.onImagesResolveEnd &&
							this.doneTotal === this.props.images.length
						) {
							this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
						}
					},
					(resolvedImages) => {
						resolvedImages.map((resolvedImage, index) => {
							if (this.renderIndex !== 0) {
								index = this.renderIndex;
							}
							resolvedImage.index = index;

							resolvedImage.masonryDimensions =
								this._getCalculatedDimensions(
									resolvedImage.dimensions,
									layoutDimensions.columnWidth,
									layoutDimensions.gutterSize
								);

							resolvedImage.column = _assignColumns(resolvedImage, columns);

							if (this.props.onImageResolved) {
								resolvedImage = this.props.onImageResolved(resolvedImage, this.renderIndex) || resolvedImage;
							}

							if (this.renderIndex !== 0) {
								this.setState((state) => {
									const sortedData = insertIntoColumn(resolvedImage, state._sortedData, sorted);
									this._calculatedData = this._calculatedData.concat(resolvedImage);
									this.renderIndex++;
									return {
										_sortedData: sortedData
									};
								});
							} else {
								const sortedData = insertIntoColumn(resolvedImage, [], sorted);
								this._calculatedData = [resolvedImage];
								this.renderIndex++;
								this.setState({
									_sortedData: sortedData
								});
							}

							this.doneTotal++;
							if (
								this.props.onImagesResolveEnd &&
								this.doneTotal === this.props.images.length
							) {
								this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
							}
						});
					});
			} else {
				resolveImages.map((resolveTask) => {
					if (resolveTask && resolveTask.fork) {
						resolveTask.fork(
							(err) => {
								// eslint-disable-next-line handle-callback-err, no-console
								console.warn("react-native-masonry-list", "Image failed to load.", err);

								this.doneTotal++;
								if (
									this.props.onImagesResolveEnd &&
									this.doneTotal === this.props.images.length
								) {
									this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
								}
							},
							(resolvedImage) => {
								resolvedImage.index = this.unsortedIndex;
								this.unsortedIndex++;

								resolvedImage.masonryDimensions =
									this._getCalculatedDimensions(
										resolvedImage.dimensions,
										layoutDimensions.columnWidth,
										layoutDimensions.gutterSize
									);

								resolvedImage.column = _assignColumns(resolvedImage, columns);

								if (this.props.onImageResolved) {
									resolvedImage = this.props.onImageResolved(resolvedImage, this.renderIndex) || resolvedImage;
								}

								if (this.renderIndex !== 0) {
									this.setState((state) => {
										const sortedData = insertIntoColumn(resolvedImage, state._sortedData, sorted);
										this._calculatedData = this._calculatedData.concat(resolvedImage);
										this.renderIndex++;
										return {
											_sortedData: sortedData
										};
									});
								} else {
									const sortedData = insertIntoColumn(resolvedImage, [], sorted);
									this._calculatedData = [resolvedImage];
									this.renderIndex++;
									this.setState({
										_sortedData: sortedData
									});
								}

								this.doneTotal++;
								if (
									this.props.onImagesResolveEnd &&
									this.doneTotal === this.props.images.length
								) {
									this.props.onImagesResolveEnd(this.state._sortedData, this.doneTotal);
								}
							});
					}
				});
			}
		}
	}

	// (info: {distanceFromEnd: number}) => void
	_onCallEndReach = (info) => {
		if (this.props.masonryFlatListColProps &&
			this.props.masonryFlatListColProps.onEndReached) {
			this.props.masonryFlatListColProps.onEndReached(info);
		} else if (this.props.onEndReached) {
			this.props.onEndReached(info);
		}
	}

	render() {
		return (
			<FlatList
				style={{
					flex: 1,
					padding: (this.props.layoutDimensions.width / 100) * this.props.spacing / 2,
					backgroundColor: this.props.backgroundColor
				}}
				contentContainerStyle={[{
					flexDirection: "row",
					width: "100%"
				}, this.props.listContainerStyle]}
				removeClippedSubviews={true}
				onEndReachedThreshold={this.props.onEndReachedThreshold}
				refreshing={this.props.refreshing}
				onRefresh={this.props.onRefresh}
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
				renderItem={({ item, index }) => {
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
							colIndex={index}

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
