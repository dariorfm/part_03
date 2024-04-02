const mongoose = require('mongoose');

const password = process.argv[2];
const url = `mongodb+srv://dariorfm:${password}@clusterp.yj9mde4.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=ClusterP`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    person.save().then(() => {
        console.log(`Added ${person.name} ${person.number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log('Please provide the password only, or password, name and number as arguments: node mongo.js <password> <name> <number>');
    process.exit(1);
}
