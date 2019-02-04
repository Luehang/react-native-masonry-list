import React from "react";
import PropTypes from "prop-types";

export default class Injector extends React.PureComponent {
	static propTypes = {
		defaultComponent: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		defaultProps: PropTypes.object,
		injectant: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		injectantProps: PropTypes.object
	}

	_renderDefault = (props) => {
		const DefaultComponent = props.defaultComponent;
		const { defaultProps } = props;

		return (
			<DefaultComponent
				{...defaultProps}
			>
				{props.children}
			</DefaultComponent>
		);
	}

	_renderInjectant = (props) => {
		const Injectant = props.injectant;
		const { defaultProps, injectantProps } = props;

		return (
			<Injectant
				{...defaultProps}
				{...injectantProps}>
				{props.children}
			</Injectant>
		);
	}

	render() {
		return (this.props.injectant)
			? this._renderInjectant(this.props)
			: this._renderDefault(this.props);
	}
}
