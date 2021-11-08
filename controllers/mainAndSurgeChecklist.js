
const path = require('path');
const { google } = require('googleapis');

module.exports.renderMainAndSurgeChecklist = (req, res) => {
    res.sendFile(path.join(__dirname, '/..', 'views', 'mainAndSurgeChecklist.html'));
};



module.exports.postMainAndSurgeChecklist = async (req, res) => {

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
        d4029, g4029, gt4029, hg4029, hd4029, p4029,
        d4030, g4030, gt4030, hg4030, hd4030, p4030,
        d4026, g4026, gt4026, hg4026, hd4026, p4026,
        d4027, g4027, gt4027, hg4027, hd4027, p4027,
        d4028, g4028, gt4028, hg4028, hd4028, p4028,

    } = req.body;


    const defectives = {
        d4029: d4029, d4030: d4030, d4026: d4026,
        d4027: d4027, d4028: d4028
    }
    const guards = {
        g4029: g4029, g4030: g4030, g4026: g4026,
        g4027: g4027, g4028: g4028
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
        range: "Main!A:AB", //state the horizontal range and which sheet you are appending data to
        valueInputOption: "USER_ENTERED", //This will convert data into proper formats (like date into date not string), so won't take raw data
        resource: {
            values: [
                [date, employee, shift,
                    gt4029, gt4030, gt4026,
                    gt4027, gt4028,
                    isAllGuardsChecked, defectsExist, '-',
                ], //these are the values that will be input into a single row, order matters
            ]
        }
    });

    const allDefects = [
        hd4029, hd4030, hd4026, hd4027, hd4028, hg4029,
        hg4030, hg4026, hg4027, hg4028,
    ]

    const prefixes = ['1444029', '1444030', '1444026', '1444027', '1444028']

    for (let i = 0; i < 5; i++) {
        if (allDefects[i]) {
            allDefects[i] = `${prefixes[i]}: ${allDefects[i]}`;
        }
    }

    const allDefectsString = allDefects.filter(Boolean).join("\n");

    const allPriorities = [
        p4029, p4030, p4026, p4027, p4028,
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
    res.redirect("/mainAndSurgeChecklist");

}