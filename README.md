<a href="https://luehangs.site/lue_hang/projects/react-native-masonry-list"><img src="https://luehangs.site/images/react-native-masonry-list-main.jpg" alt="react-native-masonry-list"/></a>

<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

An easy and simple to use React Native component to render a custom high performant masonry layout for images. It uses a smart algorithm to sort the images evenly as possible according to the index position or fill in as soon as the image is fetched. Includes support for both iOS and Android. Free and made possible along with costly maintenance and updates by [Lue Hang](https://www.facebook.com/lue.hang) (the author).

Check out the [docs](https://luehangs.site/lue_hang/projects/react-native-masonry-list) for a complete documentation.

- Dynamic images, columns, spacing and container width.
- Smart algorithm for eveningly laying out images.
- Pull to Refresh.
- Scroll loading.
- Can be use with deeply rooted data and many fieldnames. `source`, `source.uri`, `uri`, `URI`, `url` or `URL`.
- Support for rendering all local and remote images with no missing images.
- Support for dynamic device rotation.
- Easily and highly customizable.
- **Fully supports iOS and PARTIALLY SUPPORTS ANDROID ONLY.**

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

![react-native-masonry-list](https://www.luehangs.site/videos/react-native-masonry-list-demo.gif)

![react-native-masonry-list dynamic states](https://www.luehangs.site/videos/react-native-masonry-list-dynamic-states.gif)

![react-native-masonry-list landscape](https://www.luehangs.site/videos/react-native-masonry-list-landscape.gif)

#### :information_source: Learn more about React Native with project examples along with Cyber Security and Ethical Hacking at [LH LABS](https://www.luehangs.site).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

# :open_file_folder: Index

### 1.  [Install](#gem-install)
### 2.  [Usage Example](#tada-usage-example)
### 3.  [API](#nut_and_bolt-api)
### 4.  :books: [Props](#books-props)
### 5.  [Helpful Hints](#memo-helpful-hints)
### 6.  [Example Project](#clapper-example-project)
### 7.  [Author](#santa-author)
### 8.  [Contribute](#clap-contribute)
### 9.  [License](#page_facing_up-license)

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

## :gem: Install

Type in the following to the command line to install the dependency.

```bash
$ npm install --save react-native-masonry-list
```

or

```bash
$ yarn add react-native-masonry-list
```

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :tada: Usage Example

Add an ``import`` to the top of the file.  At minimal, declare the ``MasonryList`` component in the ``render()`` method providing an array of data for the ``images`` prop.

#### :information_source: Local images must have a defined dimensions field with width and height.

> If you like [`react-native-masonry-list`](https://github.com/Luehang/react-native-masonry-list), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-masonry-list). Thanks.

```javascript
import MasonryList from "react-native-masonry-list";

//...
render() {
    return (
        <MasonryList
            images={[
                // Can be used with different image object fieldnames.
                // Ex. source, source.uri, uri, URI, url, URL
                { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" },
                // IMPORTANT: It is REQUIRED for LOCAL IMAGES
                // to include a dimensions field with the
                // actual width and height of the image or
                // it will throw an error.
                // { source: require("yourApp/image.png"),
                //     dimensions: { width: 1080, height: 1920 }
                // },
                // "width" & "height" is an alternative to the dimensions
                // field that will also be acceptable.
                // { source: require("yourApp/image.png"),
                //     width: 1080,
                //     height: 1920 },
                { source: { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg" } },
                { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg",
                    // Optional: Adding a dimensions field with
                    // the actual width and height for REMOTE IMAGES
                    // will help improve performance.
                    dimensions: { width: 1080, height: 1920 } },
                { URI: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg",
                    // Optional: Does not require an id for each
                    // image object, but is for best practices.
                    id: "blpccx4cn" },
                { url: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                { URL: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg" },
            ]}
            // Version *2.14.0 update
            // onEndReached={() => {
            //     // add more images when scrolls reaches end
            // }}
        />
    );
}
//...
```

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

## :tada: Efficiently Add More Images

**Version \*2.12.0 update:** Without rerendering the images.

```javascript
import MasonryList from "react-native-masonry-list";

//...
/**
 * Example method to add more images.
 *
 * @method addMoreImages
 */
addMoreImages(newImages) {
    this.setState({
        images: this.state.images.concat(newImages)
    });
}

render() {
    return (
        <MasonryList
            images={this.state.images}
            {/* Version *2.14.0 update */}
            onEndReached={() => {
                this.addMoreImages(moreImages);
            }}
        />
    );
}
//...
```

<br/>

***
<br/>

## :tada: Add New Images

**Version \*2.13.0 update:** Rerendering the images.

```javascript
import MasonryList from "react-native-masonry-list";

//...
/**
 * Example method to add new images.
 *
 * @method addNewImages
 * @config Set react-native-masonry-list's "rerender" prop to true.
 */
addNewImages(newImages) {
    this.setState({
        images: newImages
    });
}

render() {
    return (
        <MasonryList
            rerender={true}
            images={this.state.images}
        />
    );
}
//...
```

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

## :nut_and_bolt: API

``<MasonryList />`` component accepts the following props...

<br/>

# :books: Props

> If you like [`react-native-masonry-list`](https://github.com/Luehang/react-native-masonry-list), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-masonry-list). Thanks.

| Props | Description | Type | Default |
| ----- | ----------- | ---- | ------- |
| `images`                      | An array of objects.  **Local images must have a defined dimensions field with width and height.**  `source`, `source.uri`, `uri`, `URI`, `url` or `URL` is a required field (if multiple similar fields in an image object, priority will go from start `source` to last `URL`). **EX.** `[{ source: require("yourApp/image.png"), dimensions: { width: 1080, height: 1920 } }, { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg", dimensions: { width: 1080, height: 1920 } }, { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg"}]`  | `Array` | Required |
| `columns`                     | Desired number of columns. | `number` | 2 |
| `onEndReached`                | Called once when the scroll position gets within `onEndReachedThreshold` of the rendered content. `(info: {distanceFromEnd: number}) => void` | `function` | |
| `onEndReachedThreshold`       | How far from the end (in units of visible length of the list) the bottom edge of the list must be from the end of the content to trigger the `onEndReached` callback. Thus a value of 0.5 will trigger `onEndReached` when the end of the content is within half the visible length of the list. | `number` | |
| `refreshing`                  | Set this true while waiting for new data from a refresh. | `boolean` | `false` |
| `onRefresh`                   | If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the `refreshing` prop correctly. | `function` | |
| `initialColToRender`          | How many columns to render in the initial batch. | `number` | `columns` |
| `initialNumInColsToRender`    | How many items to render in each column in the initial batch. | `number` | 1 |
| `spacing`                     | Gutter size of the column. The spacing is a multiplier of 1% of the available view. | `number` | 1 |
| `sorted`                      | Whether to sort the masonry data according to their index position or allow to fill in as soon as the `uri` is ready. | `boolean` | false |
| `rerender`                    | Rerender the images when it changes. | `boolean` | false |
| `backgroundColor`             | Set the color of the background. **Version \*1.3.0 update**. | `string` | "#fff"
| `imageContainerStyle`         | The styles object which is added to the Image component. | `object` | {} |
| `listContainerStyle`          | Styles for the list container. | `object` | |
| `containerWidth`              | The width of the masonry list layout. Adding this will improve performance. **Version \*2.0.0 update** | `number` |
| `customImageComponent`        | Use a custom component to be rendered for the image as long as the component follows the standard interface of the `react-native` `Image` component. **Version \*1.2.2 update**. | `React.Component` | `Image` module import of react-native |
| `customImageProps`            | An object to pass additional properties to the `customImageComponent`. **Version \*1.2.2 update**. | `object` | |
| `completeCustomComponent`     | This Function or React Component is called as an alternative to render each image. Must return a React Element or Component, and it is required to have the source and style for the component to display proper masonry. `({ source: object, style: { width: number, height: number, margin: number }, data: object }) => React.Element` **Version \*1.2.2 update**. | `Function` or `React.Component` | |
| `renderIndividualHeader`      | A component, React Element, or Function that is executed **ABOVE** each individual masonry image. `(item: { column: number, index: number, dimensions: { width: number, height: number }, masonryDimensions: { width: number, height: number, margin: number, gutter: number }, source: object, ...data }, index: number) => ?React.Element` | `Function`, `React.Component`, or `React.Element` | |
| `renderIndividualFooter`      | A component, React Element, or Function that is executed **BELOW** each individual masonry image. `(item: { column: number, index: number, dimensions: { width: number, height: number }, masonryDimensions: { width: number, height: number, margin: number, gutter: number }, source: object, ...data }, index: number) => ?React.Element` | `Function`, `React.Component`, or `React.Element` | |
| `onPressImage`                | Custom function that is executed after a single tap on the image. `(item: object, index: number) => void` **index params included in Version \*2.2.0 update** | `Function` | |
| `onLongPressImage`            | Custom function that is executed after a long press on the image. `(item: object, index: number) => void` **index params included in Version \*2.2.0 update** | `Function` | |
| `masonryFlatListColProps`     | Props to be passed to the underlying `FlatList` masonry.  See [`FlatList` props...](https://facebook.github.io/react-native/docs/flatlist#props) | `object` | {} |
| `emptyView`                   | A component, React Element, or Function that is executed when there is no images.  **Version \*2.9.0 update** | `React.Component`, `React.Element` or `Function` | undefined |
| `onImageResolved`             | A function called after fetching image and resolving it.  `(image: object, renderIndex: number) => ?object` **Version \*2.8.0 update**. | `Function` | |
| `onImagesResolveEnd`          | A function called at the end of fetching and resolving.  `(images: array, total: number) => void` **Version \*2.16.0 update**. | `Function` | |
| `itemSource`                  | Image object entry to the image `source` and `dimensions` or `height` and `width`.  Max is 7 entries/properties to image source.  **Version \*2.1.0 update**.  Learn more about this at the [helpful hints section](#helpful-hints) | `Array` | [] |

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

## :memo: Helpful Hints

:information_source: **Version \*2.1.0 update (or greater versions):**  `itemSource` prop

Props | Description | Type | Default
------ | ------ | ------ | ------
`itemSource` | Image object entry to the image `source` and `dimensions` or `height` and `width`.  Max is 7 entries/properties to image source. | `Array` | []

Below is an example implementation of the `itemSource` prop.

```javascript
import MasonryList from "react-native-masonry-list";

//...
render() {
    return (
        <MasonryList
            itemSource={["node", "image"]}
            images={[
                {
                    node: {
                        image: { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" }
                    }
                },
                {
                    node: {
                        image: { source: require("yourApp/image.png"), dimensions: { width: 1080, height: 1920 } }
                    }
                },
                {
                    node: {
                        image: { source: require("yourApp/image.png"),
                            width: 1080,
                            height: 1920 }
                    }
                },
                {
                    node: {
                        image: { source: { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg" } }
                    }
                },
                {
                    node: {
                        image: { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg",
                            dimensions: { width: 1080, height: 1920 } }
                    }
                },
                {
                    node: {
                        image: { URI: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg"
                            id: "blpccx4cn" }
                    }
                },
                {
                    node: {
                        image: { url: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" }
                    }
                },
                {
                    node: {
                        image: { URL: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg" }
                    }
                }
            ]}
        />
    );
}
//...
```

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :clapper: Example Project

Perform steps 1-2 to run locally:

<details>
<summary>1. Clone the Repo</summary>
</br>

**Clone** `react-native-masonry-list` locally. In a terminal, run:

```bash
$ git clone https://github.com/Luehang/react-native-masonry-list.git react-native-masonry-list
```

</details>

<details>
<summary>2. Install and Run</summary>
</br>

```bash
$ cd react-native-masonry-list/example/
```

#### iOS - Mac - Install & Run

	1. check out the code
	2. npm install
	3. npm run ios

#### Android - Mac - Install & Run

	1. check out the code
	2. npm install
	3. emulator running in separate terminal
	4. npm run android

</details>

<br/>
<br/>
<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

## :santa: Author

<a href="https://www.facebook.com/lue.hang">
    <img src="https://www.luehangs.site/images/lue-hang2018-circle-150px.png"/>
</a>

Free and made possible along with costly maintenance and updates by [Lue Hang](https://www.facebook.com/lue.hang) (the author).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :clap: Contribute

[Pull requests](https://github.com/Luehang/react-native-masonry-list/pulls) are welcomed.

<br/>

### :tophat: Contributors

Contributors will be posted here.

<p align="left-align">
    <a href="https://github.com/folktale">
        <img width="100" hspace="5" src="https://www.luehangs.site/images/react-native-masonry-list-contributor-3-circle-100px.png"/>
    </a>
    <a href="https://github.com/hejun041">
        <img width="100" hspace="5" src="https://www.luehangs.site/images/react-native-masonry-list-contributor-2-circle-100px.png"/>
    </a>
    <a href="https://github.com/sahdev0">
        <img width="100" hspace="5" src="https://www.luehangs.site/images/react-native-masonry-list-contributor-circle-100px-sahdev0.png"/>
    </a>
</p>

<br/>

### :baby: Beginners

Not sure where to start, or a beginner? Take a look at the [issues page](https://github.com/Luehang/react-native-masonry-list/issues).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :page_facing_up: License

MIT © [Lue Hang](https://luehangs.site), as found in the LICENSE file.
