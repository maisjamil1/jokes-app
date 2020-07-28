DROP TABLE IF EXISTS joketb;
CREATE TABLE joketb(
    id SERIAL PRIMARY KEY,
    jokenumber VARCHAR(255),
    typee VARCHAR(255),
    setup VARCHAR(255),
    punchline TEXT
);