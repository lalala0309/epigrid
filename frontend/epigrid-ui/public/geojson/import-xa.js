const fs = require("fs");
const mysql = require("mysql2/promise");

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

    const raw = fs.readFileSync("./gadm41_VNM_3.json", "utf8");
    const geo = JSON.parse(raw);

    for (const feature of geo.features) {

        const props = feature.properties;

        const districtGADM = props.GID_2;  // ví dụ: VNM.1.1_1
        const wardGADM = props.GID_3;      // ví dụ: VNM.1.1.3_1
        const ten = normalizeName(props.NAME_3);

        // 1️⃣ tìm huyện cha
        const [rows] = await conn.execute(
            `SELECT maKhuVuc 
             FROM khu_vuc 
             WHERE maGADM = ? AND capDo = 'HUYEN'`,
            [districtGADM]
        );

        if (rows.length === 0) {
            console.log("Không tìm thấy huyện:", districtGADM);
            continue;
        }

        const parentId = rows[0].maKhuVuc;

        // 2️⃣ insert xã
        await conn.execute(
            `INSERT INTO khu_vuc 
             (maGADM, tenKhuVuc, capDo, maKhuVucCha)
             VALUES (?, ?, 'XA', ?)
             ON DUPLICATE KEY UPDATE tenKhuVuc = VALUES(tenKhuVuc)`,
            [wardGADM, ten, parentId]
        );

        console.log("Inserted XA:", wardGADM, ten);
    }

    console.log("DONE IMPORT XÃ!");
    await conn.end();
}

run();