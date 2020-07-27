import React, { Component } from 'react';

export default class AddDeal extends Component {
	state = {
		name: '',
	};

	onChange = (e) => this.setState({ [e.target.name]: e.target.value });
	onSubmit = (e) => {
		e.preventDefault();
		this.props.addDeal(this.state.name);
		this.setState({ name: '' });
	};
	render() {
		return (
			<form
				id="form"
				className="form-inline"
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'baseline',
				}}
				onSubmit={this.onSubmit}
			>
				<label>Name:</label>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<input
						type="text"
						name="name"
						placeholder="Create a deal by Name..."
						value={this.state.name}
						onChange={this.onChange}
					/>
					{this.props.error && (
						<span className="error">{this.props.error}</span>
					)}
				</div>
				<input type="submit" value="Create" className="btn" />
			</form>
		);
	}
}
