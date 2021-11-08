
const path = require('path');
const { google } = require('googleapis');

module.exports.renderSecondary2Checklist = (req, res) => {
    res.sendFile(path.join(__dirname, '/..', 'views', 'secondary2Checklist.html'));
};



module.exports.postSecondary2Checklist = async (req, res) => {

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
        d1304, g1304, dst1304, ndst1304, hg1304, hd1304, p1304,
        d1318, g1318, dst1318, ndst1318, hg1318, hd1318, p1318,
        d1078, g1078, dst1078, ndst1078, hg1078, hd1078, p1078,
        d1080, g1080, dst1080, ndst1080, hg1080, hd1080, p1080,
        d4054, g4054, gt4054, hg4054, hd4054, p4054,
        d4052, g4052, gt4052, hg4052, hd4052, p4052,
        d4041, g4041, gt4041, hg4041, hd4041, p4041,
        d4043, g4043, gt4043, hg4043, hd4043, p4043,
        d2010, g2010, gt2010, hg2010, hd2010, p2010,
    } = req.body;

    const defectives = {
        d1304: d1304, d1318: d1318, d1078: d1078,
        d1080: d1080, d4054: d4054, d4052: d4052,
        d4041: d4041, d4043: d4043, d2010: d2010
    }
    const guards = {
        g1304: g1304, g1318: g1318, g1078: g1078,
        g1080: g1080, g4054: g4054, g4052: g4052,
        g4041: g4041, g4043: g4043, g2010: g2010
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
        range: "Sec-2!A:AB", //state the horizontal range and which sheet you are appending data to
        valueInputOption: "USER_ENTERED", //This will convert data into proper formats (like date into date not string), so won't take raw data
        resource: {
            values: [
                [date, employee, shift,
                    dst1304, ndst1304, dst1318, ndst1318,
                    dst1078, ndst1078, dst1080, ndst1080,
                    gt4054, gt4052, gt4041, gt4043, gt2010,
                    isAllGuardsChecked, defectsExist, '-',
                ], //these are the values that will be input into a single row, order matters
            ]
        }
    });

    const allDefects = [
        hd1304, hd1318, hd1078, hd1080,
        hd4054, hd4052, hd4041, hd4043, hd2010, hg1304, hg1318,
        hg1078, hg1080, hg4054, hg4052,
        hg4041, hg4043, hg2010
    ]

    const prefixes = [
        '1441304', '1441318', '1641078', '1641080',
        '1444054', '1444052', '1444041', '1444043', '1442010'
    ]

    for (let i = 0; i < 10; i++) {
        if (allDefects[i]) {
            allDefects[i] = `${prefixes[i]}: ${allDefects[i]}`;
        }
    }

    const allDefectsString = allDefects.filter(Boolean).join("\n");

    const allPriorities = [
        p1304, p1318, p1078, p1080,
        p4054, p4052, p4041, p4043, p2010
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
    res.redirect("/secondary2Checklist");

}