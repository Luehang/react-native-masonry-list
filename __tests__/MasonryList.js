import "react-native";
import React from "react";
import {
    data
} from "./mocks/dataMock";
import MasonryList from "./../src/";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

test("Masonry List renders correctly", () => {
    const masonryList = renderer.create(<MasonryList images={data} />).toJSON();

    const scrollView = masonryList.children[0];

    expect(scrollView.type).toBe("RCTScrollView");
    expect(scrollView.props.horizontal).toBeFalsy();
    expect(scrollView.props.contentContainerStyle.justifyContent).toEqual("space-between");
    expect(scrollView.props.contentContainerStyle.flexDirection).toEqual("row");
    expect(scrollView.props.contentContainerStyle.width).toEqual("100%");
});
