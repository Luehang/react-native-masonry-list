import React from "react";

export function getItemSource(item, itemSource) {
    switch (itemSource.length) {
        case 0:
            return item;
        case 1:
            return item[itemSource[0]];
        case 2:
            return item[itemSource[0]][itemSource[1]];
        case 3:
            return item[itemSource[0]][itemSource[1]][itemSource[2]];
        case 4:
            return item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]];
        case 5:
            return item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]][itemSource[4]];
        case 6:
            return item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]][itemSource[4]][itemSource[5]];
        case 7:
            return item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]][itemSource[4]][itemSource[5]][itemSource[6]];
        default:
            return undefined;
    }
}

export function setItemSource(item, itemSource, newValue) {
    switch (itemSource.length) {
        case 1:
            item[itemSource[0]] = newValue;
            break;
        case 2:
            item[itemSource[0]][itemSource[1]] = newValue;
            break;
        case 3:
            item[itemSource[0]][itemSource[1]][itemSource[2]] = newValue;
            break;
        case 4:
            item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]] = newValue;
            break;
        case 5:
            item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]][itemSource[4]] = newValue;
            break;
        case 6:
            item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]][itemSource[4]][itemSource[5]] = newValue;
            break;
        case 7:
            item[itemSource[0]][itemSource[1]][itemSource[2]][itemSource[3]][itemSource[4]][itemSource[5]][itemSource[6]] = newValue;
            break;
        default:
            return undefined;
    }
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
