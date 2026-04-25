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

    // Kết nối cơ sở dữ liệu
    const conn = await mysql.createConnection({
        host: "localhost",
        user: "epigrid_admin",
        password: "123456",
        database: "db_khu_vuc"
    });

    // Đọc và phần tích dữ liệu, chuẩn sang object để xử lý
    const raw = fs.readFileSync("./gadm41_VNM_2.json", "utf8");
    const geo = JSON.parse(raw);

    for (const feature of geo.features) {

        // mã tỉnh, mã huyện và tên huyện mỗi lần lặp
        const props = feature.properties;
        const provinceGADM = props.GID_1;
        const districtGADM = props.GID_2;

        // Chuẩn hoá tên 
        const ten = normalizeName(props.NAME_2);

        // Tìm tỉnh cha 
        const [rows] = await conn.execute(
            `SELECT maKhuVuc 
             FROM khu_vuc 
             WHERE maGADM = ? AND capDo = 'TINH'`,
            [provinceGADM]
        );

        // Trường hợp không có tỉnh cha
        if (rows.length === 0) {
            console.log("Không tìm thấy tỉnh:", provinceGADM);
            continue;
        }

        // Insert dữ liệu huyện
        const parentId = rows[0].maKhuVuc;
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