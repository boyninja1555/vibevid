const sql = require("msnodesqlv8")
const config = require("./dbConfig.js")

async function getLoginDetails() {
    return new Promise((resolve, reject) => {
        sql.query(config, "select * from vfiles", (err, rows) => {
            if (err) {
                return reject(err)
            }

            resolve(JSON.parse(JSON.stringify(rows)))
        })
    })
}

async function uploadVideo(Title, Description, Tags, ThumbnailP, VideoP) {
    sql.query(config, `INSERT INTO vfiles\nvalues (${Title}, ${Description}, ${Tags}, ${ThumbnailP}, ${VideoP})`)
}

// Use below if all files are converted to modules
module.exports = {
    getLoginDetails: getLoginDetails,
    uploadVideo: uploadVideo
}
