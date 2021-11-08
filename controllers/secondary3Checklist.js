
const path = require('path');
const { google } = require('googleapis');

module.exports.renderSecondary3Checklist = (req, res) => {
    res.sendFile(path.join(__dirname, '/..', 'views', 'secondary3Checklist.html'));
};



module.exports.postSecondary3Checklist = async (req, res) => {

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
        d9009, g9009, nst9009, sst9009, hg9009, hd9009, p9009,
        d9015, g9015, gt9015, hg9015, hd9015, p9015,
        d4034, g4034, gt4034, hg4034, hd4034, p4034,
        d4035, g4035, gt4035, hg4035, hd4035, p4035,
        d4036, g4036, gt4036, hg4036, hd4036, p4036,
        d4037, g4037, gt4037, hg4037, hd4037, p4037,
        d4038, g4038, gt4038, hg4038, hd4038, p4038,
        d4039, g4039, gt4039, hg4039, hd4039, p4039,
        d4040, g4040, gt4040, hg4040, hd4040, p4040,
        d4062, g4062, gt4062, hg4062, hd4062, p4062,
        d4142, g4142, gt4142, hg4142, hd4142, p4142,
        d4048, g4048, gt4048, hg4048, hd4048, p4048,
        d4049, g4049, gt4049, hg4049, hd4049, p4049,
        d4050, g4050, gt4050, hg4050, hd4050, p4050,
        d4051, g4051, gt4051, hg4051, hd4051, p4051,
        d4057, g4057, gt4057, hg4057, hd4057, p4057,


    } = req.body;

    const defectives = {
        d9009: d9009, d9015: d9015, d4034: d4034,
        d4035: d4035, d4036: d4036, d4037: d4037,
        d4038: d4038, d4039: d4039, d4040: d4040,
        d4062: d4062, d4142: d4142, d4048: d4048,
        d4049: d4049, d4050: d4050, d4051: d4051,
        d4057: d4057
    }
    const guards = {
        g9009: g9009, g9015: g9015, g4034: g4034,
        g4035: g4035, g4036: g4036, g4037: g4037,
        g4038: g4038, g4039: g4039, g4040: g4040,
        g4062: g4062, g4142: g4142, g4048: g4048,
        g4049: g4049, g4050: g4050, g4051: g4051,
        g4057: g4057
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
        range: "Sec-3!A:AB", //state the horizontal range and which sheet you are appending data to
        valueInputOption: "USER_ENTERED", //This will convert data into proper formats (like date into date not string), so won't take raw data
        resource: {
            values: [
                [date, employee, shift,
                    nst9009, sst9009, gt9015, gt4034, gt4035, gt4036,
                    gt4037, gt4038, gt4039, gt4040, gt4062, gt4142,
                    gt4048, gt4049, gt4050, gt4051, gt4057,
                    isAllGuardsChecked, defectsExist, '-',
                ], //these are the values that will be input into a single row, order matters
            ]
        }
    });

    const allDefects = [
        hd9009, hd9015, hd4034, hd4035, hd4036,
        hd4037, hd4038, hd4039, hd4040, hd4062,
        hd4142, hd4048, hd4049, hd4050, hd4051,
        hd4057, hg9009, hg9015, hg4034, hg4035,
        hg4036, hg4037, hg4038, hg4039, hg4040,
        hg4062, hg4142, hg4048, hg4049, hg4050,
        hg4051, hg4057
    ]

    const prefixes = [
        '1739009', '1439015', '1444034', '1444035',
        '1444036', '1444037', '1444038', '1444039',
        '1444040', '1444062', '1744142', '1444048',
        '1444049', '1444050', '1444051', '1444057',


    ]

    for (let i = 0; i < 16; i++) {
        if (allDefects[i]) {
            allDefects[i] = `${prefixes[i]}: ${allDefects[i]}`;
        }
    }
    const allDefectsString = allDefects.filter(Boolean).join("\n");

    const allPriorities = [
        p9009, p9015, p4034, p4035, p4036,
        p4037, p4038, p4039, p4040, p4062,
        p4142, p4048, p4049, p4050, p4051,
        p4057
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
    res.redirect("/secondary3Checklist");

}