import React from "react";

export function getItemSource(item, itemSource) {
    let result = item;
    for (let i = 0; i < itemSource.length; i++) {
        if (result == null) return undefined;
        result = result[itemSource[i]];
    }
    return result;
}

export function setItemSource(item, itemSource, newValue) {
    let target = item;
    for (let i = 0; i < itemSource.length - 1; i++) {
        target = target[itemSource[i]];
    }
    target[itemSource[itemSource.length - 1]] = newValue;

    return item;
}

export function getImageSource(image) {
    return image.source
        ? image.source : image.uri
        ? { uri: image.uri } : image.URI
        ? { uri: image.URI } : image.url
        ? { uri: image.url } : image.URL
        ? { uri: image.URL } : undefined;
}

export function getImageUri(image) {
    return image.source && image.source.uri
        ? image.source.uri : image.uri
        ? image.uri : image.URI
        ? image.URI : image.url
        ? image.url : image.URL
        ? image.URL : undefined;
}

export function insertIntoColumn (resolvedImage, dataSet, sorted) {
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

export function isClassComponent(component) {
    return (
        typeof component === "function" &&
        !!component.prototype.isReactComponent
    ) ? true : false;
}

export function isFunctionComponent(component) {
    return (
        typeof component === "function" &&
        String(component).includes("return React.createElement")
    ) ? true : false;
}

export function isReactComponent(component) {
    return (
        isClassComponent(component) ||
        isFunctionComponent(component)
    ) ? true : false;
}

export function isElement(element) {
    return React.isValidElement(element);
}
