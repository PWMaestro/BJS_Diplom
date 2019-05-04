'use strict'

class Profile {

	constructor(data) {
		this.username = data.username;
		this.name = {
			firstName: data.name.firstName,
			lastName: data.name.lastName 
		}
		this.password = data.password;
	}

	createUser(callback) {
		console.log(`Creating user ${this.username}...`);
		return ApiConnector.createUser(this, (err, data) => {
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
		return ApiConnector.performLogin(this, (err, data) => {
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
				console.log(`User ${this.username} has successfully taken his money!`);
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
				callback(data);
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
			callback(data);
		}
	} );
}

function preConvert({fromCurrency, targetCurrency, initialAmount, stocksList}, callback) {
	console.log('Calculating...');
	let phrase = fromCurrency + '_' + targetCurrency;
	let targetAmount = initialAmount * stocksList[99][phrase];
	console.log(`Done!\nYou can convert ${initialAmount} ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
	callback(
		{
			fromCurrency,
			targetCurrency,
			targetAmount
		});
}

//-------- -------- -------- Let the show begin! -------- -------- --------

(function main() {

	const ludwig = new Profile({
		username: 'Ludwig',
		name: {firstName: 'Людвиг', lastName: 'Айнцвайген'},
		password: 'ludwigs_pass'
	});

	const verner = new Profile({
		username: 'Verner',
		name: {firstName: 'Вернер', lastName: 'Бэкер'},
		password: 'verner_pass'
	});

	ludwig.createUser( () => {
		verner.createUser( () => {
			ludwig.authorize( () => {
				ludwig.addMoney(
				{
					currency: 'EUR',
					amount: 500001// Javascript can't convert money correctly
				},
				() => {
					getStocks( (stocksList) => {
						preConvert(
						{
							fromCurrency: 'EUR',
							targetCurrency: 'NETCOIN',
							initialAmount: 500000,
							stocksList
						},
						(data) => {
							ludwig.convertMoney(
								data,
								(userObj) => {
									ludwig.transferMoney(
									{
										to: 'Verner',
										amount: userObj.wallet.NETCOIN
									},
								() => {console.log('Hooray!')});
							});
						});						
					});
				});
			});
		});
	});

}());
