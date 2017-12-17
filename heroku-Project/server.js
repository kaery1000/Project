var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('https://karan1000-developer-edition.na73.force.com/services/apexrest/Project/', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE salesforce.Widget__c SET Name = $1, Phone__c = $2, Email__c= $3,Country__c=$4, Salary__c= $5 WHERE LOWER(Name) = LOWER($1) AND LOWER(email) = LOWER($3) ',
            [req.body.name.trim(), req.body.phone.trim(), req.body.email.trim(), req.body.country.trim(), req.body.salary.trim],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO salesforce.Widget__c (Name, Phone__c, Email__c, Country__c, Salary__c) VALUES ($1, $2, $3, $4, $5)',
                  [req.body.name.trim(), req.body.phone.trim(), req.body.email.trim(), req.body.country.trim(), req.body.salary.trim],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        res.json(result);
                    }
                  });
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
