const fs = require("fs");
const mysql = require("mysql2/promise");

// Chuẩn hóa tên tỉnh
function normalizeName(name) {
    return name
        .normalize("NFC")
        .replace(/(?!^)(\p{Lu})/gu, " $1")
        .replace(/\s*-\s*/g, " - ")
        .replace(/\s+/g, " ")
        .trim();
}

async function run() {

    const conn = await mysql.createConnection({
        host: "localhost",
        user: "epigrid_admin",
        password: "123456",
        database: "db_khu_vuc"
    });

    const raw = fs.readFileSync("./gadm41_VNM_1.json", "utf8");
    const geo = JSON.parse(raw);

    for (const feature of geo.features) {

        const props = feature.properties;

        const maGADM = props.GID_1;      // ví dụ: VNM.7_1
        const ten = normalizeName(props.NAME_1);

        await conn.execute(
            `INSERT INTO khu_vuc 
             (maGADM, tenKhuVuc, capDo, maKhuVucCha)
             VALUES (?, ?, 'TINH', NULL)
             ON DUPLICATE KEY UPDATE 
                 tenKhuVuc = VALUES(tenKhuVuc)`,
            [maGADM, ten]
        );

        console.log("Inserted TINH:", maGADM, ten);
    }

    console.log("DONE IMPORT TỈNH!");
    await conn.end();
}

run();