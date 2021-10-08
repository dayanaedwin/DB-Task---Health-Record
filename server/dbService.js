const { response } = require('express');
const mariadb = require('mariadb');
let instance = null;

const pool = mariadb.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: 'password',
	database: 'health_record',
	port: '3306',
	connectionLimit: 100,
});

pool.getConnection((err, connection) => {
	if (err) {
		console.log(err.message);
	}
	console.log('db ' + connection.state);
});

class DbService {
	static getDbServiceInstance() {
		return instance ? instance : new DbService();
	}

	forloop() {
		try {
			var date = new Date();

			for (let i = 0; i < 1000000; i++) {
				console.log(`This is ${i} th string`);
			}

			var nextDate = new Date();

			console.log(`Time stamp before loop: ${date}`);
			console.log(`Time stamp after loop: ${nextDate}`);
			console.log(`Difference in time stamp: ${nextDate - date}`);

			return true;
		} catch (error) {
			console.log('error in read', error);
		}
	}

	newloop(data) {
		var date = new Date();
		for (let i = 0; i < data.length; i++) {
			const query = `INSERT INTO Vehicle(reg_num, name, model, company, type) values("${data[i].vid}", "${data[i].name}", "${data[i].model}", "${data[i].company}", "${data[i].type}");`;

			pool.query(query, (err, result) => {
				if (err) {
					console.log(err);
				}
			});
		}

		var nextDate = new Date();

		console.log(`Time stamp before loop: ${date}`);
		console.log(`Time stamp after loop: ${nextDate}`);
		console.log(`Difference in time stamp: ${nextDate - date}`);

		return true;
	}

	async insertData(data) {
		var rows = 0;

		const response = await new Promise((resolve, reject) => {
			const query = `INSERT INTO Record(uid,service_id,hospital_code,doctor_id,prescribed_medicines,date)  values(${data.uid},${data.service_id},${data.hospital_code},'${data.doctor_id}','${data.prescribed_medicines}','${data.date}');`;
			pool.query(query, (err, result) => {
				if (err) reject(new Error(err.message));

				rows += 1;

				resolve();
			});
		});

		return rows != 0 ? true : false;
	}

	async insertBillData(data) {
		var k = 0;

		k = await data.map(async (i) => {
			const response = await new Promise((resolve, reject) => {
				const query = `INSERT INTO Bill(bill_amount) values(${data.bill_amount});`;

				pool.query(query, (err, result) => {
					if (err) reject(new Error(err.message));

					resolve();
				});
			});
		});

		return k != 0 ? true : false;
	}

	async queryFirst() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					"SELECT COUNT(*) AS NumberOfRecords FROM Record,Hospital WHERE Record.hospital_code = Hospital.hospital_code AND Hospital.hospital_name = 'KMH';";

				pool.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});
			return response;
		} catch (error) {
			console.log('error in read', error);
		}
	}

	async querySecond() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					"SELECT COUNT(DISTINCT Record.uid) AS NumberOfPatients FROM Record, Doctor WHERE Record.doctor_id = Doctor.doctor_id AND Doctor.doctor_name = 'Pearl Walsh';";

				pool.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});
			return response;
		} catch (error) {
			console.log('error in read', error);
		}
	}

	async queryThird() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					'SELECT Individual.name, Record.id, Record.Date, Service.service_name, Hospital.hospital_name, Record.prescribed_medicines, Doctor.doctor_name from Record, Service, Hospital, Individual, Doctor where Record.uid= 23742 and Individual.uid= Record.uid and Hospital.hospital_code= Record.hospital_code and Service.service_id= Record.service_id and Doctor.doctor_id= Record.doctor_id;';

				pool.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});
			return response;
		} catch (error) {
			console.log('error in read', error);
		}
	}

	async queryFourth() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					"SELECT Individual.name, Individual.contact_number FROM Individual, Hospital, Record WHERE Individual.uid = Record.uid AND Hospital.hospital_code = Record.hospital_code AND Hospital.hospital_name = 'BRC' AND Individual.blood_group = 'AB-';";

				pool.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});
			return response;
		} catch (error) {
			console.log('error in read', error);
		}
	}

	async queryFifth() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query =
					'SELECT Individual.Name AS PatientName FROM Individual, Record WHERE Individual.uid = Record.uid GROUP BY Record.uid ORDER BY COUNT(*) DESC LIMIT 1;';

				pool.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});
			return response;
		} catch (error) {
			console.log('error in read', error);
		}
	}

	async getAllData() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query = 'SELECT * FROM Record;';

				pool.query(query, (err, results) => {
					if (err) reject(new Error(err.message));
					resolve(results);
				});
			});
			return response;
		} catch (error) {
			console.log('error in read', error);
		}
	}
}

module.exports = DbService;
