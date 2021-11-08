
const path = require('path');
const { google } = require('googleapis');

module.exports.renderSecondary4Checklist = (req, res) => {
    res.sendFile(path.join(__dirname, '/..', 'views', 'secondary4Checklist.html'));
};



module.exports.postSecondary4Checklist = async (req, res) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "API-Credentials/credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    //Create client instance for auth
    const client = await auth.getClient();

    //Instance of googlesheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });


    const spreadsheetId = process.env.SPREADSHEET_ID;

    //collect data from req.body by destructuring the object. These are the variables that represent each section of the form filled
    const {
        employee, date, shift, sections,
        d4076, g4076, gt4076, hg4076, hd4076, p4076,
        d4079, g4079, gt4079, hg4079, hd4079, p4079,
        d4800, g4800, gt4800, hg4800, hd4800, p4800,
        d4278, g4278, gt4278, hg4278, hd4278, p4278,
        d4031, g4031, gt4031, hg4031, hd4031, p4031,
        d4032, g4032, gt4032, hg4032, hd4032, p4032,
        d4117, g4117, gt4117, hg4117, hd4117, p4117,
        d4123, g4123, gt4123, hg4123, hd4123, p4123,
        d4116, g4116, gt4116, hg4116, hd4116, p4116,
        d4046, g4046, gt4046, hg4046, hd4046, p4046,
        d4047, g4047, gt4047, hg4047, hd4047, p4047,
        d4118, g4118, gt4118, hg4118, hd4118, p4118,
        d4077, g4077, gt4077, hg4077, hd4077, p4077,
        d2007, g2007, gt2007, hg2007, hd2007, p2007,
        d2010, g2010, gt2010, hg2010, hd2010, p2010,
        d2025, g2025, gt2025, hg2025, hd2025, p2025,
        d2023, g2023, gt2023, hg2023, hd2023, p2023,
        d2270, g2270, gt2270, hg2270, hd2270, p2270,
    } = req.body;

    const defectives = {
        d4076: d4076, d4079: d4079, d4800: d4800,
        d4278: d4278, d4031: d4031, d4032: d4032,
        d4117: d4117, d4123: d4123, d4116: d4116,
        d4046: d4046, d4047: d4047, d4118: d4118,
        d4077: d4077, d2007: d2007, d2025: d2025,
        d2023: d2023, d2270: d2270,
    }
    const guards = {
        g4076: g4076, g4079: g4079, g4800: g4800,
        g4278: g4278, g4031: g4031, g4032: g4032,
        g4117: g4117, g4123: g4123, g4116: g4116,
        g4046: g4046, g4047: g4047, g4118: g4118,
        g4077: g4077, g2007: g2007, g2025: g2025,
        g2023: g2023, g2270: g2270,
    }
    //analyzes if defectives are checked or if guards are unchecked
    const defectArray = []; //array is empty, but will systematically input any defects or issues into it
    let isAllGuardsChecked = 'Yes';
    let defectsExist = 'No';

    for (let key in defectives) {
        if (defectives[key]) {
            defectArray.push(key)
            defectsExist = 'Yes'
        }
    }

    for (let key in guards) {
        if (!guards[key]) {
            defectArray.push(key)
            isAllGuardsChecked = 'No'
        };
    };
    // ^^ function is done, defectArray will have guards or defects that had issues stored

    //write rows to spreadsheet
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sec-4!A:AB", //state the horizontal range and which sheet you are appending data to
        valueInputOption: "USER_ENTERED", //This will convert data into proper formats (like date into date not string), so won't take raw data
        resource: {
            values: [
                [
                    date, employee, shift,
                    gt4076, gt4079, gt4800, gt4278, gt4031,
                    gt4032, gt4117, gt4123, gt4116, gt4046,
                    gt4047, gt4118, gt4077, gt2007, gt2025,
                    gt2023, gt2270,
                    isAllGuardsChecked, defectsExist, '-',
                ], //these are the values that will be input into a single row, order matters
            ]
        }
    });

    const allDefects = [
        hd4076, hd4079, hd4800, hd4278, hd4031,
        hd4032, hd4117, hd4123, hd4116, hd4046,
        hd4047, hd4118, hd4077, hd2007, hd2025,
        hd2023, hd2270,
        hg4076, hg4079, hg4800, hg4278, hg4031,
        hg4032, hg4117, hg4123, hg4116, hg4046,
        hg4047, hg4118, hg4077, hg2007, hg2025,
        hg2023, hg2270,
    ]

    const prefixes = [
        '1744076', '1744079', '1744800', '1444278',
        '1444031', '1444032', '1444117', '1444123',
        '1444116', '1444046', '1444047', '1444118',
        '1744077', '1442007', '1442025', '1742023',
        '1442270'
    ]


    for (let i = 0; i < 18; i++) {
        if (allDefects[i]) {
            allDefects[i] = `${prefixes[i]}: ${allDefects[i]}`;
        }
    }

    const allDefectsString = allDefects.filter(Boolean).join("\n");

    const allPriorities = [
        p4076, p4079, p4800, p4278, p4031,
        p4032, p4117, p4123, p4116, p4046,
        p4047, p4118, p4077, p2007, p2025,
        p2023, p2270,
    ]
    const allPrioritiesString = allPriorities.filter(Boolean).join("\n");

    if (defectArray.length) {

        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "BackLog!A:E",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [date, employee, sections, allPrioritiesString, allDefectsString, '-',
                    ]
                ]
            }
        })
    }


    // res.redirect("/")
    res.redirect("/secondary4Checklist");

}