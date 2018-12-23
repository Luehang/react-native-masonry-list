<a href="https://luehangs.site/lue_hang/projects/react-native-masonry-list"><img src="https://luehangs.site/images/react-native-masonry-list-main.jpg" alt="react-native-masonry-list"/></a>

<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

> An easy and simple to use React Native component to render a custom masonry layout for images. Includes support for both iOS and Android. Free and made possible along with costly maintenance and updates by [Lue Hang](https://www.facebook.com/lue.hang) (the author).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

![react-native-masonry-list](https://www.luehangs.site/videos/react-native-masonry-list-demo.gif)

Learn more about React Native with project examples along with Cyber Security and Ethical Hacking at [LH LABS](https://www.luehangs.site).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## Index

- [Install](#install)
- [Usage Example](#usage-example)
- [API](#api)
- [Props](#props)
- [Example Project](#example-project)
- [Author](#author)
- [Contribute](#contribute)
- [License](#license)

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## Install

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

## Usage Example

Add an ``import`` to the top of the file.  At minimal, declare the ``MasonryList`` component in the ``render()`` method providing an array of data for the ``images`` prop.

> **Local images must have a defined dimensions field with width and height.**

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
                { source: require("yourApp/image.png"), 
                    // IMPORTANT: It is REQUIRED for LOCAL IMAGES
                    // to include a dimensions field with the
                    // actual width and height of the image or
                    // it will throw an error.
                    dimensions: { width: 1080, height: 1920 }
                },
                { source: { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg" } },
                { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg",
                    // Optional: Adding a dimensions field with
                    // the actual width and height for REMOTE IMAGES
                    // will help improve performance.
                    dimensions: { width: 1080, height: 1920 } },
                { URI: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg"
                    // Optional: Does not require an id for each
                    // image object, but is for best practices.
                    id: "blpccx4cn" },
                { url: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                { URL: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg" },
            ]}
        />
    );
}
//...
```

<br/>
<br/>
<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## API

``<MasonryList />`` component accepts the following props...

<br/>

### Props

**Version ^1.2.2 update:** New props for `customImageComponent`, `customImageProps` and `completeCustomComponent`.

| Props                         | Description                                                                                                                                                                                    | Type              | Default |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|---------|
| `images`                      | An array of objects.  **Local images must have a defined dimensions field with width and height.**  `source`, `source.uri`, `uri`, `URI`, `url` or `URL` is a required field (if multiple similar fields in an image object, priority will go from start `source` to last `URL`). EX. `[{ source: require("yourApp/image.png"), dimensions: { width: 1080, height: 1920 } }, { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg", dimensions: { width: 1080, height: 1920 } }, { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg"}]`  | `Array` | Required |
| `columns`                     | Desired number of columns. | `number` | 2 |
| `spacing`                     | Gutter size of the column. The spacing is a multiplier of 1% of the available view. | `number` | 1 |
| `initialColToRender`          | How many columns to render in the initial batch. | `number` | 2 |
| `initialNumInColsToRender`    | How many items to render in each column in the initial batch. | `number` | 2 |
| `sorted`                      | Whether to sort the masonry data according to their index position or allow to fill in as soon as the `uri` is ready. | `Boolean` | false |
| `backgroundColor`             | Set the color of the background. **Version \*1.3.0 update**. | `string` | "#fff"
| `imageContainerStyle`         | The styles object which is added to the Image component. | `Object` | {} |
| `customImageComponent`        | Use a custom component to be rendered for the image as long as the component follows the standard interface of the `react-native` `Image` component. | `React.Component` | `Image` module import of react-native |
| `customImageProps`            | An object to pass additional properties to the `customImageComponent` | `Object` | |
| `completeCustomComponent`     | Custom function to return a fully custom component for each image.  `({ source: Object, style: { width: number, height: number, margin: number }, data: Object }) => React.Element`  This function must return a React Component and it is required to have the source and style for the component to display proper masonry. | `Function` | |
| `renderIndividualHeader`      | Custom function that is executed **ABOVE** each individual masonry image. `(item: Object, index: number) => ?React.Element` | `Function` | |
| `renderIndividualFooter`      | Custom function that is executed **BELOW** each individual masonry image. `(item: Object, index: number) => ?React.Element` | `Function` | |
| `onPressImage`                | Custom function that is executed after a single tap on the image. `(item: Object) => void` | `Function` | |
| `onLongPressImage`            | Custom function that is executed after a long press on the image. `(item: Object) => void` | `Function` | |
| `masonryFlatListColProps`     | Props to be passed to the underlying `FlatList` masonry.  See [`FlatList` props...](https://facebook.github.io/react-native/docs/flatlist#props) | `Object` | {} |

<br/>
<br/>
<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## Example Project

Perform steps 1-2 to run locally:

1. [Clone the Repo](#1-clone-the-repo)
2. [Install and Run](#2-install-and-run)

<br/>

### 1. Clone the Repo

**Clone** `react-native-masonry-list` locally. In a terminal, run:

```bash
$ git clone https://github.com/Luehang/react-native-masonry-list.git react-native-masonry-list
```

<br/>

### 2. Install and Run

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

<br/>
<br/>
<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## Author

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

## Contribute

[Pull requests](https://github.com/Luehang/react-native-masonry-list/pulls) are welcomed.

<br/>

### Beginners

Not sure where to start, or a beginner? Take a look at the [issues page](https://github.com/Luehang/react-native-masonry-list/issues).

<br/>

### Contributors

Contributors will be posted here.

<a href="https://github.com/sahdev0">
<img src="https://www.luehangs.site/images/react-native-masonry-list-contributor-circle-100px-sahdev0.png"/>
</a>

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## License

MIT © [Lue Hang](https://luehangs.site), as found in the LICENSE file.
