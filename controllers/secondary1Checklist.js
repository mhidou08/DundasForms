
const path = require('path');
const { google } = require('googleapis');

module.exports.renderSecondary1Checklist = (req, res) => {
    res.sendFile(path.join(__dirname, '/..', 'views', 'secondary1Checklist.html'));
};



module.exports.postSecondary1Checklist = async (req, res) => {

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
        d1302, g1302, dst1302, ndst1302, hg1302, hd1302, p1302,
        d1032, g1032, dst1032, ndst1032, hg1032, hd1032, p1032,
        d1028, g1028, dst1028, ndst1028, hg1028, hd1028, p1028,
        d2349, g2349, dst2349, ndst2349, hg2349, hd2349, p2349,
        d4055, g4055, gt4055, hg4055, hd4055, p4055,
        d4058, g4058, gt4058, hg4058, hd4058, p4058,
        d4045, g4045, gt4045, hg4045, hd4045, p4045,
        d4120, g4120, gt4120, hg4120, hd4120, p4120,
        d2009, g2009, gt2009, hg2009, hd2009, p2009,
    } = req.body;


    const defectives = {
        d1302: d1302, d1032: d1032, d1028: d1028,
        d2349: d2349, d4055: d4055, d4058: d4058,
        d4045: d4045, d4120: d4120, d2009: d2009,
    }
    const guards = {
        g1302: g1302, g1032: g1032, g1028: g1028,
        g2349: g2349, g4055: g4055, g4058: g4058,
        g4045: g4045, g4120: g4120, g2009: g2009,
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
        range: "Sec-1!A:AB", //state the horizontal range and which sheet you are appending data to
        valueInputOption: "USER_ENTERED", //This will convert data into proper formats (like date into date not string), so won't take raw data
        resource: {
            values: [
                [date, employee, shift,
                    dst1302, ndst1302, dst1032, ndst1032,
                    dst1028, ndst1028, dst2349, ndst2349,
                    gt4055, gt4058, gt4045, gt4120, gt2009,
                    isAllGuardsChecked, defectsExist, '-',
                ], //these are the values that will be input into a single row, order matters
            ]
        }
    });

    const allDefects = [
        hd1302, hd1032, hd1028, hd2349, hd4055,
        hd4058, hd4045, hd4120, hd2009, hg1302,
        hg1032, hg1028, hg2349, hg4055,
        hg4058, hg4045, hg4120, hg2009,
    ]

    const prefixes = [
        '1441302', '1741032', '1741028', '10142349', '1444055',
        '1444058', '1444045', '1444120', '1442009',
    ]

    for (let i = 0; i < 9; i++) {
        if (allDefects[i]) {
            allDefects[i] = `${prefixes[i]}: ${allDefects[i]}`;
        }
    }

    const allDefectsString = allDefects.filter(Boolean).join("\n");

    const allPriorities = [
        p1302, p1032, p1028, p2349,
        p4055, p4058, p4045, p4120,
        p2009,
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
    res.redirect("/secondary1Checklist");

}