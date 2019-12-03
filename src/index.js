import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import MasonryList from "./MasonryList";

import {
    isReactComponent,
    isElement
} from "./utils";

class Masonry extends React.PureComponent {
    _mounted = false;

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

        emptyView: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.node
        ]),
        onEndReachedThreshold: PropTypes.number,
    }

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
        rerender: false,
        onEndReachedThreshold: 25
    }

    constructor(props) {
        super(props);
        this.state = {
            orientation: "portrait",
            layoutDimensions: this.props.containerWidth
                ? {
                    width: this.props.containerWidth,
                    gutterSize: (this.props.containerWidth / 100) * this.props.spacing,
                    columnWidth: this.props.containerWidth / this.props.columns
                }
                : {
                    // Bug fix for displaying layout
                    // dimensions in scrolling views
                    width: 100,
                },
                containerWidth: this.props.containerWidth,
                columns: this.props.columns,
                spacing: this.props.spacing,
        };
    }

    componentDidMount() {     
        this._mounted = true;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (!nextProps.containerWidth && !prevState.containerWidth) {
            if (nextProps.columns !== prevState.columns ||
                nextProps.spacing !== prevState.spacing) {
                    const height = prevState.layoutDimensions.height;
                    const width = prevState.layoutDimensions.width;
                    const nColumns = nextProps.columns ? nextProps.columns : 2;
                    const spacing = nextProps.spacing ? nextProps.spacing : 1;            
                    const gutterBase = width / 100;
                    const gutterSize = gutterBase * spacing;            
                    const actualWidth = width;            
                    const columnWidth = Math.floor(actualWidth / nColumns); 
                    return {
                        layoutDimensions: {
                            width,
                            height,
                            columnWidth,
                            gutterSize
                        },
                        containerWidth: nextProps.containerWidth,
                        columns: nextProps.columns,
                        spacing: nextProps.spacing
                    }

            }
            return null;
        } else if (nextProps.containerWidth || prevState.containerWidth) { 
            if (nextProps.containerWidth !== prevState.containerWidth ||
                nextProps.columns !== prevState.columns ||
                nextProps.spacing !== prevState.spacing) {
                    return {
                        layoutDimensions: {
                            width: nextProps.containerWidth,
                            gutterSize: (nextProps.containerWidth / 100) * nextProps.spacing,
                            columnWidth: nextProps.containerWidth / nextProps.columns
                        },
                        containerWidth: nextProps.containerWidth,
                        columns: nextProps.columns,
                        spacing: nextProps.spacing
                    }
            }            
            return null;
        }        
        return null;
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
        if (
            this.props.emptyView &&
            Array.isArray(this.props.images) &&
            this.props.images.length === 0
        ) {
            if (isReactComponent(this.props.emptyView)) {
                return React.createElement(this.props.emptyView);
            }
            else if (typeof this.props.emptyView === "function") {
                return this.props.emptyView();
            }
            else if (isElement(this.props.emptyView)) {
                return this.props.emptyView;
            }
        }

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
                    rerender={this.props.rerender}
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
                    listContainerStyle={this.props.listContainerStyle}
                    renderIndividualHeader={this.props.renderIndividualHeader}
                    renderIndividualFooter={this.props.renderIndividualFooter}
                    masonryFlatListColProps={this.props.masonryFlatListColProps}

                    customImageComponent={this.props.customImageComponent}
                    customImageProps={this.props.customImageProps}
                    completeCustomComponent={this.props.completeCustomComponent}

                    onImageResolved={this.props.onImageResolved}

                    onPressImage={this.props.onPressImage}
                    onLongPressImage={this.props.onLongPressImage}

                    onEndReachedThreshold={this.props.onEndReachedThreshold}
                />
            </View>
        );
    }
}

export default Masonry;
