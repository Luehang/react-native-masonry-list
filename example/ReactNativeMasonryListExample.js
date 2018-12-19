// @flow
import React, { Component } from "react";
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

export default class ReactNativeMasonryListExample extends Component {
    render() {
        return (
            <View
                style={styles.container}
            >
                <View style={[styles.statusBarTop, styles.header, styles.mobileHeader]}>
                    <Text style={styles.title}>MasonryList</Text>
                </View>
                <MasonryList
                    images={testData}
                    renderIndividualHeader={(data) => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => Linking.openURL("https://luehangs.site")}>
                                <View style={[styles.masonryHeader, {width: data.width}]}>
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

function isIPhoneX() {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
    return (
        Platform.OS === "ios" &&
        ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
        (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#368FFA"
    },
    statusBarTop: {
        paddingTop: isIPhoneX() ? 30 : platform === "ios" ? 20 : 0
    },
    header: {
        height: isIPhoneX() ? 88 : 64,
        backgroundColor: "transparent"
    },
    mobileHeader: {
        width: deviceWidth,
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
    }
});
