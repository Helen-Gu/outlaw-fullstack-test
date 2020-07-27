import React, { Component } from 'react';
import AddDeal from './AddDeal';

export default class Deals extends Component {
	constructor() {
		super();
		this.state = {
			deals: [],
			sort: {
				key: 'updated', // default to "updated"
				order: 'asc',
			},
			error: '',
		};
	}

	componentDidMount() {
		fetch('/api/deals?sort=updated.asc')
			.then((res) => res.json())
			.then((deals) => this.setState({ deals }));
	}
	onClick = (e) => {
		const key = e.target.id;
		let order;
		if (this.state.sort.key === key) {
			order = this.state.sort.order === 'asc' ? 'desc' : 'asc';
		} else {
			order = 'asc';
		}
		fetch(
			'/api/deals?' +
				new URLSearchParams({
					sort: `${key}.${order}`,
				})
		)
			.then((res) => res.json())
			.then((deals) =>
				this.setState({
					deals,
					sort: {
						key,
						order,
					},
					error: '',
				})
			);
	};
	addDeal = (name) => {
		fetch('/api/deals', {
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain. */*',
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				name,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				const { err } = data;
				if (err) {
					throw new Error(err);
				}
				this.setState({
					deals: [...this.state.deals, data],
					sort: {
						key: undefined,
						order: undefined,
					},
					error: '',
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ error: error });
			});
	};
	render() {
		return (
			<>
				<h1 id="title">Outlaw Deals</h1>
				<AddDeal
					addDeal={this.addDeal}
					error={this.state.error.toString()}
				/>
				<span style={{ float: 'right', margin: '2px 0' }}>
					Total: {this.state.deals.length}
				</span>
				<table id="deals">
					<thead>
						<tr>
							<th>DealID</th>
							<th
								id="name"
								onClick={this.onClick}
								style={{ cursor: 'pointer' }}
							>
								Name
							</th>
							<th
								id="updated"
								onClick={this.onClick}
								style={{ cursor: 'pointer' }}
							>
								Updated
							</th>
							<th>Type</th>
							<th>Status</th>
							<th>Signed Date</th>
						</tr>
					</thead>
					<tbody>
						{this.state.deals.map((data, key) => {
							const {
								dealID,
								name,
								updated,
								dealType,
								status,
								signedDate,
							} = data;
							return (
								<tr key={key}>
									<td>{dealID}</td>
									<td>{name}</td>
									<td>{convertUnixToDate(updated)}</td>
									<td>{dealType}</td>
									<td>{status}</td>
									<td>{convertUnixToDate(signedDate)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</>
		);
	}
}

const convertUnixToDate = (dateTime) => {
	const date = new Date(parseInt(dateTime));

	const fdate =
		('0' + (date.getMonth() + 1)).slice(-2) +
		'/' +
		('0' + date.getDate()).slice(-2) +
		'/' +
		date.getFullYear();
	return dateTime ? fdate : '';
};
