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

    const raw = fs.readFileSync("./gadm41_VNM_2.json", "utf8");
    const geo = JSON.parse(raw);

    for (const feature of geo.features) {

        const props = feature.properties;

        const provinceGADM = props.GID_1;   // ví dụ: VNM.1_1
        const districtGADM = props.GID_2;   // ví dụ: VNM.1.3_1
        const ten = normalizeName(props.NAME_2);

        // 1️⃣ tìm tỉnh cha
        const [rows] = await conn.execute(
            `SELECT maKhuVuc 
             FROM khu_vuc 
             WHERE maGADM = ? AND capDo = 'TINH'`,
            [provinceGADM]
        );

        if (rows.length === 0) {
            console.log("Không tìm thấy tỉnh:", provinceGADM);
            continue;
        }

        const parentId = rows[0].maKhuVuc;

        // 2️⃣ insert huyện
        await conn.execute(
            `INSERT INTO khu_vuc 
             (maGADM, tenKhuVuc, capDo, maKhuVucCha)
             VALUES (?, ?, 'HUYEN', ?)
             ON DUPLICATE KEY UPDATE tenKhuVuc = VALUES(tenKhuVuc)`,
            [districtGADM, ten, parentId]
        );

        console.log("Inserted HUYEN:", districtGADM, ten);
    }

    console.log("DONE IMPORT HUYỆN!");
    await conn.end();
}

run();