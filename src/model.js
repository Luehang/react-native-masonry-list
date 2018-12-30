import { Image } from "react-native";
import Task from "data.task";

export const resolveImage = (data) => {
	const uri = data.source && data.source.uri
		? data.source.uri : data.uri
		? data.uri : data.URI
		? data.URI : data.url
		? data.url : data.URL
		? data.URL : undefined;

	return new Task((reject, resolve) => Image.getSize(uri, (width, height) => resolve({
		...data,
		dimensions: {
			width,
			height
		}
	// eslint-disable-next-line
	}), (err) => reject(err)));
};

export const resolveLocal = (data) => {
	if (data.dimensions && data.dimensions.width && data.dimensions.height) {
		return new Task((reject, resolve) => {
			resolve({
				...data
			});
		// eslint-disable-next-line
		}, (err) => reject(err));
	}
	if (data.width && data.height) {
		return new Task((reject, resolve) => {
			resolve({
				...data,
				dimensions: {
					width: data.width,
					height: data.height
				}
			});
		// eslint-disable-next-line
		}, (err) => reject(err));
	}
};
