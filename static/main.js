'use strict'

class Profile {

	set userData(userDataObject) {
		this.username = userDataObject.username;
		this.name = {
			firstName: userDataObject.name.firstName,
			lastName: userDataObject.name.lastName 
		}
		this.password = userDataObject.password;
	}

	get userData() {
		return Object.assign({}, this);
	}

	createUser(callback) {
		console.log(`Creating user ${this.username}...`);
		return ApiConnector.createUser(this.userData, (err, data) => {
			if (err) {
				console.error(`Error occured during user ${this.username} loggining in :(`);
			} else {
				console.log(`User ${this.username} successfully created!`);
				callback();
			}
		});
	}

	authorize(callback) {
		console.log(`User ${this.username} trying to log in...`);
		return ApiConnector.performLogin(this.userData, (err, data) => {
			if (err) {
				console.error(`Error occured during creating user ${this.username} :(`);
			} else {
				console.log(`User ${this.username} successfully logged in!`);
				callback();
			}
		});
	}

	addMoney({currency, amount}, callback) {
		console.log(`Adding ${amount} of ${currency} to ${this.username}...`);
		return ApiConnector.addMoney({currency, amount}, (err, data) => {
			if (err) {
				console.error(`Error occured during adding money to user ${this.username} :(`);
			} else {
				console.log(`User ${this.username} successfully has taken his money!`);
				callback();
			}
		});
	}

	convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
		console.log(`Trying to convert ${fromCurrency} to ${targetAmount} of ${targetCurrency}...`);
		return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount}, (err, data) => {
			if (err) {
				console.error(`Error occured during converting money :(`);
			} else {
				console.log('Converting successfully completed!');
				console.log(data);
				callback();
			}
		});
	}

	transferMoney({to, amount}, callback) {
		console.log(`Trying to transfer money from user ${this.username} to user ${to}...`);
		return ApiConnector.transferMoney({to, amount}, (err, data) => {
			if (err) {
				console.error(`Error occured during transfering money :(`);
			} else {
				console.log(`Transfering successfully completed!\n${to} has got ${amount} Netcoins.`);
				callback();
			}
		});
	}
}

function getStocks(callback) {
	console.log('Getting stoks info...');
	return ApiConnector.getStocks( (err, data) => {
		if (err) {
			console.error('An error occured while trying to access the stock exchange :(');
		} else {
			console.log('Done!');
			callback();
		}
	} );
}

//-------- -------- -------- Let the show begin! -------- -------- --------

(function main() {

	const ludwig = new Profile()
	ludwig.userData = {
			username: 'Ludwig',
			name: {firstName: 'Людвиг', lastName: 'Айнцвайген'},
			password: 'ludwigs_pass'
		}

	const verner = new Profile()
	verner.userData = {
			username: 'Verner',
			name: {firstName: 'Вернер', lastName: 'Бэкер'},
			password: 'verner_pass'
		}

	ludwig.createUser( () => {
		verner.createUser( () => {
			ludwig.authorize( () => {
				ludwig.addMoney(
				{
					currency: 'EUR',
					amount: 500000
				},
				() => {
					getStocks( () => {
						ludwig.convertMoney(
						{
							fromCurrency: 'EUR',
							targetCurrency: 'NETCOIN',
							targetAmount: 36000
						},
						() => {
							ludwig.transferMoney(
							{
								to: 'Verner',
								amount: 36000
							},
							() => {console.log('Hooray!')});
						});
					});
				});
			});
		});
	});

}());
