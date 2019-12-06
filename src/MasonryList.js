import React, {useRef, useState, useEffect} from "react";
import { FlatList, InteractionManager } from "react-native";
import PropTypes from 'prop-types';

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


export const MasonryList = (props) => {
	const sortedDataRef = useRef([])
	const [sortedData, setSortedData] = useState([])
	const _calculatedData = useRef([]);
	const unsortedIndex = useRef(0);
	const renderIndex = useRef(0);
	const columnHeightTotals = useRef([]);
	const columnCounting = useRef(1);
	const columnHighestHeight = useRef(null);

	const setInitialRefState = () => {
		unsortedIndex.current = 0;
		renderIndex.current = 0;
		columnHeightTotals.current = [];
		columnCounting.current = 1;
		columnHighestHeight.current = null;
	}
	
	useEffect(()=>{
		InteractionManager.runAfterInteractions(() => {
			if (props.containerWidth) {
				resolveImages(
					props.itemSource,
					props.images,
					props.layoutDimensions,
					props.columns,
					props.sorted
				);
			}
		});
	}, [])

	const [oldStateObj, setOldStateObj] = useState({
		layoutDimensions: {
			width: 0,
			height: 0
		},
		containerWidth: 0,
		orientation: '',
		columns: 1,
		spacing: 1,
		sorted: false,
		rerender: false,
		images: []
	})

	useEffect(()=>{
		if (props.layoutDimensions.width && props.layoutDimensions.height &&
			props.layoutDimensions.columnWidth && props.layoutDimensions.gutterSize &&
			props.layoutDimensions.width !== oldStateObj.layoutDimensions.width &&
			props.layoutDimensions.height !== oldStateObj.layoutDimensions.height &&
			!oldStateObj.containerWidth) {
				setInitialRefState()
				resolveImages(
					props.itemSource,
					props.images,
					props.layoutDimensions,
					props.columns,
					props.sorted
				);
		}
		else if (props.orientation !== oldStateObj.orientation ||
			props.columns !== oldStateObj.columns ||
			props.spacing !== oldStateObj.spacing ||
			props.sorted !== oldStateObj.sorted ||
			props.containerWidth !== oldStateObj.containerWidth) {
				setInitialRefState()
				resolveImages(
					props.itemSource,
					_calculatedData.current,
					props.layoutDimensions,
					props.columns,
					props.sorted
				);
		}

		if (!oldStateObj.rerender) {
			// load more add datasource
			if (props.images.length > oldStateObj.images.length) {
				let newImages = props.images.concat().splice(oldStateObj.images.length, props.images.length); // props.images
				resolveImages(
					props.itemSource,
					newImages,
					props.layoutDimensions,
					props.columns,
					props.sorted
				);
			}

			// pull refresh reset datasource
			if (props.images.length < oldStateObj.images.length) {
				setInitialRefState()
				resolveImages(
					props.itemSource,
					props.images,
					props.layoutDimensions,
					props.columns,
					props.sorted
				);
			}
		} else {
			if (props.images !== oldStateObj.images) {
				setInitialRefState()
				resolveImages(
					props.itemSource,
					props.images,
					props.layoutDimensions,
					props.columns,
					props.sorted
				);
			}
		}
		setOldStateObj({
			layoutDimensions: props.layoutDimensions,
			containerWidth: props.containerWidth,
			orientation: props.orientation,
			columns: props.columns,
			spacing: props.spacing,
			sorted: props.sorted,
			rerender: props.rerender,
			images: props.images
		})

	}, [
		props.layoutDimensions,
		props.containerWidth,
		props.orientation,
		props.columns,
		props.spacing,
		props.sorted,
		props.rerender,
		props.images,
	])

	function _getCalculatedDimensions(imgDimensions = { width: 0, height: 0 }, columnWidth = 0, gutterSize = 0) {
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

	function resolveImages(
		itemSource = props.itemSource,
		images = props.images,
		layoutDimensions = props.layoutDimensions,
		columns = props.columns,
		sorted = props.sorted
	) {
		function _assignColumns(image, nColumns) {
			const columnIndex = columnCounting.current - 1;
			const { height } = image.masonryDimensions;

			if (!columnHeightTotals.current[columnCounting.current - 1]) {
				columnHeightTotals.current[columnCounting.current - 1] = height;
			} else {
				columnHeightTotals.current[columnCounting.current - 1] = columnHeightTotals.current[columnCounting.current - 1] + height;
			}

			if (!columnHighestHeight.current) {
				columnHighestHeight.current = columnHeightTotals.current[columnCounting.current - 1];
				columnCounting.current = columnCounting.current < nColumns ? columnCounting.current + 1 : 1;
			} else if (columnHighestHeight.current <= columnHeightTotals.current[columnCounting.current - 1]) {
				columnHighestHeight.current = columnHeightTotals.current[columnCounting.current - 1];
				columnCounting.current = columnCounting.current < nColumns ? columnCounting.current + 1 : 1;
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
					},
					(resolvedImages) => {
						resolvedImages.map((resolvedData, index) => {
							const resolvedImage = getItemSource(resolvedData, itemSource);
							if (renderIndex.current !== 0) {
								index = renderIndex.current;
							}
							resolvedData.index = index;

							resolvedImage.masonryDimensions =
								_getCalculatedDimensions(
									resolvedImage.dimensions,
									layoutDimensions.columnWidth,
									layoutDimensions.gutterSize
								);

							resolvedData.column = _assignColumns(resolvedImage, columns);

							let finalizedData = setItemSource(resolvedData, itemSource, resolvedImage);

							if (props.onImageResolved) {
								finalizedData = props.onImageResolved(finalizedData, renderIndex.current) || finalizedData;
							}

							if (renderIndex.current !== 0) {
								newSortedData = insertIntoColumn(finalizedData, sortedDataRef.current, sorted);
								_calculatedData.current = _calculatedData.current.concat(finalizedData);
								renderIndex.current++;
								sortedDataRef.current = newSortedData;
                				setSortedData(newSortedData) 
								
							} else {
								newSortedData = insertIntoColumn(finalizedData, [], sorted);
								_calculatedData.current = [finalizedData];
								renderIndex.current++;
								sortedDataRef.current = newSortedData;
								setSortedData(newSortedData)
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
							},
							(resolvedData) => {
								const resolvedImage = getItemSource(resolvedData, itemSource);

								resolvedImage.index = unsortedIndex.current;
								unsortedIndex.current++;

								resolvedImage.masonryDimensions =
									_getCalculatedDimensions(
										resolvedImage.dimensions,
										layoutDimensions.columnWidth,
										layoutDimensions.gutterSize
									);

								resolvedData.column = _assignColumns(resolvedImage, columns);

								let finalizedData = setItemSource(resolvedData, itemSource, resolvedImage);

								if (props.onImageResolved) {
									finalizedData = props.onImageResolved(finalizedData, renderIndex.current) || finalizedData;
								}

								if (renderIndex.current !== 0) {
									newSortedData = insertIntoColumn(finalizedData, sortedDataRef.current, sorted);
									_calculatedData.current = _calculatedData.current.concat(finalizedData);
									renderIndex.current++;
									sortedDataRef.current = newSortedData;
                  					setSortedData(newSortedData) 
									
								} else {
									newSortedData = insertIntoColumn(finalizedData, [], sorted);
									_calculatedData.current = [finalizedData];
									renderIndex.current++;
									sortedDataRef.current = newSortedData;
									setSortedData(newSortedData)
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
					},
					(resolvedImages) => {
						resolvedImages.map((resolvedImage, index) => {
							if (renderIndex.current !== 0) {
								index = renderIndex.current;
							}
							resolvedImage.index = index;

							resolvedImage.masonryDimensions =
								_getCalculatedDimensions(
									resolvedImage.dimensions,
									layoutDimensions.columnWidth,
									layoutDimensions.gutterSize
								);

							resolvedImage.column = _assignColumns(resolvedImage, columns);

							if (props.onImageResolved) {
								resolvedImage = props.onImageResolved(resolvedImage, renderIndex.current) || resolvedImage;
							}

							if (renderIndex.current !== 0) {
								newSortedData = insertIntoColumn(resolvedImage, sortedDataRef.current, sorted);
								_calculatedData.current = _calculatedData.current.concat(resolvedImage);
								renderIndex.current++;
								sortedDataRef.current = newSortedData
                				setSortedData(newSortedData) 
								
							} else {
								newSortedData = insertIntoColumn(resolvedImage, [], sorted);
								_calculatedData.current = [resolvedImage];
								renderIndex.current++;
								sortedDataRef.current = newSortedData
								setSortedData(newSortedData)
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
							},
							(resolvedImage) => {
								resolvedImage.index = unsortedIndex.current;
								unsortedIndex.current++;

								resolvedImage.masonryDimensions =
									_getCalculatedDimensions(
										resolvedImage.dimensions,
										layoutDimensions.columnWidth,
										layoutDimensions.gutterSize
									);

								resolvedImage.column = _assignColumns(resolvedImage, columns);

								if (props.onImageResolved) {
									resolvedImage = props.onImageResolved(resolvedImage, renderIndex.current) || resolvedImage;
								}

								if (renderIndex.current !== 0) {
									newSortedData = insertIntoColumn(resolvedImage, sortedDataRef.current, sorted);

									_calculatedData.current = _calculatedData.current.concat(resolvedImage);
									renderIndex.current++;	

									sortedDataRef.current = newSortedData		
                  					setSortedData(newSortedData) 
									
								} else {
									newSortedData = insertIntoColumn(resolvedImage, [], sorted);
									_calculatedData.current = [resolvedImage];
									renderIndex.current++;
									sortedDataRef.current = newSortedData
									setSortedData(newSortedData)
								}
							});
					}
				});
			}
		}
	}

	_onCallEndReach = () => {
		props.masonryFlatListColProps &&
			props.masonryFlatListColProps.onEndReached &&
			props.masonryFlatListColProps.onEndReached();
	}

	return (
		<FlatList
			style={{
				flex: 1,
				padding: (props.layoutDimensions.width / 100) * props.spacing / 2,
				backgroundColor: props.backgroundColor
			}}
			contentContainerStyle={[{
				flexDirection: "row",
				width: "100%"
			}, props.listContainerStyle]}
			removeClippedSubviews={true}
			onEndReachedThreshold={props.onEndReachedThreshold}
			{...props.masonryFlatListColProps}
			onEndReached={_onCallEndReach}
			initialNumToRender={
				props.initialColToRender
					? props.initialColToRender
					: props.columns
			}
			keyExtractor={(item, index) => {
				return "COLUMN-" + index.toString() + "/"; // + (props.columns - 1);
			}}
			data={sortedData}
			renderItem={({ item, index }) => {
				return (
					<Column
						data={item}
						itemSource={props.itemSource}
						initialNumInColsToRender={props.initialNumInColsToRender}
						layoutDimensions={props.layoutDimensions}
						backgroundColor={props.backgroundColor}
						imageContainerStyle={props.imageContainerStyle}
						spacing={props.spacing}
						key={`MASONRY-COLUMN-${index}`}
						colIndex={index}

						customImageComponent={props.customImageComponent}
						customImageProps={props.customImageProps}
						completeCustomComponent={props.completeCustomComponent}

						onPressImage={props.onPressImage}
						onLongPressImage={props.onLongPressImage}

						renderIndividualHeader={props.renderIndividualHeader}
						renderIndividualFooter={props.renderIndividualFooter}
					/>
				);
			}}
		/>
	);
}

MasonryList.propTypes = {
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
	onPressImage: PropTypes.func,
	onLongPressImage: PropTypes.func,
	onEndReachedThreshold: PropTypes.number,
};

export default MasonryList;
