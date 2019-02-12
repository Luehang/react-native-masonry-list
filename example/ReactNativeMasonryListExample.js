import React from "react";
import {
    Platform,
    Dimensions,
    Linking,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
} from "react-native";
import MasonryList from "react-native-masonry-list";

import testData from "./data";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#368FFA"
    },
    header: {
        height: isIPhoneX() ? 74 : 64,
        backgroundColor: "transparent"
    },
    mobileHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    masonryHeader: {
        position: "absolute",
        zIndex: 10,
        flexDirection: "row",
        padding: 5,
        alignItems: "center",
        backgroundColor: "rgba(150,150,150,0.4)"
    },
    title: {
        fontSize: 25
    },
    userPic: {
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 10
    },
    userName: {
        fontSize: 15,
        color: "#fafafa",
        fontWeight: "bold"
    },
    listTab: {
        height: 32,
        flexDirection: "row",
        borderTopLeftRadius: 7.5,
        borderTopRightRadius: 7.5,
        backgroundColor: "#fff",
        marginBottom: -5
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    tabTextUnderline: {
        borderBottomWidth: 2,
        borderBottomColor: "#e53935"
    },
    tabTextOn: {
        fontSize: 10,
        color: "#e53935"
    },
    tabTextOff: {
        fontSize: 10,
        color: "grey"
    },
});

function isIPhoneX() {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
    return (
        Platform.OS === "ios" &&
        ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
        (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
    );
}

export default class ReactNativeMasonryListExample extends React.Component {
    state = {
        columns: 2,
        statusBarPaddingTop: isIPhoneX() ? 30 : platform === "ios" ? 20 : 0
    }

    onLayoutChange = (ev) => {
        const { width, height } = ev.nativeEvent.layout;
        let maxComp = Math.max(width, height);

        if (width >= maxComp) {
            this.setState({
                columns: 3,
                statusBarPaddingTop: 0
            });
        } else if (width < maxComp) {
            this.setState({
                columns: 2,
                statusBarPaddingTop: isIPhoneX() ? 30 : platform === "ios" ? 20 : 0
            });
        }
    }

    render() {
        const { statusBarPaddingTop } = this.state;

        return (
            <View
                onLayout={(ev) => this.onLayoutChange(ev)}
                style={styles.container}
            >
                <View style={[styles.header, styles.mobileHeader, { paddingTop: statusBarPaddingTop }]}>
                    <Text style={styles.title}>MasonryList</Text>
                </View>
                <View style={styles.listTab}>
                    <TouchableWithoutFeedback
                        style={{borderTopLeftRadius: 7.5,}}
                        onPress={() => Linking.openURL("https://luehangs.site")}>
                            <View style={styles.tab}>
                                <View style={[styles.tabTextUnderline, {paddingBottom: 3}]}>
                                    <Text style={styles.tabTextOn}>REMOTE/LOCAL</Text>
                                </View>
                            </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.tab}>
                            <View style={{paddingBottom: 3}}>
                                <Text style={styles.tabTextOff}>CAMERA ROLL</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <MasonryList
                    images={testData}
                    columns={this.state.columns}
                    // sorted={true}
                    renderIndividualHeader={(data) => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => Linking.openURL("https://luehangs.site")}>
                                <View style={[styles.masonryHeader, {
                                    width: data.masonryDimensions.width,
                                    margin: data.masonryDimensions.gutter / 2
                                }]}>
                                    <Image
                                        source={{ uri: "https://luehangs.site/images/lue-hang2018-square.jpg" }}
                                        style={styles.userPic} />
                                    <Text style={styles.userName}>{data.title}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    }}
                />
            </View>
        );
    }
}
