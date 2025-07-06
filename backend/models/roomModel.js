const { poolPromise } = require('../config/db');
const sql = require('mssql');


async function getAvailableRooms(checkin_date, checkout_date) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('check_in_date', sql.DateTime, checkin_date);
    request.input('check_out_date', sql.DateTime, checkout_date);
    
    const result = await request.query(`
      SELECT DISTINCT room_package_id
      FROM dbo.checkAvailableRoom(@check_in_date, @check_out_date)
    `);

    //console.log('Available rooms:', result.recordset);
    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

async function getAvailableRoomTypes(checkin_date, checkout_date) {
  try {
    const availableRooms = await getAvailableRooms(checkin_date, checkout_date);

    if (!availableRooms || availableRooms.length === 0) return [];

    const roomTypeIds = [...new Set(availableRooms.map(room => room.room_type_id))];

    if (roomTypeIds.length === 0) return [];

    const pool = await poolPromise;
    const request = pool.request();

    // Đưa từng id vào query bằng @param để tránh lỗi SQL injection
    const conditions = roomTypeIds.map((id, index) => {
      const paramName = `id${index}`;
      request.input(paramName, sql.Int, id);
      return `@${paramName}`;
    });

    const query = `
      SELECT * FROM Room_types
      WHERE room_type_id IN (${conditions.join(',')})
    `;

    const result = await request.query(query);
    return result.recordset;

  } catch (error) {
    console.error('Lỗi lấy danh sách loại phòng:', error);
    throw error;
  }
}

async function getTypeAndPackageAvailable(checkin_date, checkout_date) {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('check_in_date', sql.DateTime, checkin_date);
    request.input('check_out_date', sql.DateTime, checkout_date);
    
    const result = await request.query(`
      SELECT DISTINCT r.room_type_id, r.room_package_id
      FROM dbo.checkAvailableRoom(@check_in_date, @check_out_date) AS available
      JOIN Rooms r ON r.room_id = available.room_id
    `);

    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

async function getPackage() {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request.query(`
      SELECT 
        rp.room_package_id AS id,
        rp.room_package_name AS name,
        ISNULL(STRING_AGG(rpo.room_package_offer, '||'), '') AS benefits,
        rp.list_price AS originalPrice,
        rp.sale_price AS discountPrice,
        CASE WHEN rp.room_package_status = 1 THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS available
      FROM room_packages rp
      LEFT JOIN room_package_offers rpo 
        ON rp.room_package_id = rpo.room_package_id
      GROUP BY 
        rp.room_package_id, 
        rp.room_package_name, 
        rp.list_price, 
        rp.sale_price, 
        rp.room_package_status;
    `);

    // Chuyển chuỗi benefits thành mảng
    const formatted = result.recordset.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      benefits: pkg.benefits
        ? pkg.benefits.split('||').map(b => b.trim()).filter(Boolean)
        : [],
      originalPrice: pkg.originalPrice,
      discountPrice: pkg.discountPrice,
      available: pkg.available
    }));

    return formatted;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}



async function getPackageOffers() {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request.query(`SELECT * FROM room_package_offers;`);

    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

async function getRoomType() {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Truy vấn tất cả dữ liệu liên quan
    const [roomTypesResult, photosResult, amenitiesResult, packagesResult, offersResult] = await Promise.all([
      request.query(`SELECT * FROM room_types`),
      request.query(`SELECT * FROM room_type_photos`),
      request.query(`SELECT * FROM room_type_amenities`),
      request.query(`SELECT * FROM room_packages`),
      request.query(`SELECT * FROM room_package_offers`)
    ]);

    const roomTypes = roomTypesResult.recordset;
    const photos = photosResult.recordset;
    const amenities = amenitiesResult.recordset;
    const packages = packagesResult.recordset;
    const offers = offersResult.recordset;

    // Gộp dữ liệu theo interface
    const result = roomTypes.map(rt => {
      const roomTypePhotos = photos
        .filter(p => p.room_type_id === rt.room_type_id)
        .map(p => p.room_type_photo);

      const roomTypeAmenities = amenities
        .filter(a => a.room_type_id === rt.room_type_id)
        .map(a => a.room_type_amenity);

      const roomTypePackages = packages
        .filter(p => p.room_type_id === rt.room_type_id)
        .map(p => {
          const packageOffers = offers
            .filter(o => o.room_package_id === p.room_package_id)
            .map(o => o.room_package_offer);

          return {
            id: p.room_package_id,
            name: p.room_package_name,
            benefits: packageOffers,
            originalPrice: p.list_price,
            discountPrice: p.sale_price,
            available: p.room_package_status === 1
          };
        });

      return {
        id: rt.room_type_id,
        name: rt.room_type_name,
        images: roomTypePhotos,
        area: rt.room_type_area + "m²",
        view: rt.view_direction,
        maxGuests: rt.max_guests,
        beds: rt.room_type_beds,
        bathrooms: rt.room_type_bathrooms,
        description: rt.room_type_description,
        amenities: roomTypeAmenities,
        packages: roomTypePackages
      };
    });

    return result;
  } catch (error) {
    console.error("DB Error:", error);
    throw error;
  }
}

async function getRoomTypeByRomPackageId(room_package_id) {
  const pool = await poolPromise;
  const request = pool.request();
  request.input('room_package_id', sql.Int, room_package_id); 
  res = await request.query(`SELECT room_type_id FROM Rooms WHERE room_package_id = @room_package_id`);
  return res.recordset[0];
}

async function getMaxRoomNumber(room_package_id) {
  const pool = await poolPromise;
  const request = pool.request();
  request.input('room_package_id', sql.Int, room_package_id); 
  maxNumber = await request.query(`
        SELECT MAX(room_number) AS maxRoomNumber FROM Rooms WhERE room_package_id = @room_package_id
      `);
  return maxNumber;
}


async function addRoom(room_package_id, room_notes, room_number){
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('room_package_id', sql.Int, room_package_id);
    request.input('room_notes', sql.NVarChar, room_notes);
    room_type = await getRoomTypeByRomPackageId(room_package_id);
    request.input('room_type_id', sql.Int, room_type.room_type_id);

    
    if (!room_number) {
      const maxRoom = await getMaxRoomNumber(room_package_id);
      const lastNumber = parseInt(maxRoom?.recordset[0]?.maxRoomNumber || '0', 10);
      const nextRoomNumber = String(lastNumber + 1).padStart(3, '0'); // '001', '002', ...
      request.input('room_number', sql.Char(3), nextRoomNumber);
    } else {
      request.input('room_number', sql.Char(3), room_number);
    }
    result = await request.query(`
      INSERT INTO Rooms (room_package_id, room_notes, room_number, room_status, room_type_id)
      VALUES (@room_package_id, @room_notes, @room_number, N'Trống', @room_type_id)
    `);
    return result.rowsAffected[0] > 0; 
  }
  catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}



module.exports = {
  getAvailableRooms,
  getAvailableRoomTypes,
  getTypeAndPackageAvailable,
  getPackage,
  getPackageOffers,
  getRoomType,
  addRoom
};
