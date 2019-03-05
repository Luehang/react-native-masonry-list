import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import MasonryList from "./MasonryList";

export default class Masonry extends React.PureComponent {
    _mounted = false;
    // masonryListRef;

    static propTypes = {
        itemSource: PropTypes.array,
		images: PropTypes.array,
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

    static defaultProps = {
        itemSource: [],
		images: [],
		columns: 2,
		initialColToRender: null,
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
            orientation: "portrait",
			layoutDimensions: this.props.containerWidth ?
				{
                    width: this.props.containerWidth,
					gutterSize: (this.props.containerWidth / 100) * this.props.spacing,
                    columnWidth: this.props.containerWidth / this.props.columns
                }
			:
				{
					// Bug fix for displaying layout
					// dimensions in scrolling views
					width: 100,
                }
        };
    }

    componentWillMount() {
        this._mounted = true;
    }

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.containerWidth && !this.props.containerWidth) {
            if (nextProps.columns !== this.props.columns ||
                nextProps.spacing !== this.props.spacing) {
                    this._setColumnDimensions(
                        {
                            height: this.state.layoutDimensions.height,
                            width: this.state.layoutDimensions.width
                        },
                        nextProps.columns,
                        nextProps.spacing
                    );
            }
        } else if (nextProps.containerWidth || this.props.containerWidth) {
            if (nextProps.containerWidth !== this.props.containerWidth ||
                nextProps.columns !== this.props.columns ||
                nextProps.spacing !== this.props.spacing) {
                    this.setState({
                        layoutDimensions: {
                            width: nextProps.containerWidth,
                            gutterSize: (nextProps.containerWidth / 100) * nextProps.spacing,
                            columnWidth: nextProps.containerWidth / nextProps.columns
                        }
                    });
            }
        }
	}

    _layoutChange = (ev) => {
        const { width, height } = ev.nativeEvent.layout;
        const { orientation } = this.state;
        const { columns, spacing } = this.props;
        let maxComp = Math.max(width, height);

        if (width >= maxComp && orientation !== "landscape") {
            this.setState({ orientation: "landscape" });
            this._setParentDimensions(ev, columns, spacing);
        } else if (orientation !== "portrait") {
            this.setState({ orientation: "portrait" });
            this._setParentDimensions(ev, columns, spacing);
        }
    }

    _setColumnDimensions = (parentDimensions, nColumns = 2, spacing = 1) => {
		const {
			height,
			width
		} = parentDimensions;

		const gutterBase = width / 100;
        const gutterSize = gutterBase * spacing;

        // const actualWidth = width - (((gutterSize / 2) * nColumns) + (gutterSize / 2));
        const actualWidth = width;

        const columnWidth = Math.floor(actualWidth / nColumns);

        this.setState({
            layoutDimensions: {
                width,
                height,
                columnWidth,
                gutterSize
            }
        });
	}

    _setParentDimensions = (event, nColumns = 2, spacing = 1) => {
		const { width, height } = event.nativeEvent.layout;

		if (this._mounted && width && height) {
            return this._setColumnDimensions({ width, height }, nColumns, spacing);
		}
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    render() {
        return (
            <View style={
                    !this.props.containerWidth
                        ? {flex: 1}
                        : {flex: 1, width: this.props.containerWidth}
                }
                onLayout={(event) => {
                    if (!this.props.containerWidth) {
                        this._setParentDimensions(event, this.props.columns, this.props.spacing);
                        this._layoutChange(event);
                    }
                }}>
                <MasonryList
                    layoutDimensions={this.state.layoutDimensions}
                    containerWidth={this.props.containerWidth}
                    itemSource={this.props.itemSource}
                    orientation={this.state.orientation}
                    // ref={(component) => {
                    //     this.masonryListRef = component;
                    //     this.props.masonryListRef &&
                    //         this.props.masonryListRef(component);
                    // }}

                    images={this.props.images}
                    columns={this.props.columns}
                    spacing={this.props.spacing}
                    initialColToRender={this.props.initialColToRender}
                    initialNumInColsToRender={this.props.initialNumInColsToRender}
                    sorted={this.props.sorted}
                    backgroundColor={this.props.backgroundColor}
                    imageContainerStyle={this.props.imageContainerStyle}
                    renderIndividualHeader={this.props.renderIndividualHeader}
                    renderIndividualFooter={this.props.renderIndividualFooter}
                    masonryFlatListColProps={this.props.masonryFlatListColProps}

                    customImageComponent={this.props.customImageComponent}
                    customImageProps={this.props.customImageProps}
                    completeCustomComponent={this.props.completeCustomComponent}

                    onPressImage={this.props.onPressImage}
                    onLongPressImage={this.props.onLongPressImage}

                    onEndReachedThreshold={this.props.onEndReachedThreshold}
                />
            </View>
        );
    }
}
