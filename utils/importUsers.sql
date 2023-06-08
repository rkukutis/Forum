COPY users(id, username, email, password, role, status, created_at)
FROM 'users.csv'
DELIMITER ','
CSV HEADER;